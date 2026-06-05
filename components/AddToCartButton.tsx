"use client";
import { Product } from "../sanity.types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import QuantityButtons from "./QuantityButtons";
import PriceFormatter from "./PriceFormatter";
import useStore from "@/store";

interface Props {
  product: Product;
  className?: string;
  disabled?: boolean;
}

const AddToCartButton = ({ product, className }: Props) => {
  const { addItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id);
  const isOutOfStock = product?.stock === 0;

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product);
      toast.success(
        `${product?.name?.substring(0, 12)}... added successfully!`
      );
    } else {
      toast.error("Can not add more than available stock");
    }
  };

  console.log("AddToCartButton render:", { itemCount, isOutOfStock });
  
  return (
    <div className="w-full h-10 sm:h-12 flex items-center justify-center">
      {itemCount > 0 ? (
        <div className="text-sm w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs text-darkColor/80">Quantity</span>
            <QuantityButtons product={product} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-xs font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product?.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "w-full flex items-center justify-center gap-2 bg-black text-white shadow-none border border-shop_light_orange font-semibold hover:bg-shop_light_orange hover:border-shop_light_orange transition-all",
            isOutOfStock && "bg-gray-400 border-gray-400 hover:bg-gray-400",
            className
          )}
        >
          <ShoppingBag size={18} />
          <span className="whitespace-nowrap">
            {isOutOfStock ? "Out of Stock" : "Add to cart"}
          </span>
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;


