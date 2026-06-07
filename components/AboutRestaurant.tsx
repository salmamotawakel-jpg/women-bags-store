





// components/AboutRestaurant.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";

const AboutRestaurant = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // يتوقف عن المراقبة بعد الظهور مرة واحدة
        }
      },
      {
        threshold: 0.3, // يظهر عندما يكون 30% من القسم مرئيًا
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

  return (
    <section
      ref={sectionRef}
      className="w-full flex justify-center items-center p-4 bg-white min-h-screen"
    >
      <video
        ref={videoRef}
        src="/videos/Kolo.mp4"
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

