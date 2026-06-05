// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const restoreStock = searchParams.get("restoreStock") === "true";
    const hideOnly = searchParams.get("hideOnly") === "true";

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // إذا كان hideOnly = true (إخفاء من العرض فقط)
    if (hideOnly) {
      // لا نفعل شيئاً في Sanity، فقط نرجع نجاح
      console.log(`Order ${orderId} hidden from view only (no changes to database)`);
      
      return NextResponse.json({ 
        success: true, 
        message: "Order removed from view only",
        action: "hide_only"
      });
    }

    // إذا كان restoreStock = true (إلغاء الطلب بالكامل)
    if (restoreStock) {
      // جلب الطلب للحصول على تفاصيل المنتجات
      const order = await sanityClient.fetch(
        `*[_type == "order" && _id == $orderId][0]{
          products[]{
            product->{_id, stock},
            quantity
          }
        }`,
        { orderId }
      );

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // بدء معاملة (transaction) لاستعادة المخزون
      let transaction = sanityClient.transaction();

      for (const item of order.products) {
        const productId = item.product._id;
        const quantity = item.quantity;
        
        transaction = transaction.patch(productId, (patch) => 
          patch.inc({ stock: quantity }) // إضافة الكمية مرة أخرى إلى المخزون
        );
      }

      await transaction.commit();
      console.log(`Stock restored for order ${orderId}`);

      // حذف الطلب من Sanity
      await sanityClient.delete(orderId);
      console.log(`Order ${orderId} deleted from Sanity`);

      // إعادة التحقق من المسارات المتأثرة
      revalidatePath("/orders");
      revalidatePath("/");

      return NextResponse.json({ 
        success: true, 
        message: "Order cancelled and stock restored",
        action: "cancelled_completely"
      });
    }

    // افتراضياً: حذف الطلب فقط بدون استعادة المخزون
    await sanityClient.delete(orderId);
    console.log(`Order ${orderId} deleted from Sanity (no stock restore)`);

    revalidatePath("/orders");
    revalidatePath("/");

    return NextResponse.json({ 
      success: true, 
      message: "Order deleted from database",
      action: "deleted"
    });
    
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}