

import AddToCartButton from "../../../../components/AddToCartButton";
import Container from "../../../../components/Container";
import FavoriteButton from "../../../../components/FavoriteButton";
import PriceFormatter from "../../../../components/PriceFormatter";
import ProductCharacteristics from "../../../../components/ProductCharacteristics";
import ProductImageGallery from "../../../../components/ProductIMageGallery";
import { getProductBySlug } from "../../../../sanity/queries";
import { CornerDownLeft, Truck, Star, RotateCcw, CheckCircle, Package, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import ProductClient from "./Pro";

// هذا Server Component - لا يحتاج use client
const SingleProductPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return notFound();
  }

  const hasDiscount = product?.originalPrice && product?.originalPrice > product?.price;
  const discountedPrice = hasDiscount ? product?.price : null;
  const originalPrice = hasDiscount ? product?.originalPrice : null;

  return (
    <Container className="py-6 md:py-12 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* ProductImageGallery - الجانب الأيسر */}
        {product?.images && (
          <div>
            <ProductImageGallery 
              images={product?.images} 
              video={product?.video}
              isStock={product?.stock} 
            />
          </div>
        )}
        
        {/* الجانب الأيمن - بيانات ثابتة */}
        <div className="space-y-6">
          {/* القسم 1: العنوان */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-light text-gray-800 tracking-wide">{product?.name}</h1>
          </div>
          
          {/* القسم 2: السعر */}
          <div className="flex items-baseline gap-3">
            {hasDiscount ? (
              <>
                <span className="text-3xl lg:text-4xl font-light text-gray-900">
                  <PriceFormatter amount={discountedPrice} />
                </span>
                <span className="text-gray-400 line-through text-lg">
                  <PriceFormatter amount={originalPrice} />
                </span>
              </>
            ) : (
              <span className="text-3xl lg:text-4xl font-light text-gray-900">
                <PriceFormatter amount={product?.price} />
              </span>
            )}
          </div>
          
          {/* القسم 3: حالة المخزون */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product?.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            <span className={`text-sm ${product?.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product?.stock > 0 ? "متوفر في المخزون" : "غير متوفر حالياً"}
            </span>
            {product?.stock > 0 && product?.stock < 20 && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                آخر {product?.stock} قطع
              </span>
            )}
          </div>
          
          {/* القسم 4: خيارات المنتج */}
          <div className="border-y border-gray-100 py-5 space-y-4">
            <ProductCharacteristics product={product} />
          </div>
          
          {/* القسم 5: أزرار الإجراء - Client Component */}
          <ProductClient product={product} />
          
          {/* القسم 6: مميزات التوصيل */}
          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="text-center">
              <Package size={20} className="mx-auto text-gray-500" />
              <p className="text-xs text-gray-600 mt-1">توصيل سريع</p>
              <p className="text-[10px] text-gray-400">2-3 أيام</p>
            </div>
            <div className="text-center">
              <RotateCcw size={20} className="mx-auto text-gray-500" />
              <p className="text-xs text-gray-600 mt-1">إرجاع مجاني</p>
              <p className="text-[10px] text-gray-400">14 يوم</p>
            </div>
            <div className="text-center">
              <CreditCard size={20} className="mx-auto text-gray-500" />
              <p className="text-xs text-gray-600 mt-1">دفع آمن</p>
              <p className="text-[10px] text-gray-400">طرق متعددة</p>
            </div>
          </div>
          
          {/* القسم 7: الوصف */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">عن المنتج</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product?.description}</p>
          </div>
          
          {/* القسم 8: معلومات إضافية */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Truck size={12} />
                <span>توصيل مجاني للطلبات فوق 500 درهم</span>
              </div>
              <div className="flex items-center gap-1">
                <CornerDownLeft size={12} />
                <span>إرجاع خلال 14 يوم</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-16"></div>
    </Container>
  );
};

export default SingleProductPage;


