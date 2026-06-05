
"use client";

import React, { useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Sparkles, Html } from "@react-three/drei";

function BagModel() {
  const { scene } = useGLTF("/3D/bagme-compressed.glb");
  return <primitive object={scene} scale={1.2} position={[0, -0.5, 0]} />;
}

function Loader() {
  return (
    <Html center>
      <div className="w-10 h-10 border-4 border-pink-300 border-t-transparent rounded-full animate-spin" />
    </Html>
  );
}

export default function HomeBanner() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      useGLTF.preload("/3D/bagme-compressed.glb");
    }
  }, []);

  return (
    <div className="w-full h-[600px] relative">
      <Canvas
        dpr={[1, 1]} // 🔥 مهم جدًا لتخفيف الحمل
        camera={{ position: [0, 0, 5] }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} />

          <BagModel />

          <Sparkles count={10} scale={5} opacity={0.05} />

          <OrbitControls
            enableZoom={false}
            autoRotate
            autoRotateSpeed={5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}