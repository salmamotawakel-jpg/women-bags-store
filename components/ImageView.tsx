"use client";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number | undefined;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [active, setActive] = useState(images[0]);
  const [zoomMode, setZoomMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // تحديث الفهرس عند تغيير الصورة النشطة
  useEffect(() => {
    if (active && images.length > 0) {
      const index = images.findIndex(img => img._key === active._key);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [active, images]);

  // التنقل بين الصور
  const goToNext = () => {
    if (images.length === 0) return;
    const nextIndex = (currentIndex + 1) % images.length;
    setActive(images[nextIndex]);
  };

  const goToPrev = () => {
    if (images.length === 0) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setActive(images[prevIndex]);
  };

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">لا توجد صور متاحة</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 md:space-y-4">
      {/* الصورة الرئيسية - تصميم للموبايل */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active?._key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-square w-full bg-gray-50 rounded-xl overflow-hidden touch-pan-y"
            onClick={() => setZoomMode(!zoomMode)}
          >
            <Image
              src={urlFor(active).width(200).height(200).url()}
              alt="صورة المنتج"
              width={250} height={250} unoptimized={true}
              priority
              className={`object-contain p-4 ${zoomMode ? 'cursor-zoom-out' : 'cursor-zoom-in'} ${isStock === 0 ? "opacity-50" : ""}`}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* مؤشر المخزون */}
            {isStock === 0 && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                نفذت الكمية
              </div>
            )}

            {/* زر التكبير للشاشات الصغيرة */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomMode(!zoomMode);
              }}
              className="absolute bottom-3 left-3 md:hidden bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              aria-label={zoomMode ? "تصغير الصورة" : "تكبير الصورة"}
            >
              <ZoomIn size={20} className="text-gray-700" />
            </button>

            {/* أزرار التنقل للشاشات الصغيرة */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 md:hidden bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  aria-label="الصورة السابقة"
                >
                  <ChevronLeft size={20} className="text-gray-700" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 md:hidden bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                  aria-label="الصورة التالية"
                >
                  <ChevronRight size={20} className="text-gray-700" />
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* مؤشر الصور للشاشات الصغيرة */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 mt-3 md:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(images[index])}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}
                aria-label={`انتقل إلى الصورة ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* شريط التقدم للشاشات الصغيرة */}
        {images.length > 1 && (
          <div className="mt-2 md:hidden">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-center text-gray-500 mt-1">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        )}
      </div>

      {/* معاينات الصور - تصميم مختلف للشاشات الصغيرة */}
      {images.length > 1 && (
        <div>
          {/* عنوان للشاشات الصغيرة */}
          <h3 className="text-sm font-medium text-gray-700 mb-2 md:hidden">
            معاينات الصور
          </h3>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <button
                key={image?._key}
                onClick={() => setActive(image)}
                className={`
                  relative aspect-square border-2 rounded-lg overflow-hidden
                  transition-all duration-200
                  ${active?._key === image?._key 
                    ? 'border-blue-500 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  ${isStock === 0 ? "opacity-70" : ""}
                `}
                aria-label={`عرض الصورة ${index + 1}`}
                aria-current={active?._key === image?._key}
              >
                <Image
                  src={urlFor(image).width(200).height(200).url()}
                  alt={`معاينة ${index + 1}`}
                  height={250} width={250} unoptimized={true}
                  className="object-cover"
                  sizes="(max-width: 640px) 25vw, (max-width: 768px) 16.66vw, 100px"
                />
                
                {/* رقم الصورة للشاشات الصغيرة */}
                <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center
                  ${active?._key === image?._key 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* وضع التكبير الكامل للموبايل */}
      {zoomMode && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center md:hidden"
          onClick={() => setZoomMode(false)}
        >
          <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={urlFor(active).width(200).height(200).url()}
              alt="صورة مكبرة"
              height={200} width={200} unoptimized={true}
              className="object-contain"
              priority
            />
            <button
              onClick={() => setZoomMode(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm"
              aria-label="إغلاق التكبير"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageView;