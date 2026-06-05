
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { urlFor } from "../sanity/lib/image";
import PriceFormatter from "./PriceFormatter";

// تعريف نوع الطلب العام (متوافق مع OrdersComponent)
interface OrderType {
  _id: string;
  _type?: string;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
  orderNumber?: string;
  invoice?: { id?: string; number?: string; hosted_invoice_url?: string };
  phone?: string;
  clerkUserId?: string;
  guestSessionId?: string;
  customerName?: string;
  email?: string;
  products?: any[];
  totalPrice?: number;
  currency?: string;
  amountDiscount?: number;
  address?: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  status?: string;
  orderDate?: string;
  stripeCheckoutSessionId?: string;
  stripeCustomerId?: string;
  stripePaymentIntentId?: string;
}

interface OrderDetailsDialogProps {
  order: OrderType | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Order Details - {order?.orderNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Customer:</strong> {order.customerName || "Guest"}
            </p>
            <p>
              <strong>Email:</strong> {order.email || "-"}
            </p>
          </div>
          <div>
            <p>
              <strong>Date:</strong>{" "}
              {order.orderDate && new Date(order.orderDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="capitalize text-green-600 font-medium">
                {order.status || "Pending"}
              </span>
            </p>
          </div>
          {order.phone && (
            <p>
              <strong>Phone:</strong> {order.phone}
            </p>
          )}
          {order.guestSessionId && (
            <p>
              <strong>Session ID:</strong> {order.guestSessionId.slice(0, 15)}...
            </p>
          )}
        </div>

        {order.address && (order.address.address || order.address.city) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium mb-1">Shipping Address:</p>
            <p className="text-sm text-gray-600">
              {order.address.name && <span>{order.address.name}, </span>}
              {order.address.address && <span>{order.address.address}, </span>}
              {order.address.city && <span>{order.address.city}, </span>}
              {order.address.state && <span>{order.address.state}, </span>}
              {order.address.zip && <span>{order.address.zip}</span>}
            </p>
          </div>
        )}

        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.products && order.products.length > 0 ? (
              order.products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="flex items-center gap-2">
                    {item?.product?.images && item.product.images[0] && (
                      <Image
                        src={urlFor(item.product.images[0]).url()}
                        alt="productImage"
                        width={50}
                        height={50}
                        unoptimized={true}
                        className="border rounded-sm"
                      />
                    )}
                    <span>{item?.product?.name || "Product"}</span>
                  </TableCell>
                  <TableCell>{item?.quantity || 1}</TableCell>
                  <TableCell>
                    <PriceFormatter
                      amount={item?.product?.price}
                      className="text-black font-medium"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 text-right flex items-center justify-end">
          <div className="w-44 flex flex-col gap-1">
            {order?.amountDiscount !== 0 && order?.amountDiscount && (
              <div className="w-full flex items-center justify-between">
                <strong>Discount: </strong>
                <PriceFormatter
                  amount={order?.amountDiscount}
                  className="text-black font-bold"
                />
              </div>
            )}
            {order?.amountDiscount !== 0 && order?.amountDiscount && (
              <div className="w-full flex items-center justify-between">
                <strong>Subtotal: </strong>
                <PriceFormatter
                  amount={
                    (order?.totalPrice || 0) + (order?.amountDiscount || 0)
                  }
                  className="text-black font-bold"
                />
              </div>
            )}
            <div className="w-full flex items-center justify-between">
              <strong>Total: </strong>
              <PriceFormatter
                amount={order?.totalPrice}
                className="text-black font-bold"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;