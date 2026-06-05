
"use server"

import { createClient } from "next-sanity";
import { GroupedCartItems } from "@/store";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createCashOrder(data: {
  items: GroupedCartItems[];
  total: number;
  customerName: string;
  customerEmail: string;
  clerkUserId?: string | null;
  guestSessionId?: string | null;
  phone: string;
  address: string;
}) {
  try {
    let finalGuestSessionId: string | null | undefined = data.guestSessionId;
    
    if (!data.clerkUserId && !finalGuestSessionId) {
      const cookieStore = await cookies();
      finalGuestSessionId = cookieStore.get("guestSessionId")?.value;
      
      if (!finalGuestSessionId) {
        const { v4: uuidv4 } = await import('uuid');
        finalGuestSessionId = uuidv4();
      }
    }
    
    console.log("Creating order with guestSessionId:", finalGuestSessionId);

    const token = process.env.SANITY_API_WRITE_TOKEN;
    if (!token) {
      throw new Error("SANITY_API_WRITE_TOKEN is not defined");
    }

    const WriteClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: "2026-03-12",
      useCdn: false,
      token: token,
    });

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const orderDoc = {
      _type: "order",
      orderNumber: orderNumber,
      clerkUserId: data.clerkUserId || undefined,
      guestSessionId: finalGuestSessionId || undefined,
      customerName: data.customerName || "Guest",
      email: data.customerEmail || `guest_${Date.now()}@example.com`,
      products: data.items.map((item) => ({
        _key: crypto.randomUUID(),
        product: {
          _type: "reference",
          _ref: item.product?._id,
        },
        quantity: item.quantity,
      })),
      totalPrice: data.total,
      currency: "MAD",
      amountDiscount: 0,
      address: {
        name: data.customerName || "Guest",
        address: data.address,
        city: "",
        state: "",
        zip: "",
      },
      phone: data.phone,
      status: "pending",
      orderDate: new Date().toISOString(),
      stripeCheckoutSessionId: "",
      stripeCustomerId: "",
      stripePaymentIntentId: "",
      invoice: {},
    };

    const result = await WriteClient.create(orderDoc);
    console.log("Order created successfully:", result._id);
    console.log("Saved with guestSessionId:", finalGuestSessionId);
    
    revalidatePath("/orders");
    
    return { 
      success: true, 
      orderId: result._id,
      orderNumber: orderNumber 
    };
  } catch (error) {
    console.error("Error creating cash order:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to create order: ${errorMessage}`);
  }
}