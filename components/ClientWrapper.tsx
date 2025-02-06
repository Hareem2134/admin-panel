"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Hardcoded admin emails
const ADMIN_EMAILS = ["admin@example.com", "hareemfarooqi2134@gmail.com"];

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setAuthChecked(true); // Allow login page to render
      return;
    }

    // Wait for user email to load
    const email = user?.emailAddresses?.[0]?.emailAddress || "";
    if (!email) return;

    // If not an admin, redirect to login
    if (!ADMIN_EMAILS.includes(email)) {
      alert("❌ Unauthorized: Only admin users can log in.");
      router.replace("/login"); // Use replace() to avoid back button issues
      return;
    }

    // If already on the correct page, avoid redirect loops
    if (window.location.pathname === "/") {
      setAuthChecked(true);
      return;
    }

    // Redirect admin users only if necessary
    router.replace("/");

    setAuthChecked(true);
  }, [isSignedIn, user, isLoaded, router]);

  if (!isLoaded || !authChecked) {
    return <div className="text-center p-6">🔄 Checking authentication...</div>;
  }

  return <>{children}</>;
}
