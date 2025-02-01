// app/orders/page.tsx
"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";

interface Order {
  _id: string;
  status: string;
  total: number;
  items: Array<{
    product: { _ref: string };
    quantity: number;
    priceAtPurchase: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  _createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const query = `*[_type == "order"] | order(_createdAt desc) {
      _id,
      status,
      total,
      items[] {
        product->{name},
        quantity,
        priceAtPurchase
      },
      shippingAddress,
      _createdAt
    }`;

    client.fetch<Order[]>(query).then(setOrders);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded-lg">
            <div className="flex justify-between">
              <span>Order #{order._id.slice(-6)}</span>
              <span>${order.total}</span>
            </div>
            <div className="text-sm text-gray-600">
              {new Date(order._createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}