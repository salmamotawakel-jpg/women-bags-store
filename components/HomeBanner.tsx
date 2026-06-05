
"use client";

import React, { useRef, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Sparkles, Html } from "@react-three/drei";

// ✅ تحميل النموذج
function BagModel() {
  const { scene } = useGLTF("/3D/bagme-compressed.glb");
  const ref = useRef(null);

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1.3}
      position={[0, -0.5, 0]}
    />
  );
}

// Loader خفيف
function Loader() {
  return (
    <Html center>
      <div className="w-10 h-10 border-4 border-pink-300 border-t-transparent rounded-full animate-spin" />
    </Html>
  );
}

const HomeBanner = () => {
  // 🔥 preload آمن فقط في browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      useGLTF.preload("/3D/bagme-compressed.glb");
    }
  }, []);

  return (
    <div className="relative w-full h-[600px] md:h-[700px]">
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{
            alpha: false,
            antialias: false, // 🔥 أسرع في Vercel
            powerPreference: "high-performance",
          }}
          dpr={[1, 1]} // 🔥 مهم لتخفيف الضغط
        >
          <Suspense fallback={<Loader />}>
            {/* Lights خفيفة */}
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />

            <color attach="background" args={["#1a1a1a"]} />

            {/* Sparkles أخف */}
            <Sparkles count={15} scale={6} size={0.2} opacity={0.08} />

            <BagModel />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={6}
              rotateSpeed={1.5}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default HomeBanner;