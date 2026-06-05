

"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import { client } from "../sanity/lib/client";
import { Loader2 } from "lucide-react";
import Container from "./Container";
import { Product } from "../sanity.types";
import ProductCard from "./ProductCard";

const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // استعلام لجلب 18 منتج فقط
  const query = `*[_type == "product"] | order(_createdAt desc)[0...40]{
    ...,
    "category": categories[0]->title
  }`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query);
        setProducts(await response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // مراقبة وصول القسم عند التمرير
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
      <Container>
        {/* العنوان */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-shop_dark_blue dark:text-shop_white">
           Featured products
          </h2>
          <p className="text-sm text-shop_light_blue dark:text-shop_light_orange mt-1">
           14 of our top picks
          </p>
        </div>

        {/* حالة التحميل */}
        {loading ? (
          <div className="flex items-center justify-center py-20 min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-shop_light_green animate-spin" />
              <p className="text-shop_light_blue dark:text-shop_light_orange">
                Loading products .....
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* شبكة المنتجات */}
            <div className="
              grid grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-6
              gap-4
            ">
              {products.map((product, index) => (
                <motion.div
                  key={product?._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: isVisible ? index * 0.05 : 0 
                  }}
                  whileHover={{ y: -3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* ملاحظة عدد المنتجات */}
            <div className="mt-8 text-center">
              <p className="
                inline-block
                px-4 py-2
                rounded-full
                bg-shop_white/50
                dark:bg-shop_dark_blue/30
                text-sm text-shop_light_blue
                dark:text-shop_light_orange
                border border-shop_light_blue/20
              ">
               show {products.length} products
              </p>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default ProductGrid;