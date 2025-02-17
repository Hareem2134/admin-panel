"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import Image from "next/image";

interface Food {
  _id: string;
  name: string;
  slug: { _type: "slug"; current: string };
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    tags: "",
    description: "",
    longDescription: "",
    images: [] as { _type: "image"; asset: { _ref: string } }[],
    available: false,
  });

  useEffect(() => {
    fetch("/api/food")
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((error) => console.error("Error fetching foods:", error));
  }, []);

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) {
      setEditingId(null);
      setForm({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        tags: "",
        description: "",
        longDescription: "",
        images: [],
        available: false,
      });
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
  
    try {
      if (!form.name || !form.category || !form.price || !form.description) {
        throw new Error("Please fill in all required fields.");
      }
  
      const url = editingId ? `/api/food/${editingId}` : "/api/food";
      const method = editingId ? "PUT" : "POST";
  
      const formData = new FormData();
      const data = {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        originalPrice: parseFloat(form.originalPrice),
        tags: form.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        description: form.description,
        longDescription: form.longDescription,
        available: form.available,
      };
      
      formData.append("data", JSON.stringify(data));
      selectedFiles.forEach((file) => formData.append("images", file));
  
      const response = await fetch(url, { method, body: formData });
      const responseText = await response.text();
    
      if (!response.ok) {
        try {
          const errorResponse = JSON.parse(responseText);
          throw new Error(errorResponse.error || "Failed to save food item");
        } catch (err) {
          throw new Error(responseText);
        }
      }
    
      const updatedFood = JSON.parse(responseText);

      setFoods(editingId ?
        foods.map(food => food._id === editingId ? updatedFood : food) :
        [...foods, updatedFood]
      );
  
      setEditingId(null);
      setForm({
        name: "",
        category: "",
        price: "",
        originalPrice: "",
        tags: "",
        description: "",
        longDescription: "",
        images: [],
        available: false,
      });
      setSelectedFiles([]);
      setSuccess("Food item saved successfully!");
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || "Error saving food item");
      setError(err.message.includes('tags') ? 
           "Invalid tags format. Use comma-separated values." : 
           err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/food/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete food item");
        setFoods(foods.filter(food => food._id !== id));
      } catch (err: any) {
        setError(err.message || "Error deleting food item");
      }
    }
  }

  function handleEdit(food: Food) {
    setEditingId(food._id);
    setForm({
      name: food.name,
      category: food.category,
      price: food.price.toString(),
      originalPrice: food.originalPrice.toString(),
      tags: food.tags?.join(", ") || "",
      description: food.description,
      longDescription: food.longDescription,
      images: food.images,
      available: food.available,
    });
    setShowForm(true);
  }

  function handleFileSelect(files: FileList) {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  
    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds 10MB limit: ${file.name}`);
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.name}. Only JPG, PNG, and WEBP formats allowed.`);
      }
    });
  
    setSelectedFiles(Array.from(files));
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Product Management
          </h1>
          <button
            onClick={toggleForm}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            {showForm ? "✕ Close Form" : "➕ Add New Product"}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {editingId ? `✏️ Editing: ${form.name}` : "➕ Create New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    placeholder="Delicious Burger"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    placeholder="9.99"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Original Price ($)</label>
                  <input
                    type="number"
                    placeholder="12.99"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    placeholder="Burgers"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <input
                    type="text"
                    placeholder="vegan, spicy, popular"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                  />
                  {error.includes('tags') && (
                    <div className="text-red-500 text-sm mt-1 flex items-center gap-2 animate-shake">
                      ⚠️ Invalid format - use comma separated values
                    </div>
                  )}
                </div>

                {/* Descriptions */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Short Description</label>
                  <textarea
                    placeholder="A delicious burger with..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all h-32"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
                  <textarea
                    placeholder="Detailed information about..."
                    value={form.longDescription}
                    onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all h-48"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Product Images</label>
                  <div className="relative group">
                    <div className="flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 group-hover:border-blue-400 transition-colors duration-300 p-8 text-center bg-gray-50">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-gray-500 transition-transform group-hover:scale-105">
                        <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <p className="text-sm">Drag & drop images or click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg md:col-span-2">
                  <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input
                      type="checkbox"
                      checked={form.available}
                      onChange={(e) => setForm({ ...form, available: e.target.checked })}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-blue-600"
                      id="availableToggle"
                    />
                    <label
                      htmlFor="availableToggle"
                      className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    ></label>
                  </div>
                  <label htmlFor="availableToggle" className="text-sm font-medium text-gray-700">
                    Available in Stock
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editingId ? "Updating..." : "Saving..."}
                  </div>
                ) : editingId ? (
                  "Update Product ✨"
                ) : (
                  "Add New Product 🚀"
                )}
              </button>
            </form>

            {/* Status Messages */}
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 animate-shake mt-4">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3 animate-fade-in mt-4">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                {success}
              </div>
            )}
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {foods.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {food.images?.length > 0 && (
                        <Image
                          src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${food.images[0].asset._ref.split("-")[1]}-${food.images[0].asset._ref.split("-")[2]}.${food.images[0].asset._ref.split("-")[3]}`}
                          alt={food.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover shadow-sm"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{food.name}</td>
                    <td className="px-6 py-4 text-blue-600 font-semibold">${food.price}</td>
                    <td className="px-6 py-4 text-gray-600">{food.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${food.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {food.available ? 'In Stock ✅' : 'Out of Stock ❌'}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => handleEdit(food)}
                        className="text-blue-600 hover:text-blue-800 transition-colors px-3 py-1.5 rounded-md hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="text-red-600 hover:text-red-800 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50"
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