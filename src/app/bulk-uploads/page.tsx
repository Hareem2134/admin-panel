"use client";
import AdminLayout from "../../../components/AdminLayout";
import { useState } from "react";
import Papa, { ParseResult } from "papaparse";

type ProductCSV = {
  name: string;
  price: string;
  category: string;
  stock: string;
  tag?: string; // Optional
  description?: string; // Optional
  "long description"?: string; // Optional
};

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<ProductCSV[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      Papa.parse<ProductCSV>(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError(`CSV Error: ${results.errors[0].message}`);
            return;
          }
          
          // Validate required fields
          const isValid = results.data.every(product => 
            product.name && product.price && product.category && product.stock
          );
          
          if (!isValid) {
            setError("Missing required fields in some rows (name, price, category, stock)");
            return;
          }

          setProducts(results.data);
        },
        error: (error) => {
          setError(`CSV Parse Error: ${error.message}`);
        }
      });
    }
  };

  const handleUpload = async () => {
    if (!products.length) {
      setError("No products to upload!");
      return;
    }
    
    setUploading(true);
    setError("");
    
    try {
      // Transform CSV data to Sanity format
      const sanityProducts = products.map(product => ({
        _type: "product",
        name: product.name.trim(),
        price: parseFloat(product.price.replace(/[^0-9.]/g, "")),
        tags: product.tag 
          ? product.tag.split(",").map(t => t.trim()).filter(t => t)
          : [], // Handle missing tags
        category: product.category.trim(),
        description: product.description?.trim() || "", // Handle optional field
        longDescription: product["long description"]?.trim() || "", // Handle optional field
        stock: parseInt(product.stock.replace(/[^0-9]/g, ""), 10)
      }));

      const response = await fetch("/api/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanityProducts),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      alert(`Successfully uploaded ${result.length} products!`);
      setProducts([]);
      setFile(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload products");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Bulk Product Upload</h1>
        
        {/* CSV Requirements */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">CSV File Requirements:</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Required fields: <code>name, price, category, stock</code></li>
            <li>Optional fields: <code>tag, description, long description</code></li>
            <li>File encoding: UTF-8</li>
            <li>Numeric fields should not contain currency symbols</li>
            <li>Tags should be comma-separated values</li>
          </ul>
        </div>

        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Select CSV File:
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </label>
        </div>

        {/* Error Messages */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || !products.length}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg
            font-medium hover:bg-blue-700 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload Products"}
        </button>

        {/* Preview Section */}
        {products.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">CSV Preview (First 5 Rows)</h2>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(products[0]).map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.slice(0, 5).map((product, index) => (
                    <tr key={index}>
                      {Object.entries(product).map(([key, value]) => (
                        <td key={key} className="px-4 py-3 text-sm max-w-xs break-words">
                          {key === "price" ? `$${value}` : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}