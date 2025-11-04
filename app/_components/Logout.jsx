"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton, useAuth } from "@clerk/nextjs";

export default function LogoutPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;     // wait until auth info is ready
    if (!isSignedIn) {
      // if already signed out, redirect immediately
      router.replace("/");     // or choose a different redirect
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div>Loading…</div>;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl mb-4">Are you sure you want to sign out?</h2>
      <SignOutButton
        afterSignOutUrl="/"        // redirect user after logout
      >
        <button className="px-4 py-2 bg-red-500 text-white rounded">
          Sign Out
        </button>
      </SignOutButton>
    </div>
  );
}
