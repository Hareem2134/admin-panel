"use client";
import AdminLayout from "../../../components/AdminLayout";
import { useState } from "react";
import Papa, { ParseResult } from "papaparse";

type ProductCSV = {
  name: string;
  price: string;
  tag: string;
  category: string;
  description: string;
  "long description": string;
  stock: string;
};

type SanityProduct = {
  name: string;
  price: number;
  tags: string[];
  category: string;
  description: string;
  longDescription: string;
  stock: number;
};

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<ProductCSV[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      Papa.parse<ProductCSV>(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setProducts(results.data);
        },
        error: (error) => {
          console.error("CSV parse error:", error);
          alert("Error parsing CSV file");
        }
      });
    }
  };

  const handleUpload = async () => {
    if (!products.length) return alert("No products to upload!");
    
    setUploading(true);
    try {
      // Convert CSV data to Sanity format
      const sanityProducts: SanityProduct[] = products.map(product => ({
        name: product.name,
        price: Number(product.price.replace(/[^0-9.]/g, "")),
        tags: product.tag.split(",").map(t => t.trim()),
        category: product.category,
        description: product.description,
        longDescription: product["long description"],
        stock: Number(product.stock.replace(/[^0-9]/g, ""))
      }));

      const response = await fetch("/api/products/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanityProducts),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || "Upload failed");
      
      alert(`Successfully uploaded ${responseData.length} products!`);
      setProducts([]);
    } catch (error: any) {
      console.error("Upload error:", error);
      alert(error.message || "Error uploading products");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-5">Bulk Upload Products</h1>
      <input type="file" accept=".csv" className="p-2 border rounded mb-4" onChange={handleFileChange} />
      <button className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400" onClick={handleUpload} disabled={uploading}>
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