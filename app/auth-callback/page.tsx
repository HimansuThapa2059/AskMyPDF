"use client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const response = await fetch("/api/auth/callback");
        if (!response.ok) {
          if (response.status === 401) {
            router.replace("/api/auth/login");
          } else {
            throw new Error("Server error");
          }
        } else {
          router.push(origin ? `/${origin}` : "/dashboard");
        }
      } catch (err) {
        console.error("Error during callback:", err);
        router.replace("/api/auth/login");
      }
    };
    handleAuthCallback();
  }, [origin, router]);

  return (
    <div className="mt-24 flex w-full justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="text-xl font-semibold">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
