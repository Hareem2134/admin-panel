import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

// ✅ Use Request & context with params correctly
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id; // Ensure correct param extraction

  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const data = JSON.parse(formData.get("data") as string);

    const existingImages = Array.isArray(data.images) ? data.images : [];
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const uploaded = await client.assets.upload("image", file);
        return { _type: "image", asset: { _ref: uploaded._id } };
      })
    );

    const tags =
      typeof data.tags === "string"
        ? data.tags.split(",").map((t: string) => t.trim())
        : Array.isArray(data.tags)
        ? data.tags
        : [];

    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: "Invalid tags format" }, { status: 400 });
    }

    const updatedFood = await client
      .patch(id)
      .set({
        ...data,
        tags,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
        images: [...existingImages, ...uploadedImages],
        available: Boolean(data.available),
      })
      .commit();

    return NextResponse.json(updatedFood);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        error: "Update failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id; // Ensure correct param extraction

  try {
    await client.delete(id);
    return NextResponse.json({ message: "Food item deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete food item" }, { status: 500 });
  }
}
