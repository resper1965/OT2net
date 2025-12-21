"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { User } from "firebase/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
}
