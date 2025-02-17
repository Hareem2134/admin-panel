import { NextResponse } from "next/server";
import { client } from "../../../sanity/lib/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (code) {
      const discounts = await client.fetch(`*[_type == "discount" && code == $code]`, { code });
      if (!discounts.length || !discounts[0].active) {
        return NextResponse.json({ error: "Invalid or inactive discount" }, { status: 404 });
      }
      return NextResponse.json(discounts[0], { status: 200 });
    } else {
      const discounts = await client.fetch(`*[_type == "discount"]`);
      return NextResponse.json(discounts);
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch discount" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { code, type, value, active, expiry } = await req.json();

    if (!code || !type || value === undefined || !expiry) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const discount = await client.create({
      _type: "discount",
      code,
      type,
      value,
      active: active ?? true,
      expiry,
    });

    // Fetch and return the latest list of discounts after creation
    const updatedDiscounts = await client.fetch(`*[_type == "discount"]`);
    return NextResponse.json(updatedDiscounts, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create discount" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Discount ID is required" }, { status: 400 });
    }

    // Delete the discount from Sanity
    await client.delete(id);

    // Fetch and return the updated list of discounts
    const updatedDiscounts = await client.fetch(`*[_type == "discount"]`);
    return NextResponse.json(updatedDiscounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete discount" }, { status: 500 });
  }
}