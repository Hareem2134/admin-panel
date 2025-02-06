"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "../utils/isAdmin";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!isLoaded) return;
      
      if (!isSignedIn) {
        router.push("/login");
        return;
      }

      try {
        const email = user?.emailAddresses[0]?.emailAddress;
        if (await isAdmin(email)) {
          setLoading(false);
        } else {
          alert("Unauthorized access");
          router.push("/");
        }
      } catch (error) {
        console.error("Authorization error:", error);
        router.push("/error");
      }
    }

    checkAdmin();
  }, [isSignedIn, user, router, isLoaded]);

  if (!isLoaded || loading) {
    return <div>Loading authorization...</div>;
  }

  return <>{children}</>;
}