"use client";

import AdminLayout from "../../../components/AdminLayout";
import { useState, useEffect } from "react";
import { client } from "../../sanity/lib/client";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "../../../utils/isAdmin";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const router = useRouter();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsData = await client.fetch(`
          *[_type == "food"]{
            _id, name, description, price, category, stock,
            "imageUrl": image.asset->url
          }
        `);
        setProducts(productsData);
      } catch (error: any) {
        console.error("Error fetching products:", error);
        alert(`Error fetching products: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleEdit = (id: string) => {
    const productToEdit = products.find((product) => product._id === id);
    if (productToEdit) {
      setEditingId(id);
      setForm({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price.toString(),
        category: productToEdit.category,
        stock: productToEdit.stock.toString(),
      });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const email = user?.emailAddresses[0]?.emailAddress;
      if (!(await isAdmin(email))) {
        alert("Unauthorized: You do not have permission to delete products.");
        return;
      }

      await client.delete(productId);
      setProducts((prev) => prev.filter((product) => product._id !== productId));
      alert("✅ Product deleted successfully!");
    } catch (error: any) {
      console.error("❌ Error deleting product:", error);
      alert(`Failed to delete product: ${error.message}`);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-5">Product Management</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-5"
        onClick={() => router.push("/products/add")}
      >
        + Add New Product
      </button>

      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Image</th>
              <th className="p-3">Product Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-3">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover" />
                  ) : (
                    <span className="text-gray-500">No Image</span>
                  )}
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">${product.price}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
}
