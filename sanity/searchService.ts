// sanity/searchService.ts
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export interface SearchResult {
  _id: string;
  name: string;
  slug: string; // تأكد أن هذا يكون string وليس object
  price: number;
  images?: any[];
  categories?: any[];
  variant?: string;
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    // استخدم GROQ query مبسط أولاً للاختبار
    const products = await client.fetch(
      groq`*[_type == "product" && 
        (name match $query || 
         description match $query || 
         categories[]->title match $query)
      ][0...10] {
        _id,
        name,
        "slug": slug.current, // تأكد من استخراج slug.current كـ string
        price,
        images,
        "categories": categories[]->title,
        variant
      }`,
      { query: `*${query}*` } as any
    );
    
    console.log('Search results:', products); // للتشخيص
    return products;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}