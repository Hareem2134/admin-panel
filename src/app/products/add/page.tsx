// admin-panel/src/app/products/add/page.tsx
"use client";
import AdminLayout from "../../../../components/AdminLayout";
import { useState } from "react";
import { client } from "../../../sanity/lib/client";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  image: z.any().refine((file) => file?.size <= 5000000, "Max image size is 5MB")
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProduct() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    
    try {
      const imageAsset = await client.assets.upload("image", data.image);
      
      await client.create({
        _type: "food",
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        image: {
          _type: "image",
          asset: { _ref: imageAsset._id }
        },
        available: true
      });

      router.push("/products");
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 shadow rounded-lg space-y-6">
          {/* Form fields with validation */}
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Add other fields similarly */}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/products")}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
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