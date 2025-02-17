//admin-panel\src\app\orders\page.tsx
"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import AdminLayout from "../../../components/AdminLayout";

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
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Order Management
          </h1>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">Order #{order._id.slice(-6)}</span>
                <span className="text-blue-600 font-semibold">${order.total}</span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                {new Date(order._createdAt).toLocaleDateString()}
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Status:</span> {order.status}
                </div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Shipping Address:</span> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}