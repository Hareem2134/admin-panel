"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { isAdmin } from "../utils/isAdmin";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!isSignedIn) {
        router.push("/");
        return;
      }

      const email = user?.emailAddresses[0]?.emailAddress;
      if (await isAdmin(email)) {
        setLoading(false);
      } else {
        alert("Unauthorized access");
        router.push("/");
      }
    }

    checkAdmin();
  }, [isSignedIn, user, router]);

  if (loading) {
    return <div>Loading authorization...</div>;
  }

  return <>{children}</>;
}