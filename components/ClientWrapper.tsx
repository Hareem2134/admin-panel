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
  
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
  
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email || !ADMIN_EMAILS.includes(email)) {
      alert("❌ Unauthorized: Only admin users can log in.");
      router.push("/login");
      return;
    }
  
    // Remove the redirect here
    setLoading(false);
  }, [isSignedIn, user, router, isLoaded]);
  
  // Conditionally redirect outside of useEffect
  if (isSignedIn && !loading) {
    router.push("/"); // 🔥 Redirects admin users after login
  }
  
  return <>{children}</>;
}
