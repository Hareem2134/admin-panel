"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../../../../components/AdminLayout";

type Food = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  tags: string[];
  images: string[];
  description: string;
  longDescription: string;
  available: boolean;
};

export default function FoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();
  
  const [form, setForm] = useState<{
    name: string;
    slug: string;
    category: string;
    price: string;
    originalPrice: string;
    tags: string;
    images: string[];
    description: string;
    longDescription: string;
    available: boolean;
  }>({
    name: "",
    slug: "",
    category: "",
    price: "",
    originalPrice: "",
    tags: "",
    images: [],
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          originalPrice: parseFloat(form.originalPrice),
          tags: form.tags.split(",").map((tag) => tag.trim()),
          images: form.images,
        }),
      });

      if (!response.ok) throw new Error("Failed to save food item");

      const updatedFood = await response.json();
      if (editingId) {
        setFoods(foods.map(food => (food._id === editingId ? updatedFood : food)));
      } else {
        setFoods([...foods, updatedFood]);
      }
      setEditingId(null);
      setForm({
        name: "",
        slug: "",
        category: "",
        price: "",
        originalPrice: "",
        tags: "",
        images: [],
        description: "",
        longDescription: "",
        available: false,
      });
      setSuccess("Food item saved successfully!");
    } catch (err) {
      setError("Error saving food item");
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/food/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete food item");
      setFoods(foods.filter(food => food._id !== id));
    } catch (err) {
      console.error("Error deleting food item:", err);
    }
  }

  function handleEdit(id: string) {
    const foodToEdit = foods.find(food => food._id === id);
    if (foodToEdit) {
      setEditingId(id);
      setForm({
        name: foodToEdit.name || "",
        slug: foodToEdit.slug || "",
        category: foodToEdit.category || "",
        price: foodToEdit.price ? foodToEdit.price.toString() : "",
        originalPrice: foodToEdit.originalPrice ? foodToEdit.originalPrice.toString() : "",
        tags: Array.isArray(foodToEdit.tags) ? foodToEdit.tags.join(", ") : "",
        images: Array.isArray(foodToEdit.images) ? foodToEdit.images : [],
        description: foodToEdit.description || "",
        longDescription: foodToEdit.longDescription || "",
        available: foodToEdit.available ?? false,
      });
    }
  }

  return (
    <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Food Items</h1>
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">{editingId ? "Edit Food Item" : "Add New Food Item"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Food Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full p-2 border rounded" />
          <input type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full p-2 border rounded" />
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="w-full p-2 border rounded" />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">{editingId ? "Update" : "Add"} Food</button>
          {editingId && <button type="button" onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>}
        </form>
      </div>
      <ul>
        {foods.map(food => (
          <li key={food._id} className="bg-white p-4 shadow rounded">
            <h2>{food.name}</h2>
            <button onClick={() => handleEdit(food._id)}>Edit</button>
            <button onClick={() => handleDelete(food._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
    </AdminLayout>
  );
}
