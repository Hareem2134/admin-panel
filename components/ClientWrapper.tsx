"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Hardcoded admin emails
const ADMIN_EMAILS = ["admin@example.com", "hareemfarooqi2134@gmail.com"];

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    // If user is not signed in, redirect to login page
    if (!isSignedIn) {
      router.push("/login");
      return;
    }

    // Check if user email is in the allowed list
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email || !ADMIN_EMAILS.includes(email)) {
      alert("❌ Unauthorized access.");
      router.push("/");
      return;
    }

    // ✅ Set loading to false once user is authorized
    setLoading(false);
  }, [isSignedIn, user, router, isLoaded]);

  if (!isLoaded || loading) {
    return <div className="text-center p-6">🔄 Loading authorization...</div>;
  }

  return <>{children}</>;
}
