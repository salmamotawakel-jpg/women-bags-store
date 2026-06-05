
import { sanityFetch } from "../lib/live";
import { defineQuery } from "next-sanity";

// تعريف الاستعلامات هنا
export const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,
    "categories": categories[]->title,
    "images": images[]{
      asset->{
        _id,
        url
      }
    },
    "video": video.asset->url
  }`
);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0]{
    _id,
    name,
    slug,
    price,
    originalPrice,
    stock,
    description,
    variant,
    status,
    isFeatured,
    "video": video.asset->url,
    "images": images[]{
      asset->{
        _id,
        url
      }
    },
    categories[]->{
      title,
      slug
    }
  }`
);

export const MY_ORDERS_QUERY = defineQuery(
  `*[_type == 'order' && clerkUserId == $userId] | order(orderDate desc){
    ...,
    products[]{
      ...,
      product->
    }
  }`
);

export const GUEST_ORDERS_QUERY = defineQuery(
  `*[_type == 'order' && guestSessionId == $sessionId] | order(orderDate desc){
    ...,
    products[]{
      ...,
      product->
    }
  }`
);

// الدوال
export const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type == 'category'] | order(name asc) [0...$quantity] {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`
      : `*[_type == 'category'] | order(name asc) {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`;
    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
    });
    return data;
  } catch (error) {
    console.log("Error fetching categories", error);
    return [];
  }
};

export const getDealProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: DEAL_PRODUCTS });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching deal Products:", error);
    return [];
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const result = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });
    return result?.data || null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

export async function getMyOrders(userId: string) {
  try {
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    return orders?.data || null;
  } catch (error) {
    console.error("Error fetching orders by userId:", error);
    return null;
  }
}

export async function getGuestOrders(sessionId: string) {
  if (!sessionId) {
    console.log("No sessionId provided to getGuestOrders");
    return [];
  }
  
  try {
    console.log("Fetching orders for sessionId:", sessionId);
    const orders = await sanityFetch({
      query: GUEST_ORDERS_QUERY,
      params: { sessionId },
    });
    console.log("Orders found:", orders?.data?.length || 0);
    return orders?.data || [];
  } catch (error) {
    console.error("Error fetching guest orders:", error);
    return [];
  }
}