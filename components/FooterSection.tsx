

// components/FooterSection.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Mail, Send, Truck, Shield, RefreshCw, Heart, Sparkles, Gem } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer لتأثير الظهور
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // يظهر عندما يكون 10% من القسم مرئيًا
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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Thanks for subscribing!");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <footer 
      ref={sectionRef}
      className={`
        bg-white border-t border-gray-100 mt-16
        transition-all duration-1000 ease-out
        ${isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-16"
        }
      `}
    >
      <div className="container mx-auto px-4 py-12 md:py-16">
        
        {/* Top Section - Logo & Newsletter */}
        <div 
          className={`
            text-center mb-12 pb-8 border-b border-gray-100
            transition-all duration-700 ease-out delay-150
            ${isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
            }
          `}
        >
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-800 to-green-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Gem size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-gray-800 tracking-wide">
            Crystal <span className="font-medium text-pink-800">Handmade</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm flex items-center justify-center gap-1">
            <Sparkles size={14} className="text-pink-800" />
            Fast shipping within 24 hours
            <Sparkles size={14} className="text-pink-800" />
          </p>

          {/* Newsletter */}
          <div className="max-w-md mx-auto mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-center gap-2">
              <Mail size={16} className="text-pink-800" />
              NEWSLETTER
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Subscribe to receive exclusive offers and new crystal collections.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-800 focus:ring-1 focus:ring-pink-800 outline-none transition"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-pink-800 to-green-800 hover:from-pink-900 hover:to-green-900 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? "..." : "Subscribe"}
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section - Support Links & About */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Support Links */}
          <div 
            className={`
              transition-all duration-700 ease-out delay-200
              ${isVisible 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 -translate-x-8"
              }
            `}
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-pink-800 rounded-full" />
              SUPPORT
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-pink-800 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-gray-500 hover:text-pink-800 transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-gray-500 hover:text-pink-800 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-pink-800 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-500 hover:text-pink-800 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* About the Store */}
          <div 
            className={`
              md:col-span-2
              transition-all duration-700 ease-out delay-300
              ${isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
              }
            `}
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-green-800 rounded-full" />
              ABOUT CRYSTAL HANDMADE
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Discover the exquisite world of <strong className="text-pink-800">Crystal Handmade</strong>, 
              a brand dedicated to women seeking exceptional crystal handbags and accessories. 
              Each piece is meticulously <strong className="text-green-800">handcrafted</strong> with premium 
              quality crystals, combining elegance with modern sophistication. 
              Whether you're looking for a statement piece for a special occasion or a 
              daily accessory that sparkles, <strong className="text-pink-800">Crystal Handmade</strong> 
              is here to make every moment of your life shine brighter.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Sparkles size={14} className="text-pink-800" />
                <span className="text-xs text-gray-500">100% Handmade</span>
              </div>
              <div className="flex items-center gap-1">
                <Gem size={14} className="text-green-800" />
                <span className="text-xs text-gray-500">Premium Crystals</span>
              </div>
            </div>
          </div>

          {/* Services & Features */}
          <div 
            className={`
              transition-all duration-700 ease-out delay-400
              ${isVisible 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 translate-x-8"
              }
            `}
          >
            <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-pink-800 rounded-full" />
              OUR SERVICES
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Truck size={16} className="text-pink-800" />
                Express 24h Shipping
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw size={16} className="text-green-800" />
                Free Returns (14 days)
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Shield size={16} className="text-pink-800" />
                Secure Payment
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <Heart size={16} className="text-green-800" />
                Dedicated Customer Support
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Copyright */}
        <div 
          className={`
            pt-8 border-t border-gray-100 text-center
            transition-all duration-700 ease-out delay-500
            ${isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-8"
            }
          `}
        >
          <p className="text-xs text-gray-400">
            © 2026 - Crystal Handmade - All rights reserved
          </p>
          <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
            Handcrafted with <Heart size={10} className="text-pink-800" /> using premium quality crystals
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;