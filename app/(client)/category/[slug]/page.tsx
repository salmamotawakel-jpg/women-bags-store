

"use client";

import { client } from "../../../../sanity/lib/client";
import ProductCard from "../../../../components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

type ExpandedProduct = {
  _id: string;
  name?: string;
  slug?: { current: string };
  images?: any[];
  price?: number;
  discount?: number;
  stock?: number;
  status?: string;
  categories?: Array<{ title: string; slug: { current: string } }>;
};

async function getCategoryBySlug(slug: string) {
  const query = `*[_type == "category" && slug.current == $slug][0]{ title, slug }`;
  return await client.fetch(query, { slug });
}

async function getProductsByCategory(slug: string): Promise<ExpandedProduct[]> {
  const query = `
    *[_type == "product" && references(*[_type == "category" && slug.current == $slug][0]._id)] {
      _id,
      name,
      slug,
      images,
      price,
      discount,
      stock,
      status,
      "categories": categories[]->{
        title,
        "slug": slug
      }
    }
  `;
  return await client.fetch(query, { slug });
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [category, setCategory] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<ExpandedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ExpandedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const loadData = async () => {
      const { slug: paramSlug } = await params;
      setSlug(paramSlug);
      
      const categoryData = await getCategoryBySlug(paramSlug);
      if (!categoryData) {
        notFound();
        return;
      }
      setCategory(categoryData);
      
      const productsData = await getProductsByCategory(paramSlug);
      setAllProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    };
    loadData();
  }, [params]);

  // تطبيق الفلتر والترتيب
  useEffect(() => {
    let result = [...allProducts];

    // فلتر السعر
    if (priceRange) {
      switch (priceRange) {
        case "0-500":
          result = result.filter(p => (p.price || 0) < 500);
          break;
        case "500-1000":
          result = result.filter(p => (p.price || 0) >= 500 && (p.price || 0) < 1000);
          break;
        case "1000-2000":
          result = result.filter(p => (p.price || 0) >= 1000 && (p.price || 0) < 2000);
          break;
        case "2000+":
          result = result.filter(p => (p.price || 0) >= 2000);
          break;
      }
    }

    // الترتيب
    switch (sortBy) {
      case "newest":
        // يمكن إضافة منطق حسب تاريخ الإضافة
        result = [...result];
        break;
      case "oldest":
        result = [...result];
        break;
      case "price-asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }

    setFilteredProducts(result);
  }, [priceRange, sortBy, allProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-pink-800 border-t-transparent" />
      </div>
    );
  }

  if (!category) return notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-900 to-green-800">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                <Link href="/" className="hover:text-white/80 transition">Home</Link>
                <ChevronLeft size={12} />
                <span className="text-white/70">{category.title}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-white">
                {category.title}
              </h1>
              <p className="text-white/60 text-sm mt-2">
                {filteredProducts.length} products
              </p>
            </div>
            
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-4 py-2 border border-white/20 rounded-lg text-white/80 text-sm hover:bg-white/10 transition"
            >
              View all
              <ChevronLeft size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <SlidersHorizontal size={14} />
              <span>Filter</span>
            </div>
            
            {/* Price Range Filter - يعمل الآن */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Price</span>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:border-pink-800 focus:ring-0 outline-none"
              >
                <option value="">All</option>
                <option value="0-500">Under 500 MAD</option>
                <option value="500-1000">500 - 1000 MAD</option>
                <option value="1000-2000">1000 - 2000 MAD</option>
                <option value="2000+">Above 2000 MAD</option>
              </select>
            </div>
            
            {/* Sort by - يعمل الآن */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:border-pink-800 focus:ring-0 outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            
            {/* Result count */}
            <div className="text-xs text-gray-400 ml-auto">
              {filteredProducts.length} of {allProducts.length} items
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <span className="text-2xl text-gray-400">—</span>
            </div>
            <h3 className="text-lg font-light text-gray-600">No products match</h3>
            <p className="text-sm text-gray-400 mt-1">Try changing your filters</p>
            <button
              onClick={() => {
                setPriceRange("");
                setSortBy("newest");
              }}
              className="mt-4 text-sm text-pink-800 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product as any} />
            ))}
          </div>
        )}
      </div>
    </div>
 
  );
  

 
}
