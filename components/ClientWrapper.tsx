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

    // ✅ Allow anyone to see the login page
    if (!isSignedIn) {
      setLoading(false); // ✅ Stop loading, allow login page to be visible
      return;
    }

    // Check if user email is in the allowed list
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email || !ADMIN_EMAILS.includes(email)) {
      alert("❌ Unauthorized: Only admin users can log in.");
      router.push("/");
      return;
    }

    // ✅ Allow admin users
    setLoading(false);
  }, [isSignedIn, user, router, isLoaded]);

  if (!isLoaded || loading) {
    return <div className="text-center p-6">🔄 Loading authorization...</div>;
  }

  return <>{children}</>;
}
