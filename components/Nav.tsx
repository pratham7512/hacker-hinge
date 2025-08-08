"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Nav() {
  const { data: session, status } = useSession();
  return (
    <nav className="w-full flex items-center justify-between p-4 border-b border-white/10">
      <Link href="/" className="font-semibold">Hacker Hinge</Link>
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-sm opacity-80 hover:opacity-100">Dashboard</Link>
        {status === "authenticated" ? (
          <button onClick={() => signOut()} className="text-sm rounded-md px-3 py-1 bg-white text-black">
            Sign out
          </button>
        ) : (
          <button onClick={() => signIn("google")} className="text-sm rounded-md px-3 py-1 bg-white text-black">
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}


