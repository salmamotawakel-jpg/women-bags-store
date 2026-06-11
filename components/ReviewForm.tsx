// components/ReviewForm.tsx
"use client";

import { Star, Upload, X, Camera } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId: string;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

const ReviewForm = ({ productId, onClose, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // منع تمرير الخلفية
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleUserImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن لا يتجاوز 5MB");
      return;
    }

    setUserImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeUserImage = () => {
    setUserImage(null);
    setUserImagePreview(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      toast.error("يمكنك رفع 3 صور كحد أقصى للمراجعة");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن لا يتجاوز 5MB");
        return;
      }
      setImages((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("الرجاء اختيار عدد النجوم");
      return;
    }
    if (!title.trim()) {
      toast.error("الرجاء إدخال عنوان المراجعة");
      return;
    }
    if (!comment.trim()) {
      toast.error("الرجاء إدخال نص المراجعة");
      return;
    }
    if (!userName.trim()) {
      toast.error("الرجاء إدخال اسمك");
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("userName", userName.trim());
      formData.append("rating", rating.toString());
      formData.append("title", title.trim());
      formData.append("comment", comment.trim());
      
      if (userImage) {
        formData.append("userImage", userImage);
      }
      
      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch("/api/reviews", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("تم إضافة مراجعتك بنجاح!");
        onReviewSubmitted();
        onClose();
      } else {
        toast.error(data.error || "حدث خطأ أثناء إضافة المراجعة");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("حدث خطأ أثناء إضافة المراجعة");
    } finally {
      setLoading(false);
    }
  };

  return (
    // خلفية سوداء شفافة - تمنع الوصول للمحتوى الخلفي
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      {/* محتوى الفورم */}
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        
        {/* Header ثابت */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
          <h3 className="text-lg font-medium text-gray-900">أضف مراجعتك</h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* محتوى قابل للتمرير - كل شيء داخل الفورم فقط */}
        <div className="overflow-y-auto p-5 space-y-5">
          {/* صورة المستخدم الشخصية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورتك الشخصية (اختياري)
            </label>
            <div className="flex items-center gap-4">
              {userImagePreview ? (
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-800">
                    <Image
                      src={userImagePreview}
                      alt="User avatar"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeUserImage}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-800 transition bg-gray-50">
                  <Camera size={20} className="text-gray-400" />
                  <span className="text-[8px] text-gray-500">رفع</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUserImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              <p className="text-xs text-gray-400">يمكنك إضافة صورتك الشخصية</p>
            </div>
          </div>

          {/* تقييم بالنجوم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">تقييمك</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`transition-all ${
                      (hoverRating || rating) >= star
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {rating === 1 && "سيء جداً"}
              {rating === 2 && "سيء"}
              {rating === 3 && "متوسط"}
              {rating === 4 && "جيد"}
              {rating === 5 && "ممتاز"}
            </p>
          </div>

          {/* عنوان المراجعة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">عنوان المراجعة</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: منتج رائع جداً"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-pink-800 focus:ring-1 focus:ring-pink-800 outline-none transition"
            />
          </div>

          {/* نص المراجعة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">مراجعتك</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="اكتب تجربتك مع المنتج..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-pink-800 focus:ring-1 focus:ring-pink-800 outline-none transition resize-none"
            />
          </div>

          {/* الاسم */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسمك</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="مثال: سارة أحمد"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-pink-800 focus:ring-1 focus:ring-pink-800 outline-none transition"
            />
          </div>

          {/* رفع صور المراجعة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              أضف صور للمنتج (اختياري - حتى 3 صور)
            </label>
            <div className="flex flex-wrap gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    unoptimized={true}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
              {imagePreviews.length < 3 && (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-800 transition">
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-[10px] text-gray-500 mt-1">رفع</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              يمكنك إضافة حتى 3 صور للمنتج (jpg, png - حد أقصى 5MB لكل صورة)
            </p>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-pink-800 hover:bg-pink-900 text-white rounded-lg font-medium transition disabled:opacity-50 mb-2"
          >
            {loading ? "جاري النشر..." : "نشر المراجعة"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;