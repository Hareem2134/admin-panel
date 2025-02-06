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
    if (!isLoaded) return;

    // Skip authentication checks for the sign-in page
    if (pathname === "/sign-in") {
      setLoading(false);
      return;
    }

    // Redirect to sign-in if the user is not signed in
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    setLoading(false);
  }, [isSignedIn, router, isLoaded, pathname]);

  if (!isLoaded || loading) {
    return <div className="text-center p-6">🔄 Loading authorization...</div>;
  }

  return <>{children}</>;
}