"use client";

import AdminLayout from "../../../../../components/AdminLayout";
import { useState, useEffect } from "react";
import { client } from "../../../../sanity/lib/client";
import { useRouter, useParams } from "next/navigation";

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    image: null as File | null,
    imageUrl: "",
  });

  useEffect(() => {
    if (!id) return; // Ensure id is defined

    async function fetchProduct() {
      const product = await client.fetch(
        `*[_type == "product" && _id == $id][0]{
          _id, name, description, price, category, stock,
          "imageUrl": image.asset->url
        }`,
        { id }
      );

      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          imageUrl: product.imageUrl,
          image: null,
        });
      }
    }
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return; // Prevent undefined error

    let imageUrl = formData.imageUrl;
    if (formData.image) {
      const imageAsset = await client.assets.upload("image", formData.image);
      imageUrl = imageAsset.url;
    }

    await client.patch(id).set({
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock),
      image: {
        _type: "image",
        asset: { _ref: imageUrl },
      },
    }).commit();

    router.push("/products");
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-5">Edit Product</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg">
        <input type="text" name="name" value={formData.name} required className="w-full p-2 border rounded mb-4" onChange={handleChange} />
        <textarea name="description" value={formData.description} required className="w-full p-2 border rounded mb-4" onChange={handleChange} />
        <input type="number" name="price" value={formData.price} required className="w-full p-2 border rounded mb-4" onChange={handleChange} />
        <input type="text" name="category" value={formData.category} required className="w-full p-2 border rounded mb-4" onChange={handleChange} />
        <input type="number" name="stock" value={formData.stock} required className="w-full p-2 border rounded mb-4" onChange={handleChange} />

        <label className="block mb-2">Current Image:</label>
        <img src={formData.imageUrl} alt="Current Product" className="w-24 h-24 object-cover mb-4" />

        <input type="file" accept="image/*" className="w-full p-2 border rounded mb-4" onChange={handleFileChange} />

        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Update Product</button>
      </form>
    </AdminLayout>
  );
}
