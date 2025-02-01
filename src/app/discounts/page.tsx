"use client";
import AdminLayout from "../../../components/AdminLayout";
import { useState, useEffect } from "react";
import { client } from "../../sanity/lib/client";
import { Discount } from '../../../types';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [newDiscount, setNewDiscount] = useState<Partial<Discount>>({});

  useEffect(() => {
    client.fetch<Discount[]>(`*[_type == "discount"]`)
      .then(data => setDiscounts(data.filter(d => !!d)));
  }, []);

  const createDiscount = async () => {
    const discount = await client.create({
      _type: "discount",
      code: newDiscount.code || 'DEFAULT_CODE',
      type: newDiscount.type || 'percentage',
      value: newDiscount.value || 0,
      active: true,
      expiry: newDiscount.expiry || new Date().toISOString()
    });

    // Type-safe state update
    setDiscounts(prev => [
      ...prev,
      {
        _id: discount._id,
        _type: discount._type,
        _rev: discount._rev,
        _createdAt: discount._createdAt,
        _updatedAt: discount._updatedAt,
        code: discount.code,
        type: discount.type as 'percentage' | 'fixed',
        value: discount.value,
        active: discount.active,
        expiry: discount.expiry
      }
    ]);
  };

  const toggleDiscount = async (id: string, active: boolean) => {
    await client.patch(id).set({ active }).commit();
    setDiscounts(discounts.map(d => 
      d._id === id ? { ...d, active } : d
    ));
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-5">Discount Management</h1>
      
      {/* Discount Creation Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Discount Code"
          className="border p-2 mr-2"
          onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
        />
        <select
          className="border p-2 mr-2"
          onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value as 'percentage' | 'fixed' })}
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

      {/* Discounts List */}
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3">Code</th>
            <th className="p-3">Type</th>
            <th className="p-3">Value</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr key={discount._id} className="border-b">
              <td className="p-3">{discount.code}</td>
              <td className="p-3">{discount.type}</td>
              <td className="p-3">
                {discount.type === 'percentage' 
                  ? `${discount.value}%`
                  : `$${discount.value}`}
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded ${
                  discount.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {discount.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="p-3">
                <button
                  className={`px-3 py-1 rounded ${
                    discount.active 
                      ? 'bg-red-500 text-white' 
                      : 'bg-green-500 text-white'
                  }`}
                  onClick={() => toggleDiscount(discount._id!, !discount.active)}
                >
                  {discount.active ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}