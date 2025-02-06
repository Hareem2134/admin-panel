import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

export default clerkMiddleware();

// ✅ Apply middleware only on protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/discounts/:path*", "/products/:path*", "/orders/:path*"],
};
