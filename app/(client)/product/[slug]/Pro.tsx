// components/ProductClient.tsx
"use client";

import AddToCartButton from "../../../../components/AddToCartButton";
import FavoriteButton from "../../../../components/FavoriteButton";
import ReviewForm from "../../../../components/ReviewForm";
import { Share2, Star } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  userName: string;
  createdAt: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  userImage?: string;
  images?: { asset: { url: string } }[];
}

const ProductClient = ({ product }: { product: any }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  const fetchReviews = useCallback(async () => {
    if (!product?._id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?productId=${product._id}`);
      const data = await response.json();
      
      if (data.success && data.reviews) {
        setReviews(data.reviews);
        if (data.reviews.length > 0) {
          const sum = data.reviews.reduce((acc: number, r: Review) => acc + r.rating, 0);
          setAverageRating(sum / data.reviews.length);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [product?._id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("تم نسخ رابط المنتج!");
    } catch {
      toast.error("فشل نسخ الرابط");
    }
  };

  const renderStars = (ratingValue: number, size: number = 14) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={size}
          className={`${
            ratingValue >= i ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG");
  };

  if (loading) {
    return <div className="py-8 text-center">جاري تحميل التقييمات...</div>;
  }

  return (
    <>
      <div className="flex gap-3">
        <AddToCartButton product={product} className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition" />
        <FavoriteButton showProduct={true} product={product} />
        <button onClick={handleShare} className="p-3 border border-gray-200 rounded-lg hover:border-gray-400 transition">
          <Share2 size={18} className="text-gray-500" />
        </button>
      </div>

      {/* ✅ إضافة حاوية التقييمات مع opacity عند فتح الفورم */}
      <div className={`transition-all duration-300 ${showReviewForm ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">آراء العملاء</h3>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-light text-gray-800">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-0.5 mt-1">{renderStars(averageRating, 11)}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{reviews.length} مراجعة</div>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r: Review) => Math.floor(r.rating) === star).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 w-8">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] text-gray-500">{star}</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-400 w-6">{Math.round(percentage)}%</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              لا توجد مراجعات حتى الآن<br />كن أول من يقيّم هذا المنتج
            </div>
          ) : (
            reviews.map((review: Review) => (
              <div key={review._id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  {review.userImage ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={review.userImage}
                        alt={review.userName}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        unoptimized={true}
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-green-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-pink-800">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-xs font-medium text-gray-800">{review.userName}</span>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {renderStars(review.rating, 10)}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400">{formatDate(review.createdAt)}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-700 mt-1">{review.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{review.comment}</p>
                    
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {review.images.map((img, idx) => (
                          <Image
                            key={idx}
                            src={img.asset.url}
                            alt={`Review image ${idx + 1}`}
                            width={60}
                            height={60}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            unoptimized={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <button
          onClick={() => setShowReviewForm(true)}
          className="w-full mt-3 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-700 transition"
        >
          + اكتب مراجعتك
        </button>
      </div>

      {showReviewForm && (
        <ReviewForm
          productId={product?._id}
          onClose={() => setShowReviewForm(false)}
          onReviewSubmitted={fetchReviews}
        />
      )}
    </>
  );
};

export default ProductClient;