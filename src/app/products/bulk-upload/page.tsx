"use client";

import AdminLayout from "../../../../components/AdminLayout";
import { useState } from "react";
import { client } from "../../../sanity/lib/client";
import Papa, { ParseResult } from "papaparse";

type ProductCSV = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
};

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<ProductCSV[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);

      // Parse CSV correctly
      Papa.parse<ProductCSV>(e.target.files[0], {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<ProductCSV>) => {
          setProducts(results.data);
        },
      });
    }
  };

  const handleUpload = async () => {
    if (!products.length) return alert("No products to upload!");

    setUploading(true);
    for (const product of products) {
      await client.create({
        _type: "product",
        name: product.name,
        description: product.description,
        price: Number(product.price),
        category: product.category,
        stock: Number(product.stock),
      });
    }
    setUploading(false);
    alert("Products uploaded successfully!");
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-5">Bulk Upload Products</h1>
      <input type="file" accept=".csv" className="p-2 border rounded mb-4" onChange={handleFileChange} />
      <button className="bg-blue-500 text-white p-2 rounded" onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Products"}
      </button>

      {products.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Preview</h2>
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
