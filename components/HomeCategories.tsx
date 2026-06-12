



"use client"
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { urlFor } from "../sanity/lib/image";
import Link from "next/link";
import Title from "./Title";
import { Category } from "../sanity.types";

const HomeCategories = ({ categories }: { categories: Category[] }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.01,
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

  return (
    <div 
      ref={sectionRef}
      className={`
        my-12 md:my-20
        transition-all duration-1000 ease-out
        ${isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-16"
        }
      `}
    >
      {/* العنوان مع Dancing Script */}
      <div className="flex items-center justify-between mb-8">
        <Title className="text-2xl md:text-3xl font-bold text-shop_dark_blue dark:text-shop_white">
          <span
            style={{
              fontSize: '1.4rem',
              fontFamily: "'Dancing Script', 'cursive'",
              fontWeight: '500',
              letterSpacing: '0.01em',
              display: 'inline-block'
            }}
          >
            Popular categories
          </span>
        </Title>
        <div
          className="
            text-shop_dark_blue dark:text-shop_light_orange
            hover:text-shop_btn_dark_green dark:hover:text-shop_light_pink
            font-semibold text-sm md:text-base
            transition-colors duration-300
            flex items-center gap-1
          "
        >
          show all
          <span className="text-lg">←</span>
        </div>
      </div>

      {/* الفئات الدائرية */}
      <div className="
        flex
        overflow-x-auto
        gap-6 md:gap-8
        pb-4
        scrollbar-hide
      ">
        {categories?.map((category, index) => (
          <Link
            key={category?._id}
            href={`/category/${category?.slug?.current}`}
            className={`
              flex flex-col items-center
              min-w-[80px] md:min-w-[96px]
              flex-shrink-0
              group
              transition-all duration-700 ease-out
              ${isVisible 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 -translate-x-8"
              }
            `}
            style={{
              transitionDelay: isVisible ? `${index * 100}ms` : "0ms"
            }}
          >
            {/* الدائرة */}
            <div className="
              relative
              w-20 h-20 md:w-24 md:h-24
              mb-3
            ">
              <div className="
                absolute inset-0
                rounded-full
                bg-gradient-to-br from-white to-shop_white
                dark:from-shop_dark_blue/40 dark:to-shop_dark_blue/20
                border-2 border-shop_light_blue/20
                dark:border-shop_light_orange/10
                shadow-lg
                group-hover:shadow-xl
                group-hover:border-shop_light_green
                dark:group-hover:border-shop_light_orange
                transition-all duration-300
              " />
              
              {category?.image && (
                <div className="
                  absolute inset-0
                  rounded-full
                  overflow-hidden
                  p-2
                ">
                  <Image
                    src={urlFor(category?.image).width(200).height(200).url()}
                    alt={category?.title || "Category"}
                    width={112} 
                    height={112}
                    unoptimized={true}
                    className="
                      object-cover
                      rounded-full
                      group-hover:scale-110
                      transition-transform duration-300
                    "
                  />
                </div>
              )}
            </div>

            {/* الاسم */}
            <span className="
              text-center
              text-sm md:text-base
              font-semibold
              text-shop_dark_blue
              dark:text-shop_white
              group-hover:text-shop_light_green
              dark:group-hover:text-shop_light_orange
              transition-colors duration-300
              line-clamp-1
            ">
              {category?.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;