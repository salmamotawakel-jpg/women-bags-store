

"use client";

import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Star } from "lucide-react"; // استخدم lucide-react بدلاً من @sanity/icons
import Title from "./Title";
import ProductSideMenu from "./ProductSideMenu";
import AddToCartButton from "./AddToCartButton";

// دوال مساعدة لاستخراج slug و title من الفئة بأمان
function getCategorySlug(cat: any): string | undefined {
  if (cat && typeof cat === 'object') {
    if (cat.slug?.current) return cat.slug.current;
  }
  return undefined;
}

function getCategoryTitle(cat: any): string {
  if (cat && typeof cat === 'object') {
    if (cat.title) return cat.title;
  }
  return "";
}

type ExtendedProduct = Product & { originalPrice?: number };

const ProductCard = ({ product }: { product: ExtendedProduct }) => {
  const isInStock = (product?.stock ?? 0) > 0; // تصحيح: stock > 0
  const stockText = isInStock ? "متوفر" : "غير متوفر";
  const rating = 4;
  const reviewsCount = 5;

  const hasDiscount = 
    product?.originalPrice !== undefined && 
    product?.price !== undefined && 
    product.originalPrice > product.price;

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return "غير متوفر";
    return `${price.toFixed(2)} MAD`;
  };

  // الحصول على رابط الصورة بأمان
  const getImageUrl = () => {
    if (!product?.images?.[0]) return null;
    try {
      return urlFor(product.images[0]).width(400).height(400).quality(80).url();
    } catch (error) {
      console.error("Error getting image URL:", error);
      return null;
    }
  };

  const imageUrl = getImageUrl();

  return (
    <div className="relative flex flex-col h-full text-sm border border-gray-200 rounded-lg overflow-hidden group bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <Link href={`/product/${product?.slug?.current}`} className="block w-full h-full">
            <Image
              src={imageUrl}
              alt={product?.name || "صورة المنتج"}
              width={400}
              height={400}
              unoptimized={true}
              priority={false}
              className={`w-full h-full object-contain transition-transform duration-500 bg-white p-2
                ${isInStock ? "group-hover:scale-110" : "opacity-60 grayscale"}`}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        
        {product?.status === "sale" && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-sm">تخفيض!</span>
          </div>
        )}

        {!isInStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-600 text-white">نفذت الكمية</span>
          </div>
        )}

        <div className="absolute top-2 right-2 z-10 md:hidden">
          <ProductSideMenu product={product} />
        </div>
      </div>

      <div className="flex flex-col grow p-3 space-y-2">
        
        {/* عرض الفئة بأمان */}
        {product?.categories && product.categories.length > 0 && (() => {
          const firstCat = product.categories[0];
          const slug = getCategorySlug(firstCat);
          const title = getCategoryTitle(firstCat);
          if (!slug || !title) return null;
          return (
            <Link href={`/category/${slug}`} className="block">
              <p className="text-xs font-medium text-gray-500 truncate hover:text-green-600 transition-colors">
                {title}
              </p>
            </Link>
          );
        })()}

        <Link href={`/product/${product?.slug?.current}`}>
          <Title className="font-semibold text-sm leading-tight line-clamp-2 hover:text-green-600 transition-colors min-h-10">
            {product?.name}
          </Title>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, index) => (
              <Star 
                key={index} 
                size={12} 
                className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                fill={index < rating ? "#fbbf24" : "none"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewsCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isInStock ? "bg-green-500" : "bg-red-500"}`} />
          <span className={`text-xs font-medium ${isInStock ? "text-green-600" : "text-red-600"}`}>{stockText}</span>
          {isInStock && (product?.stock ?? 0) > 0 && (
            <span className="text-xs text-gray-500">• {product?.stock} وحدة متبقية</span>
          )}
        </div>

        {/* عرض السعر */}
        <div className="mt-1">
          {hasDiscount ? (
            <div className="flex flex-col items-start">
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-gray-600 font-bold text-lg">
                {formatPrice(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-gray-800 font-bold text-lg">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-2">
          <AddToCartButton product={product} className="w-full rounded-lg py-2.5 text-sm font-medium" disabled={!isInStock} />
        </div>

        <div className="block md:hidden mt-2">
          <Link href={`/product/${product?.slug?.current}`} className="text-xs text-center text-gray-600 hover:text-green-600 transition-colors block py-1">
            معاينة سريعة →
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-500/30 rounded-lg pointer-events-none transition-colors duration-300" />
    </div>
  );
};

export default ProductCard;