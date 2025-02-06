"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    // Skip authentication checks for the sign-in and sign-up pages
    if (pathname === "/sign-in" || pathname === "/sign-up") {
      setLoading(false);
      return;
    }

    // Redirect to sign-in if the user is not signed in
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    // If the user is signed in, allow access to the page
    setLoading(false);
  }, [isSignedIn, isLoaded, pathname, router]);

  if (!isLoaded || loading) {
    return <div className="text-center p-6">🔄 Loading authorization...</div>;
  }

  return <>{children}</>;
}