
// sanity/queries/newCollection.ts
import { client } from "../lib/client";
import { groq } from "next-sanity";

export interface NewProduct {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  images?: { asset: { url: string } }[];
}
export async function getNewCollectionProducts(): Promise<NewProduct[]> {
  const query = groq`*[_type == "product" && isNew == true] | order(_createdAt desc)[0...10]{
    _id,
    name,
    slug,
    price,
    "images": images[]{
      asset->{
        _id,
        url
      }
    }
  }`;
  
  try {
    const products = await client.fetch(query);
    return products || [];
  } catch (error) {
    console.error("Error fetching new collection:", error);
    return [];
  }
}