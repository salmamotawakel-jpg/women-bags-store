

"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import { Mesh, Material } from "three";

function BagModel() {
  const { scene } = useGLTF("/3D/bagme-compressed.glb");
  
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat: Material) => {
              mat.needsUpdate = true;
            });
          } else {
            (mesh.material as Material).needsUpdate = true;
          }
        }
      }
    });
  }, [scene]);
  
  return <primitive object={scene} scale={1.1} position={[0, -0.4, 0]} />;
}

// ✅ Loader - مستطيل واحد يدور 360 درجة بلون أحمر
function Loader() {
  return (
    <Html center>
      <div
        className="w-32 h-1 rounded-full"
        style={{
          backgroundColor: '#ff4444',  // اللون الأحمر
          animation: 'spin360 1s linear infinite',
          transformOrigin: 'center'
        }}
      />
    </Html>
  );
}

export default function HomeBanner() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    useGLTF.preload("/3D/bagme-compressed.glb");
  }, []);
  
  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-black flex items-center justify-center">
        <div
          className="w-40 h-1.5 rounded-full"
          style={{
            backgroundColor: '#ff4444',
            animation: 'spin360 1s linear infinite',
            transformOrigin: 'center'
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] relative bg-black">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'black' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-2, 3, 4]} intensity={0.6} />
        
        <Suspense fallback={<Loader />}>
          <BagModel />
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={2}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}