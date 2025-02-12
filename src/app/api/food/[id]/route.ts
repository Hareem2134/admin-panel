import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const updatedFood = await client.patch(params.id).set(data).commit();

    return NextResponse.json(updatedFood, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update food item" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await client.delete(params.id);
    return NextResponse.json({ message: "Food item deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete food item" }, { status: 500 });
  }
}
