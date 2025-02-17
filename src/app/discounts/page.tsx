"use client";
import AdminLayout from "../../../components/AdminLayout";
import { useState, useEffect } from "react";
import { Discount } from '../../../types';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({
    code: "",
    type: "percentage",
    value: 0,
    active: true,
    expiry: "",
    _createdAt: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch("/api/discounts");
      const data = await response.json();
      setDiscounts(data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  const generateDiscountCode = () => {
    setNewDiscount({
      ...newDiscount,
      code: `DISC-${Math.random().toString(36).substr(2, 5).toUpperCase()}-${Date.now()}`,
    });
  };
  
  const createDiscount = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDiscount),
      });

      if (!response.ok) throw new Error("Failed to create discount");

      await fetchDiscounts();
      setSuccess("Discount created successfully!");
    } catch (err) {
      setError("Error creating discount");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this discount?")) {
      try {
        const response = await fetch(`/api/discounts?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete discount");

        const updatedDiscounts = await response.json();
        setDiscounts(updatedDiscounts);
        setSuccess("Discount deleted successfully!");
      } catch (err) {
        setError("Error deleting discount");
        console.error(err);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discount Management
          </h1>
        </div>

        {/* Discount Creation Form */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-800">
            Create New Discount
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Form Fields */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Discount Code</label>
              <input
                type="text"
                className="w-full p-2 md:p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="datetime-local"
                className="w-full p-2 md:p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select className="w-full p-2 md:p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200">
                <option>Percentage</option>
                <option>Fixed Amount</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Value</label>
              <input
                type="number"
                className="w-full p-2 md:p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-8">
            <button className="w-full md:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Generate Code
            </button>
            <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Create Discount
            </button>
          </div>
        </div>

        {/* Discounts Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 md:p-4 text-left text-sm font-medium text-gray-700">Code</th>
                  <th className="p-3 md:p-4 text-left text-sm font-medium text-gray-700">Type</th>
                  <th className="p-3 md:p-4 text-left text-sm font-medium text-gray-700">Value</th>
                  <th className="p-3 md:p-4 text-left text-sm font-medium text-gray-700">Expiry</th>
                  <th className="p-3 md:p-4 text-left text-sm font-medium text-gray-700">Created</th>
                  <th className="p-3 md:p-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="p-3 md:p-4 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {discounts.map((discount) => (
                  <tr key={discount._id} className="hover:bg-gray-50">
                    <td className="p-3 md:p-4 whitespace-nowrap text-sm">{discount.code}</td>
                    <td className="p-3 md:p-4 whitespace-nowrap text-sm">{discount.type}</td>
                    <td className="p-3 md:p-4 whitespace-nowrap text-sm">
                      {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap text-sm">
                      {new Date(discount.expiry).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap text-sm">
                      {new Date(discount._createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${discount.active ? 'bg-green-100' : 'bg-red-100'}`}>
                        {discount.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 whitespace-nowrap">
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}