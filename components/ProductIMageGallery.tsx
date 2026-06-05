"use client";

import { urlFor } from "../sanity/lib/image";
import { Play, Pause, ChevronLeft, ChevronRight, X, Video } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";

interface ProductImageGalleryProps {
  images: any[];
  video?: string;
  isStock: number | undefined;
}

const ProductImageGallery = ({ images, video, isStock = 0 }: ProductImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!images || images.length <= 1 || !isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images, isPlaying]);

  const nextImage = useCallback(() => {
    if (!images) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsPlaying(false);
  }, [images]);

  const prevImage = useCallback(() => {
    if (!images) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsPlaying(false);
  }, [images]);

  const stockValue = isStock ?? 0;
  const hasVideo = video && video.trim() !== "";

  if (!images || images.length === 0) {
    return (
      <div className="relative bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* الصورة الكبيرة */}
      <div className="relative bg-gray-100 rounded-2xl overflow-hidden aspect-square">
        <Image
          src={urlFor(images[currentIndex]).width(800).height(800).url()}
          alt={`Product image ${currentIndex + 1}`}
          width={800}
          height={800}
          unoptimized={true}
          className="w-full h-full object-contain bg-white transition-all duration-500"
          priority
        />
        
        {/* أزرار التنقل */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-md flex items-center justify-center transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
            
            {/* زر تشغيل/إيقاف السلايدر */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all z-10"
              aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
            >
              {isPlaying ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white" />}
            </button>
          </>
        )}
        
        {/* نقاط المؤشر */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? "w-6 bg-pink-800" : "w-1.5 bg-white/60"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* حالة المخزون */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium z-10 ${
          stockValue > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {stockValue > 0 ? "متوفر" : "غير متوفر"}
        </div>
        
        {/* زر الفيديو في الأعلى اليسار - يظهر فقط إذا كان هناك فيديو */}
        {hasVideo && (
          <button
            onClick={() => setShowVideo(true)}
            className="absolute top-3 left-28 w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all group z-10"
            aria-label="Watch video"
          >
            <Video size={18} className="text-white group-hover:scale-110 transition" />
          </button>
        )}
      </div>
      
      {/* الصور المصغرة - تظهر فقط إذا كان هناك أكثر من صورة */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsPlaying(false);
              }}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx ? "border-pink-800" : "border-transparent"
              }`}
            >
              <Image
                src={urlFor(img).width(100).height(100).url()}
                alt={`Thumbnail ${idx + 1}`}
                width={64}
                height={64}
                unoptimized={true}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* مودال الفيديو - MP4 */}
      {showVideo && hasVideo && !videoError && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative max-w-3xl w-full bg-black rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition"
              aria-label="Close video"
            >
              <X size={16} className="text-white" />
            </button>
            <video
              controls
              autoPlay
              className="w-full aspect-video"
              onError={() => setVideoError(true)}
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* رسالة خطأ الفيديو */}
      {showVideo && videoError && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative max-w-md w-full bg-white rounded-xl p-6 text-center">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
            >
              <X size={16} />
            </button>
            <Video size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Video unavailable</h3>
            <p className="text-gray-600 text-sm">The video could not be loaded. Please try again later.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;