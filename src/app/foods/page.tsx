"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../../components/AdminLayout";

interface Food {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  tags: string[];
  images: { _type: "image"; asset: { _ref: string } }[];
  description: string;
  longDescription: string;
  available: boolean;
}

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    price: "",
    originalPrice: "",
    tags: "",
    images: [] as { _type: "image"; asset: { _ref: string } }[], // ✅ Explicitly set type
    description: "",
    longDescription: "",
    available: false,
  });

  useEffect(() => {
    fetch("/api/food")
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching foods:", error);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/food/${editingId}` : "/api/food";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          originalPrice: parseFloat(form.originalPrice),
          tags: form.tags.split(",").map(tag => tag.trim()),
          images: form.images.map(img => ({ _type: "image", asset: { _ref: img.asset._ref } })), // ✅ Ensures images are correctly structured
        }),
      });

      if (!response.ok) throw new Error("Failed to save food item");

      const updatedFood = await response.json();
      setFoods(editingId ? foods.map(food => (food._id === editingId ? updatedFood : food)) : [...foods, updatedFood]);

      setEditingId(null);
      setForm({
        name: "",
        slug: "",
        category: "",
        price: "",
        originalPrice: "",
        tags: "",
        images: [] as { _type: "image"; asset: { _ref: string } }[], // ✅ Resets correctly
        description: "",
        longDescription: "",
        available: false,
      });
      setSuccess("Food item saved successfully!");
    } catch (err: any) {
      setError(err.message || "Error saving food item");
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/food/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete food item");
      setFoods(foods.filter(food => food._id !== id));
    } catch (err: any) {
      setError(err.message || "Error deleting food item");
    }
  }

  function handleEdit(id: string) {
    const foodToEdit = foods.find(food => food._id === id);
    if (foodToEdit) {
      setEditingId(id);
      setForm({
        name: foodToEdit.name,
        slug: foodToEdit.slug,
        category: foodToEdit.category,
        price: foodToEdit.price.toString(),
        originalPrice: foodToEdit.originalPrice.toString(),
        tags: foodToEdit.tags.join(", "),
        images: foodToEdit.images.map(img => ({
          _type: "image",
          asset: { _ref: img.asset._ref },
        })),
        description: foodToEdit.description,
        longDescription: foodToEdit.longDescription,
        available: foodToEdit.available,
      });
    }
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{editingId ? "Edit Food Item" : "Add New Food Item"}</h1>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-lg rounded-lg">
          <input type="text" placeholder="Food Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" required />
          <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full p-2 border rounded" />
          <input type="number" placeholder="Current Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full p-2 border rounded" required />
          <input type="number" placeholder="Original Price" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full p-2 border rounded" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded" />
          <textarea placeholder="Long Description" value={form.longDescription} onChange={(e) => setForm({ ...form, longDescription: e.target.value })} className="w-full p-2 border rounded" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">{editingId ? "Update" : "Add"} Food</button>
        </form>
        <ul className="mt-6 space-y-4">
          {foods.map((food) => (
            <li key={food._id} className="bg-white p-4 shadow rounded">
              <h2 className="text-lg font-semibold">{food.name}</h2>
              <p>{food.description}</p>
              <p className="font-bold">Price: ${food.price}</p>
              <button onClick={() => handleEdit(food._id)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
              <button onClick={() => handleDelete(food._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
