import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/orders(.*)",
  "/products(.*)",
  "/discounts(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Wait for the auth object to resolve
  const authObject = await auth();

  // If the route is protected and the user is not signed in, redirect to sign-in
  if (isProtectedRoute(req) && !authObject.userId) {
    return authObject.redirectToSignIn();
  }

  // Allow request to proceed
  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
