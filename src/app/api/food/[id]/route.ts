import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function PUT(req: Request, context: { params: { id: string } }) {
  const { params } = context; // Extract params correctly
  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const data = JSON.parse(formData.get('data') as string);

    // Update the image handling to:
    // Handle images properly
    const existingImages = Array.isArray(data.images) ? data.images : [];
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const uploaded = await client.assets.upload("image", file);
        return { _type: "image", asset: { _ref: uploaded._id } };
      })
    );

    // Convert tags to array safely
    const tags = typeof data.tags === 'string' ? 
                data.tags.split(",").map((t: string) => t.trim()) : 
                Array.isArray(data.tags) ? data.tags : [];

    // Validate tags format
    if (!Array.isArray(data.tags)) {
      return NextResponse.json(
        { error: "Invalid tags format" },
        { status: 400 }
      );
    }

    // Upload new images
    // const uploadedImages = await Promise.all(
    //   files.map(async (file) => {
    //     const uploaded = await client.assets.upload("image", file);
    //     return { _type: "image", asset: { _ref: uploaded._id } };
    //   })
    // );

    // Update document
    const updatedFood = await client.patch(params.id)
      .set({
        ...data,
        tags, // Use converted tags
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
      { error: "Update failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await client.delete(params.id);
    return NextResponse.json(
      { message: "Food item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete food item" },
      { status: 500 }
    );
  }
}
