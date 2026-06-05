


// sanity/lib/reviews.ts
import { client } from "./client";
import { groq } from "next-sanity";

// جلب مراجعات منتج معين
export async function getProductReviews(productId: string) {
  const query = groq`*[_type == "review" && product._ref == $productId && approved == true] | order(createdAt desc){
    _id,
    userName,
    rating,
    title,
    comment,
    helpful,
    createdAt,
    "images": images[]{
      asset->{
        _id,
        url
      }
    }
  }`;
  
  try {
    const reviews = await client.fetch(query, { productId });
    return reviews || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

// إضافة مراجعة جديدة (بدون صور)
export async function addReviewWithoutImages(reviewData: {
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
}) {
  try {
    const review = {
      _type: "review",
      product: {
        _type: "reference",
        _ref: reviewData.productId,
      },
      userName: reviewData.userName,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
      approved: true,
      helpful: 0,
    };

    const result = await client.create(review);
    console.log("Review added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding review:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to add review");
  }
}

// إضافة مراجعة جديدة مع صور
export async function addReviewWithImages(reviewData: {
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  imageUrls?: string[];
}) {
  try {
    const imageAssets = reviewData.imageUrls?.map((url) => ({
      _type: "image",
      asset: {
        _type: "reference",
        _ref: url,
      },
    })) || [];

    const review = {
      _type: "review",
      product: {
        _type: "reference",
        _ref: reviewData.productId,
      },
      userName: reviewData.userName,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      images: imageAssets,
      createdAt: new Date().toISOString(),
      approved: true,
      helpful: 0,
    };

    const result = await client.create(review);
    console.log("Review with images added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding review with images:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to add review with images");
  }
}

// إضافة لايك للمراجعة
export async function likeReview(reviewId: string, currentLikes: number) {
  try {
    console.log("Liking review:", reviewId, "Current likes:", currentLikes);
    
    const result = await client
      .patch(reviewId)
      .set({ helpful: (currentLikes || 0) + 1 })
      .commit();
    
    console.log("Like added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error liking review:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to like review");
  }
}