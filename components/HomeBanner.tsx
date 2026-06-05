
"use client";

import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function BagModel() {
  const { scene } = useGLTF("/3D/bagme-compressed.glb");
  return <primitive object={scene} scale={1.1} position={[0, -0.4, 0]} />;
}

function Loader() {
  return <div className="text-white">Loading...</div>;
}

export default function HomeBanner() {
  useEffect(() => {
    useGLTF.preload("/3D/bagme-compressed.glb");
  }, []);

  return (
    <div className="w-full h-[500px]">
      <Canvas
        dpr={[1, 1]} // 🔥 مهم جداً للأداء
        camera={{ position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />

        <Suspense fallback={<Loader />}>
          <BagModel />
        </Suspense>

        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
}