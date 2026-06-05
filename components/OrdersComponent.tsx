
"use client";

import { TableBody, TableCell, TableRow } from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { X, Trash2, Eye, AlertTriangle, RefreshCw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import OrderDetailDialog from "./OrderDetailDialog";

interface OrderType {
  _id: string;
  orderNumber?: string;
  orderDate?: string;
  customerName?: string;
  email?: string;
  totalPrice?: number;
  status?: string;
  invoice?: { number?: string };
  products?: any[];
  [key: string]: any;
}

interface OrdersComponentProps {
  orders: OrderType[];
  onOrderDeleted?: (orderId: string) => void;
  onOrderHidden?: (orderId: string) => void;
}

const OrdersComponent = ({ orders, onOrderDeleted, onOrderHidden }: OrdersComponentProps) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    show: boolean;
    orderId: string;
    orderNumber: string;
  }>({ show: false, orderId: "", orderNumber: "" });

  // دالة لإخفاء الطلب من العرض فقط (يضاف إلى localStorage)
  const handleHideOnly = (orderId: string) => {
    setDeletingOrderId(orderId);
    
    if (onOrderHidden) {
      onOrderHidden(orderId);
    }
    
    toast.success("Order removed from your list");
    
    setDeletingOrderId(null);
    setShowConfirmDialog({ show: false, orderId: "", orderNumber: "" });
  };

  // دالة لإلغاء الطلب بالكامل (يمسح من Sanity ويستعيد المخزون)
  const handleCancelCompletely = async (orderId: string) => {
    setDeletingOrderId(orderId);
    
    try {
      const response = await fetch(`/api/orders?orderId=${orderId}&restoreStock=true`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success("Order cancelled and stock restored!");
        
        if (onOrderDeleted) {
          onOrderDeleted(orderId);
        }
      } else {
        toast.error(data.error || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Something went wrong");
    } finally {
      setDeletingOrderId(null);
      setShowConfirmDialog({ show: false, orderId: "", orderNumber: "" });
    }
  };

  const openDeleteDialog = (e: React.MouseEvent, orderId: string, orderNumber: string) => {
    e.stopPropagation();
    setShowConfirmDialog({ 
      show: true, 
      orderId, 
      orderNumber,
    });
  };

  const SPACER_ROWS = 3;

  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders.map((order) => (
            <Tooltip key={order?.orderNumber || order?._id}>
              <TooltipTrigger asChild>
                <TableRow
                  className="cursor-pointer hover:bg-gray-100 h-12"
                  onClick={() => setSelectedOrder(order)}
                >
                  <TableCell className="font-medium">
                    {order.orderNumber?.slice(-10) ?? "N/A"}...
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order?.orderDate &&
                      format(new Date(order.orderDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{order.customerName || "Guest"}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.email || "-"}
                  </TableCell>
                  <TableCell>
                    <PriceFormatter
                      amount={order?.totalPrice}
                      className="text-black font-medium"
                    />
                  </TableCell>
                  <TableCell>
                    {order?.status && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === "paid" || order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order?.status.charAt(0).toUpperCase() +
                          order?.status.slice(1)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order?.invoice?.number || "----"}
                  </TableCell>
                  <TableCell
                    onClick={(event) => openDeleteDialog(event, order._id, order.orderNumber || "N/A")}
                    className="flex items-center justify-center group"
                  >
                    {deletingOrderId === order._id ? (
                      <RefreshCw size={16} className="animate-spin text-gray-400" />
                    ) : (
                      <X
                        size={18}
                        className="text-gray-400 group-hover:text-red-500 hoverEffect cursor-pointer"
                      />
                    )}
                  </TableCell>
                </TableRow>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click to see order details</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>

        {Array.from({ length: SPACER_ROWS }).map((_, idx) => (
          <TableRow
            key={`empty-spacer-${idx}`}
            className="h-12 hover:bg-transparent cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <TableCell colSpan={8} className="p-0 border-none" />
          </TableRow>
        ))}
      </TableBody>

      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {showConfirmDialog.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Order Action</h3>
            </div>
            
            <p className="text-gray-600 text-sm mb-2">
              Order: <span className="font-mono text-xs">{showConfirmDialog.orderNumber}</span>
            </p>
            <p className="text-gray-600 text-sm mb-6">
              Choose an action for this order:
            </p>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleHideOnly(showConfirmDialog.orderId)}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-gray-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200">
                    <Eye size={14} className="text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800 text-sm">Remove from view only</p>
                    <p className="text-xs text-gray-400">Order hidden from your list only</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">→</span>
              </button>
              
              <button
                onClick={() => handleCancelCompletely(showConfirmDialog.orderId)}
                className="w-full flex items-center justify-between p-3 border border-red-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200">
                    <Trash2 size={14} className="text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-red-700 text-sm">Cancel order completely</p>
                    <p className="text-xs text-red-400">Delete from database & restore stock</p>
                  </div>
                </div>
                <span className="text-xs text-red-400">→</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowConfirmDialog({ show: false, orderId: "", orderNumber: "" })}
              className="w-full py-2.5 text-center text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersComponent;