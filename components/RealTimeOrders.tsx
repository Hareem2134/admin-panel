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
    <div className="w-full">
      {/* Orders Table */}
      <table className="w-full">
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
              {/* Order ID */}
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                #{order._id.slice(-6).toUpperCase()}
              </td>

              {/* Customer */}
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{order.customerName}</div>
                    <div className="text-gray-500">{order.customerEmail}</div>
                  </div>
                </div>
              </td>

              {/* Amount */}
              <td className="px-6 py-4 text-sm text-gray-900">
                ${order.total.toFixed(2)}
              </td>

              {/* Status */}
              <td className="px-6 py-4 text-sm text-gray-900">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-sm font-medium">
                <div className="flex space-x-4">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    View Details
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}