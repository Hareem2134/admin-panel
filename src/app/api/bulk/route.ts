import { NextResponse } from "next/server";
import { client } from "../../../sanity/lib/client";

export async function POST(req: Request) {
  try {
    const foods = await req.json();

    // Validate required fields
    if (!Array.isArray(foods)) {
      return NextResponse.json(
        { error: "Expected an array of food items" },
        { status: 400 }
      );
    }

    // Create Sanity transaction
    const transaction = foods.map((food) => ({
      create: {
        _type: "food", // Match the schema name
        name: food.name,
        slug: { _type: "slug", current: food.name.toLowerCase().replace(/\s+/g, "-") }, // Auto-generate slug
        category: food.category,
        price: food.price,
        originalPrice: food.originalPrice || food.price, // Default to price if not provided
        tags: food.tags || [], // Ensure tags is an array
        description: food.description,
        longDescription: food.longDescription,
        available: food.available || true, // Default to true if not provided
      },
    }));

    // Commit the transaction
    const result = await client.transaction(transaction).commit();

    // Log the result for debugging
    console.log("Sanity transaction result:", result);

    return NextResponse.json({
      success: true,
      count: result.results.length,
      results: result.results,
    });
  } catch (error: any) {
    console.error("Sanity error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.details || "Internal server error",
      },
      { status: 500 }
    );
  }
}