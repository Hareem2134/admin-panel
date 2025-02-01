"use client";
import { useEffect, useState } from "react";
import { client } from "../src/sanity/lib/client";
import { Order } from "../types";

export default function RealTimeOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const query = '*[_type == "order"]';
    const params = {};

    // Initial fetch
    client.fetch<Order[]>(query, params).then((data) => setOrders(data || []));

    // Real-time updates
    const subscription = client.listen<Order>(query, params).subscribe((update) => {
      setOrders((prev) => {
        if (update.transition === "appear" && update.result) {
          return [...prev, update.result]; // Add new order
        }
        if (update.transition === "disappear") {
          return prev.filter((item) => item._id !== update.documentId); // Remove order
        }
        if (update.transition === "update" && update.result) {
          return prev
            .map((item) => (item._id === update.documentId ? update.result : item)) // Update order
            .filter(Boolean) as Order[]; // Ensure no undefined values
        }
        return prev.filter(Boolean) as Order[]; // Ensure strict typing
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Real-Time Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id} className="p-3 border-b">
            <p>Order ID: {order._id}</p>
            {/* <p>Customer: {order.customerName}</p> */}
            <p>Status: {order.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
