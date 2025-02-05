import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/orders(.*)",
  "/products(.*)",
  "/discounts(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect admin routes and redirect unauthenticated users to /login
  if (!(await auth()).userId && isProtectedRoute(req)) {
    const loginUrl = new URL("/login", req.url);
    return Response.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};