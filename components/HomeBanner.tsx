

"use client";

import React, { useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Sparkles,
  Html,
} from "@react-three/drei";

// Component for the 3D bag model
function BagModel() {
  const { scene } = useGLTF("/3D/bagme-compressed.glb");
  const modelRef = useRef(null);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1.3}
      position={[0, -0.5, 0]}
    />
  );
}

// Loading fallback component
function Loader() {
  return (
    <Html center>
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-transparent rounded-full animate-spin" />
      </div>
    </Html>
  );
}

const HomeBanner = () => {
  // تحميل النموذج مسبقاً فور تحميل الصفحة
  useEffect(() => {
    useGLTF.preload("/3D/bagme.glb");
  }, []);

  return (
    <div className="relative w-full h-[600px] md:h-[700px]">
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ alpha: false, antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 1]} // ✅ تسريع كبير: تقليل جودة العرض
          className="w-full h-full"
        >
          <Suspense fallback={<Loader />}>
            {/* Lighting - مبسطة */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.5} />
            <directionalLight position={[-5, 5, 0]} intensity={0.6} color="#eab308" />
            <pointLight position={[0, 2, 3]} intensity={0.8} />

            <color attach="background" args={["#1a1a1a"]} />

            {/* ✅ تسريع: تقليل عدد Sparkles */}
            <Sparkles count={30} scale={8} size={0.3} color="#eab308" opacity={0.1} />

            <BagModel />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={9}
              enableRotate={true}
              rotateSpeed={2}
              target={[0, 0, 0]}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default HomeBanner;