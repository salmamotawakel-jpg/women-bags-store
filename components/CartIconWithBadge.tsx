// components/CartIconWithBadge.tsx
"use client";

import Link from "next/link";
import { BsHandbag } from "react-icons/bs";
import useStore from "@/store";
import { useEffect, useState } from "react";

const CartIconWithBadge = () => {
  const items = useStore((state) => state.items);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // حساب العدد الإجمالي للمنتجات (مجموع الكميات)
    const totalItems = items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
    setItemCount(totalItems);
  }, [items]);

  return (
    <Link href="/cart" className="relative">
      <BsHandbag className="w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-3 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIconWithBadge;