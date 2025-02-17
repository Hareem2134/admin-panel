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
      <div className="p-4 xs:p-5 sm:p-6 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 xs:mb-5 sm:mb-6 md:mb-8">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Discount Management
          </h1>
        </div>

        {/* Discount Creation Form */}
        <div className="bg-white p-4 xs:p-5 sm:p-6 md:p-8 rounded-lg md:rounded-xl shadow-sm xs:shadow-md sm:shadow-lg mb-6 xs:mb-7 sm:mb-8 md:mb-10">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold mb-4 xs:mb-5 sm:mb-6 md:mb-8 text-gray-800">
            Create New Discount
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
            {/* Discount Code */}
            <div className="space-y-1 xs:space-y-2">
              <label className="block text-xs xs:text-sm sm:text-base md:text-lg font-medium text-gray-700">Discount Code</label>
              <input
                type="text"
                placeholder="Enter code"
                value={newDiscount.code || ""}
                onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
                className="w-full px-3 py-2 xs:px-4 xs:py-3 sm:px-5 sm:py-4 rounded-md xs:rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-xs xs:text-sm sm:text-base"
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-1 xs:space-y-2">
              <label className="block text-xs xs:text-sm sm:text-base md:text-lg font-medium text-gray-700">Expiry Date</label>
              <input
                type="datetime-local"
                onChange={(e) => setNewDiscount({ ...newDiscount, expiry: e.target.value })}
                className="w-full px-3 py-2 xs:px-4 xs:py-3 sm:px-5 sm:py-4 rounded-md xs:rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-xs xs:text-sm sm:text-base"
              />
            </div>

            {/* Type */}
            <div className="space-y-1 xs:space-y-2">
              <label className="block text-xs xs:text-sm sm:text-base md:text-lg font-medium text-gray-700">Type</label>
              <select
                onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as "percentage" | "fixed" })}
                className="w-full px-3 py-2 xs:px-4 xs:py-3 sm:px-5 sm:py-4 rounded-md xs:rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-xs xs:text-sm sm:text-base"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>

            {/* Value */}
            <div className="space-y-1 xs:space-y-2">
              <label className="block text-xs xs:text-sm sm:text-base md:text-lg font-medium text-gray-700">Value</label>
              <input
                type="number"
                placeholder="Enter value"
                onChange={(e) => setNewDiscount({ ...newDiscount, value: Number(e.target.value) })}
                className="w-full px-3 py-2 xs:px-4 xs:py-3 sm:px-5 sm:py-4 rounded-md xs:rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all text-xs xs:text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col xs:flex-row justify-end mt-6 xs:mt-7 sm:mt-8 md:mt-10 gap-3 xs:gap-4 sm:gap-5">
            <button
              onClick={generateDiscountCode}
              className="w-full xs:w-auto px-4 py-2 xs:px-5 xs:py-3 sm:px-6 sm:py-4 text-xs xs:text-sm sm:text-base bg-gray-500 text-white rounded-md xs:rounded-lg hover:bg-gray-600 transition-all shadow-xs xs:shadow-sm hover:shadow-md"
            >
              Generate New Code
            </button>
            <button
              onClick={createDiscount}
              className="w-full xs:w-auto px-4 py-2 xs:px-5 xs:py-3 sm:px-6 sm:py-4 text-xs xs:text-sm sm:text-base bg-blue-600 text-white rounded-md xs:rounded-lg hover:bg-blue-700 transition-all shadow-xs xs:shadow-sm hover:shadow-md"
            >
              Create Discount
            </button>
          </div>
        </div>

        {/* Discounts Table */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm xs:shadow-md sm:shadow-lg overflow-hidden">
          <div className="overflow-x-auto pb-2"> {/* Added horizontal scroll indicator */}
            <table className="w-full min-w-[500px] md:min-w-[700px] lg:min-w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 text-left text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-gray-700">Code</th>
                  <th className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 text-left text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-gray-700">Type</th>
                  <th className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 text-left text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-gray-700">Value</th>
                  <th className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 text-left text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-gray-700">Expiry</th>
                  <th className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 text-left text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-gray-700">Created</th>
                  <th className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 text-left text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-gray-700">Status</th>
                  <th className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 text-left text-[10px] xs:text-xs sm:text-sm md:text-base font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {discounts.map((discount) => (
                  <tr key={discount._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 whitespace-nowrap text-[10px] xs:text-xs sm:text-sm md:text-base">{discount.code}</td>
                    <td className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 whitespace-nowrap text-[10px] xs:text-xs sm:text-sm md:text-base">{discount.type}</td>
                    <td className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 whitespace-nowrap text-[10px] xs:text-xs sm:text-sm md:text-base">
                      {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                    </td>
                    <td className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 whitespace-nowrap text-[10px] xs:text-xs sm:text-sm md:text-base">
                      {new Date(discount.expiry).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 whitespace-nowrap text-[10px] xs:text-xs sm:text-sm md:text-base">
                      {new Date(discount._createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-full text-[10px] xs:text-xs sm:text-sm font-medium ${
                          discount.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {discount.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-2 py-2 xs:px-3 xs:py-3 sm:px-4 sm:py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(discount._id)}
                        className="text-red-600 hover:text-red-800 transition-colors px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-md hover:bg-red-50 text-[10px] xs:text-xs sm:text-sm"
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