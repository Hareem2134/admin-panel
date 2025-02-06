import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/orders(.*)",
  "/products(.*)",
  "/discounts(.*)",
]);

export default clerkMiddleware((auth, req) => {
  return auth().handleAuth(req, {
    authorizedParties: ['https://admin-restaurant-ecommerce-website.vercel.app']
  });
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};