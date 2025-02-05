"use client";

import AdminLayout from "../../../../components/AdminLayout";
import { useState } from "react";
import { client } from "../../../sanity/lib/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "../../../../utils/isAdmin";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  image: z.instanceof(File).refine(file => file.size <= 5000000, "Max image size is 5MB"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProduct() {
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isSignedIn } = useUser();

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      // Check if user is admin
      const email = user?.emailAddresses[0]?.emailAddress;
      if (!(await isAdmin(email))) {
        alert("Unauthorized: You do not have permission to create products.");
        return;
      }

      // Upload image if exists
      let imageAsset;
      if (data.image) {
        imageAsset = await client.assets.upload("image", data.image);
      }

      // Create product document
      const newProduct = {
        _type: "food",
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        image: imageAsset
          ? {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: imageAsset._id,
              },
            }
          : null,
      };

      await client.create(newProduct);
      alert("✅ Product created successfully!");
      router.push("/products");
    } catch (error: any) {
      console.error("❌ Error creating product:", error);
      alert(`Failed to create product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 shadow rounded-lg space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              {...register("name")}
              className={`w-full p-2 border rounded ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register("description")}
              className={`w-full p-2 border rounded ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className={`w-full p-2 border rounded ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              {...register("category")}
              className={`w-full p-2 border rounded ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className={`w-full p-2 border rounded ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setValue("image", e.target.files[0]);
                }
              }}
              className={`w-full p-2 border rounded ${
                errors.image ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}