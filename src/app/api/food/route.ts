import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const data = JSON.parse(formData.get("data") as string);

    // Validate required fields
    if (!data.name || !data.category || !data.price || !data.description) {
      return NextResponse.json(
        { error: "Missing required fields: name, category, price, description" },
        { status: 400 }
      );
    }

    // Upload images to Sanity
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        try {
          const uploaded = await client.assets.upload("image", file, {
            filename: file.name,
          });
          return { _type: "image", asset: { _ref: uploaded._id } };
        } catch (error) {
          console.error("Failed to upload image:", file.name, error);
          throw new Error(`Failed to upload image: ${file.name}`);
        }
      })
    );

    // Add validation before processing
    if (!Array.isArray(data.tags)) {
      return NextResponse.json(
        { error: "Tags must be an array" },
        { status: 400 }
      );
    }

    // Construct new food item
    const newFood = {
      _type: "food",
      name: data.name,
      slug: { _type: "slug", current: `${data.name}-${nanoid(5)}` },
      category: data.category,
      price: parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
      tags: data.tags || [], // Frontend already sends array
      description: data.description,
      longDescription: data.longDescription,
      available: data.available || false,
      images: uploadedImages,
    };

    const createdFood = await client.create(newFood);
    return NextResponse.json(createdFood, { status: 201 });
  } catch (error) {
    console.error("Error creating food item:", error);
    return NextResponse.json(
      { error: "Failed to create food item", details: error instanceof Error ? error.message : "Unknown error" },
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
