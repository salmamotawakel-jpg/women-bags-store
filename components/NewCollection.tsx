
// components/NewCollection.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../sanity/lib/image";
import { NewProduct } from "../sanity/queries/newCollection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface NewCollectionProps {
  products: NewProduct[];
}

const NewCollection = ({ products }: NewCollectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer لتأثير الظهور
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2, // يظهر عندما يكون 20% من القسم مرئيًا
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // تحديث عدد البطاقات المرئية حسب حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 768) {
        setVisibleCount(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // التشغيل التلقائي
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => 
        prev + visibleCount >= products.length ? 0 : prev + 1
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length, visibleCount]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev + visibleCount >= products.length ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => 
      prev - 1 < 0 ? Math.max(0, products.length - visibleCount) : prev - 1
    );
  };

  if (products.length === 0) {
    return null;
  }

  const cardWidth = `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 16}px)`;

  return (
    <div 
      ref={sectionRef}
      className="w-full py-8 md:py-12 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header مع تأثير الظهور */}
        <div
          className={`
            flex items-center justify-between mb-8
            transition-all duration-700 ease-out
            ${isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
            }
          `}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-light text-gray-800">New Collection</h2>
            <div className="w-16 h-0.5 bg-pink-800 mt-2" />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-pink-800 hover:bg-pink-50 transition-all duration-300"
              aria-label="السابق"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-pink-800 hover:bg-pink-50 transition-all duration-300"
              aria-label="التالي"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* السلايدر مع تأثير الظهور المتأخر */}
        <div
          className={`
            transition-all duration-700 delay-150 ease-out
            ${isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
            }
          `}
        >
          <div className="relative overflow-hidden">
            <div 
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {products.map((product, idx) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug.current}`}
                  className="group flex-shrink-0"
                  style={{ width: cardWidth }}
                >
                  <div
                    className={`
                      bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg
                      transition-all duration-500 ease-out
                      ${isVisible 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-12"
                      }
                    `}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      {product.images?.[0]?.asset?.url ? (
                        <Image
                          src={urlFor(product.images[0]).width(400).height(400).url()}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                          unoptimized={true}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 text-center">
                      <h3 className="text-sm md:text-base font-medium text-gray-800 line-clamp-1 group-hover:text-pink-800 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-lg md:text-xl font-light text-gray-900 mt-2">
                        {product.price?.toLocaleString()} <span className="text-xs">MAD</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* نقاط المؤشر */}
          {products.length > visibleCount && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(products.length / visibleCount) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(idx * visibleCount);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / visibleCount) === idx
                      ? "w-8 bg-pink-800"
                      : "w-4 bg-gray-300 hover:bg-pink-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCollection;