// components/CrystalShowcase.tsx
"use client";

import { Sparkles, Gem, Award, Clock } from "lucide-react";
import Link from "next/link";

const CrystalShowcase = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-pink-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles size={20} className="text-pink-800" />
            </div>
            <h3 className="font-medium text-gray-800">Handmade Quality</h3>
            <p className="text-xs text-gray-500 mt-1">Each piece crafted with care</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gem size={20} className="text-green-800" />
            </div>
            <h3 className="font-medium text-gray-800">Premium Crystals</h3>
            <p className="text-xs text-gray-500 mt-1">Authentic Swarovski crystals</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award size={20} className="text-pink-800" />
            </div>
            <h3 className="font-medium text-gray-800">Limited Edition</h3>
            <p className="text-xs text-gray-500 mt-1">Exclusive designs</p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock size={20} className="text-green-800" />
            </div>
            <h3 className="font-medium text-gray-800">24h Shipping</h3>
            <p className="text-xs text-gray-500 mt-1">Fast worldwide delivery</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrystalShowcase;