







"use client";

import useStore from "../store";
import { useState, useEffect, useRef } from "react";
import Container from "./Container";
import { Heart, X, ShoppingBag, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Product } from "../sanity.types";
import toast from "react-hot-toast";
import Image from "next/image";
import { urlFor } from "../sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import AddToCartButton from "./AddToCartButton";
import { client } from "../sanity/lib/client";

const extractCategoryText = (category: any): string => {
  if (typeof category === 'string') return category;
  if (category?.title) return category.title;
  if (category?.name) return category.name;
  return 'Category';
};

const WishListProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(9);
  const [loading, setLoading] = useState(false);
  const [updatedProducts, setUpdatedProducts] = useState<Product[]>([]);
  const { favoriteProduct, removeFromFavorite, resetFavorite } = useStore();
  
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
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchUpdatedProducts = async () => {
      if (!favoriteProduct || favoriteProduct.length === 0) {
        setUpdatedProducts([]);
        return;
      }

      setLoading(true);
      try {
        const ids = favoriteProduct.map(p => p?._id).filter(Boolean);
        if (ids.length === 0) {
          setUpdatedProducts([]);
          return;
        }

        const query = `*[_type == "product" && _id in $ids]{
          ...,
          categories[]->{title, slug},
          images[]{
            asset->{url}
          }
        }`;
        const params = { ids };
        const products = await client.fetch(query, params);
        setUpdatedProducts(products);
      } catch (error) {
        console.error("Error fetching updated products:", error);
        setUpdatedProducts(favoriteProduct as Product[]);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdatedProducts();
  }, [favoriteProduct]);

  const loadMore = () => {
    setVisibleProducts((prev) => Math.min(prev + 6, updatedProducts.length));
  };

  const loadLess = () => {
    setVisibleProducts(9);
  };

  const handleResetWishlist = () => {
    const confirmReset = window.confirm("Clear your entire wishlist?");
    if (confirmReset) {
      resetFavorite();
      toast.success("Wishlist cleared");
    }
  };

  if (loading && updatedProducts.length === 0) {
    return (
      <Container className="py-20">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-pink-800 border-t-transparent mx-auto"></div>
            <p className="text-pink-800 mt-3 text-sm">Loading...</p>
          </div>
        </div>
      </Container>
    );
  }

  const productsToDisplay = updatedProducts.length ? updatedProducts : (favoriteProduct as Product[]);

  return (
    <Container className="py-8">
      <div ref={sectionRef}>
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-pink-900 to-green-900 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur p-2 rounded-xl">
                  <Heart className="h-6 w-6 text-white" fill="white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Wishlist</h1>
                  <p className="text-white/70 text-sm">{productsToDisplay.length} items</p>
                </div>
              </div>
              {productsToDisplay.length > 0 && (
                <button
                  onClick={handleResetWishlist}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-red-500/80 rounded-lg text-white text-sm transition-all"
                >
                  <Trash2 size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {productsToDisplay.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              {productsToDisplay.slice(0, visibleProducts).map((product: Product, index: number) => {
                const isInStock = (product?.stock as number) > 0;
                const categories = Array.isArray(product?.categories) 
                  ? product.categories.map(cat => extractCategoryText(cat))
                  : [];
                
                return (
                  <div key={product?._id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100">
                    <Link href={`/product/${product?.slug?.current}`} className="block">
                      <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-green-50 overflow-hidden">
                        {product?.images && product.images[0] && (
                          <Image
                            src={urlFor(product.images[0]).width(300).height(300).url()}
                            alt={product?.name || "Product"}
                            width={300}
                            height={300}
                            unoptimized={true}
                            className={`w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105 ${!isInStock ? "opacity-40" : ""}`}
                          />
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromFavorite(product?._id);
                            toast.success("Removed");
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-pink-800 transition-colors"
                        >
                          <X size={12} className="text-pink-800 hover:text-white" />
                        </button>

                        {!isInStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <span className="px-2 py-0.5 bg-black/80 text-white text-[10px] font-bold rounded">OUT</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-2.5">
                      <Link href={`/product/${product?.slug?.current}`}>
                        <h3 className="font-semibold text-gray-800 text-xs line-clamp-2 min-h-8 hover:text-pink-800 transition-colors">
                          {product?.name || "Unnamed"}
                        </h3>
                      </Link>

                      <div className="mt-1.5">
                        <span className="text-sm font-bold text-pink-800">
                          {product?.price ? <PriceFormatter amount={product.price} /> : "N/A"}
                        </span>
                      </div>

                      {categories.length > 0 && (
                        <div className="mt-1">
                          <span className="text-[10px] text-gray-400">{categories[0]}</span>
                        </div>
                      )}

                      <div className="mt-2">
                        <AddToCartButton 
                          product={product} 
                          className="w-full py-1.5 bg-gradient-to-r from-pink-800 to-green-800 hover:from-pink-900 hover:to-green-900 text-white text-[11px] font-medium rounded-lg transition-all active:scale-95"
                          disabled={!isInStock}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {(visibleProducts < productsToDisplay.length || visibleProducts > 9) && (
              <div className="flex justify-center mt-8">
                {visibleProducts < productsToDisplay.length ? (
                  <button onClick={loadMore} className="flex items-center gap-2 px-5 py-2 bg-pink-800 hover:bg-pink-900 text-white rounded-lg text-sm font-medium transition-all">
                    <ChevronDown size={16} />
                    Load More
                  </button>
                ) : (
                  <button onClick={loadLess} className="flex items-center gap-2 px-5 py-2 bg-green-800 hover:bg-green-900 text-white rounded-lg text-sm font-medium transition-all">
                    <ChevronUp size={16} />
                    Show Less
                  </button>
                )}
              </div>
            )}

            <div className="text-center mt-4">
              <p className="text-xs text-gray-400">
                {Math.min(visibleProducts, productsToDisplay.length)} / {productsToDisplay.length}
              </p>
            </div>
          </>
        ) : (
          <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 px-4 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-800 to-green-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-pink-800">Empty Wishlist</h2>
              <p className="text-gray-400 text-sm mt-1">Save your favorite items here</p>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-800 to-green-900 hover:from-pink-900 hover:to-green-900 text-white rounded-lg text-sm font-medium transition-all">
              <ShoppingBag size={16} />
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
};

export default WishListProducts;