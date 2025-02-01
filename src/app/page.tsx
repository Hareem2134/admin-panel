import { client } from "../sanity/lib/client";

export default async function Home() {
  const products = await client.fetch(`
    *[_type == "product"]{
      _id, name, description, price, category, stock,
      "imageUrl": image.asset->url
    } | order(_createdAt desc)[0...6]
  `);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-500 text-white text-center py-16">
        <h1 className="text-4xl font-bold">Welcome to Our Store</h1>
        <p className="mt-2 text-lg">Find the best products at unbeatable prices.</p>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto py-10">
        <h2 className="text-3xl font-bold mb-5">Featured Products</h2>
        <div className="grid grid-cols-3 gap-4">
          {products.map((product: any) => (
            <div key={product._id} className="bg-white p-4 shadow rounded-lg">
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
              <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
              <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded">Buy Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-200 py-10">
        <h2 className="text-3xl font-bold text-center mb-5">Shop by Category</h2>
        <div className="flex justify-center space-x-4">
          <button className="bg-white shadow p-4 rounded-lg">Electronics</button>
          <button className="bg-white shadow p-4 rounded-lg">Clothing</button>
          <button className="bg-white shadow p-4 rounded-lg">Home Appliances</button>
        </div>
      </section>

      {/* AI Recommendations (Placeholder) */}
      <section className="max-w-6xl mx-auto py-10">
        <h2 className="text-3xl font-bold mb-5">AI Recommendations</h2>
        <p>Coming Soon: Personalized product recommendations powered by AI.</p>
      </section>
    </div>
  );
}
