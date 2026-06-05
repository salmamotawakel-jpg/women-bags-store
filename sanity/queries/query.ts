import { defineQuery } from "next-sanity";


const DEAL_PRODUCTS = defineQuery(
  `*[_type == 'product' && status == 'hot'] | order(name asc){
    ...,"categories": categories[]->title
  }`
);

const PRODUCT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "product" && slug.current == $slug] | order(name asc) [0]`
);


const MY_ORDERS_QUERY =
  defineQuery(`*[_type == 'order' && clerkUserId == $userId] | order(orderData desc){
...,products[]{
  ...,product->
}
}`);

// sanity/query.ts

export const GUEST_ORDERS_QUERY = defineQuery(
  `*[_type == 'order' && guestSessionId == $sessionId] | order(orderDate desc){
    ...,
    products[]{
      ...,
      product->
    }
  }`
);

export {
  DEAL_PRODUCTS,
  PRODUCT_BY_SLUG_QUERY,
  MY_ORDERS_QUERY,
};