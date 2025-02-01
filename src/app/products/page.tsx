"use client";

import AdminLayout from "../../../components/AdminLayout";
import { useState, useEffect } from "react";
import { client } from "../../sanity/lib/client";
import { useRouter } from "next/navigation";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      const productsData = await client.fetch(`
        *[_type == "product"]{
          _id, name, description, price, category, stock,
          "imageUrl": image.asset->url
        }
      `);
      setProducts(productsData);
    }
    fetchProducts();
  }, []);

  const deleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    await client.delete(productId);
    setProducts((prev) => prev.filter((product) => product._id !== productId));
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
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover" />
              </td>
              <td className="p-3">{product.name}</td>
              <td className="p-3">${product.price}</td>
              <td className="p-3">{product.category}</td>
              <td className="p-3">{product.stock}</td>
              <td className="p-3 space-x-2">
                <button 
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => router.push(`/products/edit/${product._id}`)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}
