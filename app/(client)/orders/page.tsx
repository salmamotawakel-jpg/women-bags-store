// app/(client)/orders/page.tsx
"use client";

import Container from "@/components/Container";
import OrdersComponent from "@/components/OrdersComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileX } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import FooterSection from "@/components/FooterSection";
import { client } from "@/sanity/lib/client";

interface Order {
  _id: string;
  orderNumber?: string;
  orderDate?: string;
  customerName?: string;
  email?: string;
  totalPrice?: number;
  status?: string;
  invoice?: { number?: string };
  products?: any[];
}

const STORAGE_KEY = "hidden_orders";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);
  const [hiddenOrders, setHiddenOrders] = useState<Set<string>>(new Set());

  // تحميل الطلبات المخفية من localStorage
  useEffect(() => {
    const savedHiddenOrders = localStorage.getItem(STORAGE_KEY);
    if (savedHiddenOrders) {
      setHiddenOrders(new Set(JSON.parse(savedHiddenOrders)));
    }
  }, []);

  // حفظ الطلبات المخفية في localStorage
  const saveHiddenOrders = (newHiddenOrders: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newHiddenOrders)));
  };

  // جلب session ID من cookie
  useEffect(() => {
    const getSessionId = async () => {
      try {
        const response = await fetch("/api/session");
        const data = await response.json();
        setGuestSessionId(data.sessionId);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };
    getSessionId();
  }, []);

  // جلب الطلبات
  const fetchOrders = async () => {
    if (!guestSessionId) return;
    
    setLoading(true);
    try {
      const query = `*[_type == "order" && guestSessionId == $sessionId] | order(orderDate desc){
        _id,
        orderNumber,
        orderDate,
        customerName,
        email,
        totalPrice,
        status,
        invoice,
        products
      }`;
      
      const fetchedOrders = await client.fetch(query, { sessionId: guestSessionId });
      setOrders(fetchedOrders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (guestSessionId) {
      fetchOrders();
    }
  }, [guestSessionId]);

  // دالة لإخفاء الطلب من العرض فقط (يضاف إلى localStorage)
  const handleOrderHidden = (orderId: string) => {
    const newHiddenOrders = new Set(hiddenOrders);
    newHiddenOrders.add(orderId);
    setHiddenOrders(newHiddenOrders);
    saveHiddenOrders(newHiddenOrders);
  };

  // دالة لحذف الطلب من القائمة (للإلغاء الكامل) - يزال من localStorage أيضاً
  const handleOrderDeleted = (orderId: string) => {
    // إزالة من localStorage إذا كان موجوداً
    const newHiddenOrders = new Set(hiddenOrders);
    newHiddenOrders.delete(orderId);
    setHiddenOrders(newHiddenOrders);
    saveHiddenOrders(newHiddenOrders);
  };

  // تصفية الطلبات - إزالة الطلبات المخفية
  const visibleOrders = orders.filter(order => !hiddenOrders.has(order._id));

  if (loading) {
    return (
      <Container className="py-20">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-pink-800 border-t-transparent" />
        </div>
      </Container>
    );
  }

  return (
    <div>
      <Container className="py-10">
        {visibleOrders.length > 0 ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-25 md:w-auto">
                        Order Number
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Date
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Email
                      </TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Invoice Number
                      </TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <OrdersComponent 
                    orders={visibleOrders} 
                    onOrderDeleted={handleOrderDeleted}
                    onOrderHidden={handleOrderHidden}
                  />
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <FileX className="h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900">
              No orders found
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
              {!guestSessionId
                ? "Start shopping to see your orders here!"
                : "You haven't placed any orders yet."}
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Browse Products</Link>
            </Button>
          </div>
        )}
      </Container>
      
      <FooterSection />
    </div>
  );
};

export default OrdersPage;