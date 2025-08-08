"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-6 w-full max-w-sm text-center">
        <h1 className="text-lg mb-4">Sign in</h1>
        <button onClick={() => signIn("google")} className="rounded-md px-4 py-2 bg-white text-black w-full">
          Continue with Google
        </button>
      </div>
    </div>
  );
}


