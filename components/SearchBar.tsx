
"use client"

import { X, Loader2, ShoppingBag } from "lucide-react";
import { BsSearch } from "react-icons/bs";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import PriceFormatter from "@/components/PriceFormatter";
import { searchProducts, SearchResult } from "@/sanity/searchService";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Popular crystal handbags searches
  useEffect(() => {
    const popular = [
      "Pink Crystal Bag",
      "Rose Quartz Handbag",
      "Peach Blossom Purse",
      "Emerald Clutch",
      "Crystal Evening Bag"
    ];
    setPopularSearches(popular);
  }, []);

  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const updated = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, 5);
    
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  }, [recentSearches]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        console.log('Searching for:', debouncedQuery);
        const searchResults = await searchProducts(debouncedQuery);
        setResults(searchResults);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    saveRecentSearch(searchTerm);
    setQuery(searchTerm);
  }, [saveRecentSearch]);

  const removeRecentSearch = (index: number) => {
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <>
      {/* Search icon - Peach with Dark Green hover */}
      <button
        onClick={() => setOpen(true)}
        className="p-1 transition-colors duration-200"
        aria-label="Search"
      >
        <BsSearch className="w-5 h-5 text-pink-800 hover:text-emerald-700 transition-colors" />
      </button>

      {/* Modal - Peach & Dark Green theme */}
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-emerald-900/20 backdrop-blur-sm flex items-start justify-center pt-20 md:pt-32 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in slide-in-from-top-5 duration-200 border-t-4 border-pink-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-600">
              <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <div className="relative flex-1">
                  <BsSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-800" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for crystal handbags..."
                    className="w-full pr-10 pl-4 py-3 border border-pink-900 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:border-emerald-900 bg-orange-50/30 hover:bg-white transition-colors"
                    autoFocus
                    dir="rtl"
                  />
                  {query && (
                    <button 
                      type="button"
                      onClick={() => setQuery("")}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-orange-100 rounded-full"
                    >
                      <X className="w-4 h-4 text-pink-900" />
                    </button>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-pink-800" />
                </button>
              </form>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-emerald-800 animate-spin mb-3" />
                  <p className="text-emerald-900">Searching...</p>
                </div>
              ) : query.trim() ? (
                <>
                  {results.length > 0 ? (
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm font-medium text-emerald-800 border-r-2 border-orange-800 mr-2">
                        Results ({results.length})
                      </div>
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/product/${product.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-orange-50/50 rounded-lg transition-colors group border-b border-orange-50 last:border-0"
                        >
                          {product.images && product.images[0] && (
                            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-pink-900 shrink-0">
                              <Image
                                src={urlFor(product.images[0]).width(200).height(200).url()}
                                alt={product.name}
                                width={112} height={112} unoptimized={true}
                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                                sizes="(max-width: 768px) 56px, 64px"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 line-clamp-1 group-hover:text-emerald-900">
                              {product.name}
                            </h4>
                            {product.categories && Array.isArray(product.categories) && (
                              <div className="flex gap-1 mt-1">
                                {product.categories.slice(0, 2).map((cat, idx) => (
                                  <span 
                                    key={idx} 
                                    className="px-2 py-0.5 bg-pink-100 text-pink-900 text-xs rounded-full"
                                  >
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-emerald-800">
                                <PriceFormatter amount={product.price} />
                              </span>
                              {product.variant && (
                                <span className="text-xs text-emerald-900 px-2 py-0.5 bg-emerald-50 rounded">
                                  {product.variant}
                                </span>
                              )}
                            </div>
                          </div>
                          <ShoppingBag className="w-5 h-5 text-pink-700 group-hover:text-emerald-600 transition-colors shrink-0" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <BsSearch className="w-10 h-10 text-pink-900" />
                      </div>
                      <h3 className="text-lg font-medium text-emerald-800 mb-2">No results found</h3>
                      <p className="text-emerald-900 text-sm">
                        No crystal handbags match "{query}"
                      </p>
                      <div className="mt-6">
                        <p className="text-sm text-pink-800 mb-3">Try these searches:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {popularSearches.slice(0, 4).map((term) => (
                            <button
                              key={term}
                              onClick={() => handleSearch(term)}
                              className="px-4 py-2 bg-pink-100 hover:bg-emerald-900 hover:text-white rounded-lg text-sm transition-all hover:scale-105 text-emerald-800"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-emerald-900">Recent Searches</h3>
                        <button
                          onClick={clearRecentSearches}
                          className="text-xs text-pink-800 hover:text-emerald-800 transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 hover:bg-orange-50 rounded-lg group"
                          >
                            <button
                              onClick={() => handleSearch(search)}
                              className="flex items-center gap-2 flex-1 text-right"
                            >
                              <BsSearch className="w-4 h-4 text-pink-900 group-hover:text-emerald-800" />
                              <span className="text-gray-700 group-hover:text-emerald-900">{search}</span>
                            </button>
                            <button
                              onClick={() => removeRecentSearch(index)}
                              className="p-1 hover:bg-orange-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4 text-pink-800" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Crystal Handbags */}
                  <div>
                    <h3 className="text-sm font-medium text-emerald-900 mb-3">Popular Crystal Handbags</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearch(term)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-900 hover:text-white rounded-full text-sm transition-all hover:scale-105 text-emerald-900"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}