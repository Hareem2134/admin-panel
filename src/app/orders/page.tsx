//admin-panel\src\app\orders\page.tsx
"use client";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import AdminLayout from "../../../components/AdminLayout";
import { ChevronRight } from "lucide-react";

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
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Order Management
          </h1>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">
                  Order #{order._id.slice(-6)}
                </span>
                <span className="text-blue-600 font-semibold">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              {/* Order Date */}
              <div className="text-sm text-gray-500 mb-4">
                {new Date(order._createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Order Details */}
              <div className="space-y-3">
                {/* Status */}
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Shipping Address */}
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Shipping Address:</span>
                  <p className="mt-1 text-gray-600">
                    {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                </div>

                {/* View Details Button */}
                <button className="w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center">
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}