import { NextResponse } from "next/server";
import { client } from "../../../sanity/lib/client";

export async function POST(req: Request) {
  try {
    const products = await req.json();

    // Validate required fields
    if (!Array.isArray(products)) {
        return NextResponse.json(
        { error: "Invalid request body: expected an array of products" },
        { status: 400 }
        );
    }      

    const transactions = products.map((product: any) => ({
      create: {
        _type: "product",
        name: product.name,
        price: product.price,
        tags: product.tags,
        category: product.category,
        description: product.description,
        longDescription: product.longDescription,
        stock: product.stock
      },
    }));

    const result = await client.transaction(transactions).commit();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Sanity error:", error);
    return NextResponse.json(
      { 
        error: error.message,
        details: error.details 
      },
      { status: 500 }
    );
  }
}