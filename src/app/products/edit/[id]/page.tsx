"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../../../components/AdminLayout";

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

export default function EditFoodPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

// Update the useEffect to properly initialize images:
useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(`/api/food/${params.id}`);
        const data = await response.json();
        setForm({
          name: data.name,
          category: data.category,
          price: data.price.toString(),
          originalPrice: data.originalPrice?.toString() || "",
          tags: data.tags?.join(", ") || "",
          description: data.description,
          longDescription: data.longDescription,
          images: data.images || [], // Ensure images array exists
          available: data.available || false,
        });
      } catch (error) {
        console.error("Failed to fetch food:", error);
        setError("Failed to load food item.");
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate required fields
      if (!form.name || !form.category || !form.price || !form.description) {
        throw new Error("Please fill in all required fields.");
      }

      // Prepare FormData
      const formData = new FormData();
      const data = {
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        originalPrice: parseFloat(form.originalPrice),
        tags: form.tags.split(",").map((tag) => tag.trim()),
        description: form.description,
        longDescription: form.longDescription,
        available: form.available,
        images: form.images,
      };
      formData.append("data", JSON.stringify(data));

      // Append image files to FormData
      selectedFiles.forEach((file) => formData.append("images", file));

      // Send the request
      const response = await fetch(`/api/food/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      // Read the response body once and store it
      const responseData = await response.text();

      if (!response.ok) {
        try {
          const errorResponse = JSON.parse(responseData); // Parse the stored response
          console.error("Error response:", errorResponse);
          throw new Error(errorResponse.error || "Failed to update food item");
        } catch (err) {
          // If the response is not JSON, throw the raw response
          throw new Error(responseData);
        }
      }

      const updatedFood = JSON.parse(responseData); // Parse the stored response
      setSuccess("Food item updated successfully!");
      router.push("/foods"); // Redirect to the foods page after successful update
    } catch (err: any) {
      setError(err.message || "Error updating food item");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  return (
<AdminLayout>
  <div className="p-6 max-w-6xl mx-auto animate-fade-in">
    <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Edit Product
    </h1>
    
    <div className="bg-white p-8 rounded-2xl shadow-xl mb-8 transition-all duration-300 hover:shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="space-y-2 form-element">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              placeholder="Delicious Burger"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2 form-element">
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              placeholder="9.99"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
              required
            />
          </div>

          {/* Original Price */}
          <div className="space-y-2 form-element">
            <label className="block text-sm font-medium text-gray-700">Original Price ($)</label>
            <input
              type="number"
              placeholder="12.99"
              value={form.originalPrice}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>

          {/* Category */}
          <div className="space-y-2 form-element">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              placeholder="Burgers"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2 form-element">
            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="vegan, spicy, popular"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
            />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg md:col-span-2">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="sr-only peer"
                id="availableCheckbox"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors duration-300 after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow-md after:transition-all peer-checked:after:translate-x-5"></div>
            </div>
            <label htmlFor="availableCheckbox" className="text-sm font-medium text-gray-700">
              Available in Stock
            </label>
          </div>

          {/* Descriptions */}
          <div className="space-y-2 md:col-span-2 form-element">
            <label className="block text-sm font-medium text-gray-700">Short Description</label>
            <textarea
              placeholder="A delicious burger with..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 h-32"
            />
          </div>

          <div className="space-y-2 md:col-span-2 form-element">
            <label className="block text-sm font-medium text-gray-700">Detailed Description</label>
            <textarea
              placeholder="Detailed information about..."
              value={form.longDescription}
              onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 h-48"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2 md:col-span-2 form-element">
            <label className="block text-sm font-medium text-gray-700">Product Images</label>
            <div className="flex items-center justify-center w-full rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-300 p-8 text-center">
              <input
                type="file"
                multiple
                onChange={(e) => e.target.files && setSelectedFiles(Array.from(e.target.files))}
                className="absolute opacity-0 w-full h-full cursor-pointer"
              />
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Drag & drop images or click to upload</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Updating...
            </div>
          ) : (
            "Update Product"
          )}
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Products
        </button>

        {/* Status Messages */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 animate-shake">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}
      </form>
    </div>
  </div>
</AdminLayout>
  );
}