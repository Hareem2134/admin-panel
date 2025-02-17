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
  <div className="p-4 sm:p-6 max-w-6xl mx-auto">
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Discount Management
      </h1>
    </div>

    {/* Discount Creation Form */}
    <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl mb-8">
      <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800">Create New Discount</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Discount Code</label>
          <input
            type="text"
            placeholder="Discount Code"
            value={newDiscount.code || ""}
            onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="datetime-local"
            placeholder="Expiry Date"
            onChange={(e) => setNewDiscount({ ...newDiscount, expiry: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as "percentage" | "fixed" })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Value</label>
          <input
            type="number"
            placeholder="Value"
            onChange={(e) => setNewDiscount({ ...newDiscount, value: Number(e.target.value) })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={generateDiscountCode}
          className="bg-gray-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-600 transition-all transform hover:scale-105 shadow-lg"
        >
          Generate New Code
        </button>
        <button
          onClick={createDiscount}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
        >
          Create Discount
        </button>
      </div>
    </div>

    {/* Discounts Table */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">Expiry Date</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">Generated At</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {discounts
              .sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime())
              .map((discount) => (
                <tr key={discount._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-3">{discount.code}</td>
                  <td className="px-4 sm:px-6 py-3">{discount.type}</td>
                  <td className="px-4 sm:px-6 py-3">
                    {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                  </td>
                  <td className="px-4 sm:px-6 py-3">{new Date(discount.expiry).toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-3">{new Date(discount._createdAt).toLocaleString()}</td>
                  <td className="px-4 sm:px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-sm font-medium ${
                        discount.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {discount.active ? 'Active' : 'Inactive ❌'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <button
                      onClick={() => handleDelete(discount._id)}
                      className="text-red-600 hover:text-red-800 transition-colors px-2 sm:px-3 py-1 rounded-md hover:bg-red-50"
                    >
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