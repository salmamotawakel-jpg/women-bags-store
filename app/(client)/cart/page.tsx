


"use client";

import { createCashOrder } from "../../../actions/createCheckoutSession";
import Container from "../../../components/Container";
import EmptyCart from "../../../components/EmptyCart";
import PriceFormatter from "../../../components/PriceFormatter";
import ProductSideMenu from "../../../components/ProductSideMenu";
import QuantityButtons from "../../../components/QuantityButtons";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import useStore from "../../../store";
import { ShoppingBag, Trash, Phone, MapPin, Heart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { urlFor } from "../../../sanity/lib/image";
import Cookies from "js-cookie";

const CartPage = () => {
  const { deleteCartProduct, getTotalPrice, getItemCount, resetCart, addToFavorite } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [guestSessionId, setGuestSessionId] = useState<string>();

  useEffect(() => {
    const initializeSession = () => {
      let sessionId: string | undefined = Cookies.get("guestSessionId") || undefined;
      if (!sessionId) {
        sessionId = localStorage.getItem("guestSessionId") || undefined;
      }
      if (!sessionId) {
        sessionId = crypto.randomUUID();
      }
      if (sessionId) {
        Cookies.set("guestSessionId", sessionId, { expires: 365, path: "/" });
        localStorage.setItem("guestSessionId", sessionId);
        setGuestSessionId(sessionId);
      }
    };
    initializeSession();
  }, []);

  const handleResetCart = () => {
    const confirmed = window.confirm("Clear your cart?");
    if (confirmed) {
      resetCart();
      toast.success("Cart cleared");
    }
  };

  const handleAddToFavorite = (product: any) => {
    addToFavorite(product);
    toast.success("Added to wishlist");
  };

  const handleCheckout = async () => {
    if (!phone.trim() || !address.trim()) {
      toast.error("Please enter phone and address");
      return;
    }

    let currentSessionId: string | undefined = guestSessionId;
    if (!currentSessionId) {
      currentSessionId = Cookies.get("guestSessionId") || undefined;
      if (!currentSessionId) {
        currentSessionId = localStorage.getItem("guestSessionId") || undefined;
        if (!currentSessionId) {
          currentSessionId = crypto.randomUUID();
        }
      }
      if (currentSessionId) {
        Cookies.set("guestSessionId", currentSessionId, { expires: 365, path: "/" });
        localStorage.setItem("guestSessionId", currentSessionId);
        setGuestSessionId(currentSessionId);
      }
    }

    setLoading(true);
    try {
      await createCashOrder({
        items: groupedItems,
        total: getTotalPrice(),
        customerName: "Guest",
        customerEmail: `guest_${Date.now()}@example.com`,
        clerkUserId: null,
        guestSessionId: currentSessionId,
        phone,
        address,
      });
      toast.success("Order placed!");
      resetCart();
      setTimeout(() => {
        window.location.href = "/orders";
      }, 1500);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Container>
        {groupedItems?.length ? (
          <div className="py-6">
            {/* Header بسيط */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-pink-800" />
                <h1 className="text-lg font-medium text-gray-800">Cart</h1>
                <span className="text-sm text-gray-400">({groupedItems.length} items)</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* العمود الأيسر - صور ومنتجات */}
              <div className="lg:col-span-2 space-y-3">
                {groupedItems?.map(({ product }) => {
                  const itemCount = getItemCount(product?._id);
                  return (
                    <div
                      key={product?._id}
                      className="flex gap-3 p-3 bg-white rounded-lg shadow-sm"
                    >
                      {/* صورة */}
                      <Link href={`/product/${product?.slug?.current}`} className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-50">
                          {product?.images && (
                            <Image
                              src={urlFor(product?.images[0]).url()}
                              alt="product"
                              width={64}
                              height={64}
                              unoptimized={true}
                              className="w-full h-full object-contain p-1"
                            />
                          )}
                        </div>
                      </Link>

                      {/* معلومات */}
                      <div className="flex-1">
                        <Link href={`/product/${product?.slug?.current}`}>
                          <h2 className="font-medium text-gray-800 text-sm line-clamp-1">
                            {product?.name}
                          </h2>
                        </Link>
                        {product?.variant && (
                          <span className="text-xs text-gray-400">{product.variant}</span>
                        )}
                        
                        {/* أزرار الإجراءات */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => handleAddToFavorite(product)}
                            className="text-gray-300 hover:text-pink-800 transition"
                            title="Add to wishlist"
                          >
                            <Heart size={14} />
                          </button>
                          <button
                            onClick={() => {
                              deleteCartProduct(product?._id);
                              toast.success("Removed");
                            }}
                            className="text-gray-300 hover:text-red-500 transition"
                            title="Remove"
                          >
                            <Trash size={14} />
                          </button>
                          <ProductSideMenu product={product} />
                        </div>
                      </div>

                      {/* السعر والكمية */}
                      <div className="text-right">
                        <p className="font-semibold text-pink-800 text-sm">
                          <PriceFormatter amount={(product?.price as number) * itemCount} />
                        </p>
                        <div className="mt-2">
                          <QuantityButtons product={product} />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* زر مسح الكل */}
                <button
                  onClick={handleResetCart}
                  className="text-xs text-gray-400 hover:text-red-500 transition mt-2"
                >
                  Clear cart
                </button>
              </div>

              {/* العمود الأيمن - بطاقة منفصلة للمنتجات + Total */}
              <div>
                <div className="bg-white rounded-lg shadow-sm sticky top-4">
                  {/* عنوان البطاقة */}
                  <div className="p-4 border-b border-gray-100">
                    <h2 className="font-medium text-gray-800">Order summary</h2>
                  </div>

                  {/* قائمة المنتجات مع الأسعار */}
                  <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                    {groupedItems?.map(({ product }) => {
                      const itemCount = getItemCount(product?._id);
                      return (
                        <div key={product?._id} className="flex justify-between items-start text-sm">
                          <div className="flex-1">
                            <p className="text-gray-700 line-clamp-1">{product?.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              Qty: {itemCount} × <PriceFormatter amount={product?.price as number} />
                            </p>
                          </div>
                          <span className="font-medium text-pink-800 ml-3">
                            <PriceFormatter amount={(product?.price as number) * itemCount} />
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Total */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Total</span>
                      <span className="text-xl font-bold text-pink-800">
                        <PriceFormatter amount={getTotalPrice()} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* نموذج الدفع */}
                <div className="bg-white rounded-lg shadow-sm p-5 mt-4">
                  <h2 className="font-medium text-gray-800 mb-4">Delivery info</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone" className="text-xs text-gray-500">Phone number</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone size={14} className="text-pink-800" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="06xxxxxxxx"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="border-gray-200 focus:border-pink-800 focus:ring-pink-800 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address" className="text-xs text-gray-500">Address</Label>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin size={14} className="text-green-800 mt-2" />
                        <Textarea
                          id="address"
                          placeholder="Your delivery address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          rows={3}
                          className="border-gray-200 focus:border-pink-800 focus:ring-pink-800 text-sm"
                        />
                      </div>
                    </div>

                    <Button
                      className="w-full bg-pink-800 hover:bg-pink-900 text-white rounded-lg py-5 mt-2"
                      disabled={loading}
                      onClick={handleCheckout}
                    >
                      {loading ? "Processing..." : "Place order"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </Container>
    </div>
  );
};

export default CartPage;