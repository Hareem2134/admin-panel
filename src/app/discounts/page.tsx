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

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-5">Discount Management</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Discount Code"
          value={newDiscount.code || ""}
          className="border p-2 mr-2"
          onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
        />
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          onClick={generateDiscountCode}
        >
          Generate New Code
        </button>
        <input
          type="datetime-local"
          placeholder="Expiry Date"
          className="border p-2 mr-2"
          onChange={(e) => setNewDiscount({ ...newDiscount, expiry: e.target.value })}
        />
        <select
          className="border p-2 mr-2"
          onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as "percentage" | "fixed" })}
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed Amount</option>
        </select>
        <input
          type="number"
          placeholder="Value"
          className="border p-2 mr-2"
          onChange={(e) => setNewDiscount({ ...newDiscount, value: Number(e.target.value) })}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={createDiscount}
        >
          Create Discount
        </button>
      </div>

      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Code</th>
            <th className="p-3">Type</th>
            <th className="p-3">Value</th>
            <th className="p-3">Expiry Date</th>
            <th className="p-3">Generated At</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {discounts
            .sort((a, b) => new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime())
            .map((discount) => (
              <tr key={discount._id} className="border-b">
                <td className="p-3">{discount.code}</td>
                <td className="p-3">{discount.type}</td>
                <td className="p-3">
                  {discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`}
                </td>
                <td className="p-3">{new Date(discount.expiry).toLocaleString()}</td>
                <td className="p-3">{new Date(discount._createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded ${
                      discount.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {discount.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}