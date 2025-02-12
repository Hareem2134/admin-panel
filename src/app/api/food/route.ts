import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[]; // Get multiple image files
    const data = JSON.parse(formData.get("data") as string); // Get JSON data from formData

    // Validate required fields
    if (!data.name || !data.category || !data.price || !data.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upload images to Sanity
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const uploaded = await client.assets.upload("image", file, {
          filename: file.name,
        });
        return { _type: "image", asset: { _ref: uploaded._id } };
      })
    );

    // Ensure `tags` is an array
    const tags = Array.isArray(data.tags)
      ? data.tags.map((tag: string) => tag.trim())
      : data.tags.split(",").map((tag: string) => tag.trim());

    // Handle legacy image (if provided)
    const legacyImage = uploadedImages.length > 0 ? uploadedImages[0] : null;

    // Construct new food item with all required fields
    const newFood = {
      _type: "food",
      name: data.name,
      slug: { _type: "slug", current: `${data.name}-${nanoid(5)}` },
      category: data.category,
      price: parseFloat(data.price),
      originalPrice: parseFloat(data.originalPrice) || parseFloat(data.price),
      description: data.description,
      longDescription: data.longDescription || "",
      tags: tags || [],
      available: typeof data.available === "boolean" ? data.available : false,
      images: uploadedImages,
      image: legacyImage, // Assign legacy image from uploaded images
    };

    const createdFood = await client.create(newFood);
    return NextResponse.json(createdFood, { status: 201 });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { error: "Image upload failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const foods = await client.fetch('*[_type == "food"]');
    return NextResponse.json(foods, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch food items" }, { status: 500 });
  }
}
