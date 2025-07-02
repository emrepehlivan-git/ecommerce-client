"use client";

import { useGetApiV1OrderUserUserId } from "@/api/generated/order/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

interface OrdersClientProps {
  userId: string;
}

export default function OrdersClient({ userId }: OrdersClientProps) {
  const { data, isLoading, error } = useGetApiV1OrderUserUserId(userId, {
    query: { enabled: !!userId },
  });
  const orders = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-red-600">Error loading orders.</div>
    );
  }

  if (!orders || orders.length === 0) {
    return <div className="container mx-auto py-8 text-center">No orders found.</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.map((order: any) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>Order #{order.id}</CardTitle>
            <div className="text-sm text-gray-500">
              {order.orderDate?.slice(0, 10)} | Status: {order.status}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-2 font-semibold">
              Total: ₺{order.totalAmount?.toLocaleString("tr-TR")}
            </div>
            <div className="mb-2">Address: {order.shippingAddress}</div>
            <div className="mb-2">Products:</div>
            <ul className="pl-4 list-disc space-y-1">
              {order.items?.map((item: any) => (
                <li key={item.id}>
                  {item.productName} x{item.quantity} - ₺{item.totalPrice?.toLocaleString("tr-TR")}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
