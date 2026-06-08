



// components/AboutRestaurant.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { getRestaurantVideo } from "@/sanity/queries/restaurant";

const AboutRestaurant = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  useEffect(() => {
    // جلب الفيديو من Sanity
    const fetchVideo = async () => {
      const url = await getRestaurantVideo();
      if (url) {
        setVideoUrl(url);
      }
    };
    fetchVideo();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // إذا لم يتم تحميل الفيديو بعد، لا نعرض شيء
  if (!videoUrl) {
    return (
      <section
        ref={sectionRef}
        className="w-full flex justify-center items-center p-4 bg-white min-h-screen"
      >
        <div className="w-full max-w-sm rounded-3xl bg-gray-100 animate-pulse h-96"></div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="w-full flex justify-center items-center p-4 bg-white min-h-screen"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className={`
          w-full max-w-sm rounded-3xl shadow-lg
          transition-all duration-1000 ease-out
          ${isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-95"
          }
        `}
      />
    </section>
  );
};

export default AboutRestaurant;