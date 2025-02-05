"use client";

import AdminLayout from "../../../../../components/AdminLayout";
import { useState, useEffect } from "react";
import { client } from "../../../../sanity/lib/client";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "../../../../../utils/isAdmin";

export default function EditProduct() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  const params = useParams();
  const id = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : null;

  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    image: null as File | null,
    imageUrl: null as string | null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid product ID.");
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      try {
        const product = await client.fetch(
          `*[_type == "food" && _id == $id][0]{
            ...,
            "imageUrl": image.asset->url
          }`,
          { id }
        );

        if (product) {
          setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || 0,
            category: product.category || "",
            stock: product.stock || 0,
            imageUrl: product.imageUrl || null,
            image: null,
          });
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product. Please check permissions.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user is admin
      const email = user?.emailAddresses[0]?.emailAddress;
      if (!(await isAdmin(email))) {
        alert("Unauthorized: You do not have permission to update products.");
        return;
      }

      // Upload new image if exists
      let imageRef = formData.imageUrl;
      if (formData.image) {
        const imageAsset = await client.assets.upload("image", formData.image);
        imageRef = imageAsset._id;
      }

      // Update product document
      if (!id) {
        alert("Error: Missing product ID.");
        return;
      }
      
      await client
        .patch(id)
        .set({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          stock: Number(formData.stock),
          image: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageRef,
            },
          },
        })
        .commit();
      

      alert("✅ Product updated successfully!");
      router.push("/products");
    } catch (error: any) {
      console.error("❌ Error updating product:", error);
      alert(`Error updating product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-5">Edit Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-gray-500">Loading product...</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg">
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          />

          <label className="block text-sm font-medium mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded mb-4"
          />

          {/* Image Preview */}
          <label className="block text-sm font-medium mb-1">Current Image:</label>
          {formData.imageUrl ? (
            <img src={formData.imageUrl} alt="Product Image" className="w-24 h-24 object-cover mb-4" />
          ) : (
            <p className="text-gray-500">No Image Available</p>
          )}

          {/* Upload New Image */}
          <label className="block text-sm font-medium mb-1">Upload New Image:</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded mb-4"
            onChange={handleFileChange}
          />

          <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
            Update Product
          </button>
        </form>
      )}
    </AdminLayout>
  );
}
