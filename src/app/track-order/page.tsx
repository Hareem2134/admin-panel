"use client";

import { useState } from "react";
import { client } from "../../sanity/lib/client";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);

  const fetchOrder = async () => {
    const result = await client.fetch(`*[_type == "order" && _id == "${orderId}"]`);
    setOrder(result[0]);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold">Track Your Order</h2>
      <input
        type="text"
        placeholder="Enter Order ID"
        className="w-full p-2 border rounded mt-4"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <button onClick={fetchOrder} className="bg-blue-500 text-white p-2 mt-4 rounded w-full">
        Track Order
      </button>

      {order && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <p>Order Status: {order.status}</p>
          <p>Total Amount: ${order.total}</p>
          <p>Placed On: {order.date}</p>
        </div>
      )}
    </div>
  );
}
