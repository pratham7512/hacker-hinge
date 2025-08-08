"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";

export default function Nav() {
  const { status } = useSession();
  const pathname = usePathname();
  const onDashboard = pathname?.startsWith("/dashboard");
  const isLanding = pathname === "/" && status !== "authenticated";
  return (
    <>
      {/* Top bar visible on all screens, simplified for mobile */}
      <nav className="w-full flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--card-border)" }}>
        <Link href="/" className="font-semibold flex items-center gap-2">
          <img src="/logo-h.svg" alt="H" className="w-7 h-7" />
          <span className="hidden sm:inline lowercase tracking-wide" style={{ opacity: 0.9 }}>hackerhinge</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href={onDashboard ? "/" : "/dashboard"} className="hidden md:inline text-sm hover:opacity-100" style={{ opacity: 0.8 }}>{onDashboard ? "Cards" : "Dashboard"}</Link>
          {status === "authenticated" ? (
            <button onClick={() => signOut()} className="text-base rounded-md px-4 py-2 border bg-transparent hover:opacity-80" style={{ borderColor: "var(--card-border)" }}>
              Sign out
            </button>
          ) : (
            <button onClick={() => signIn()} className="text-base rounded-md px-4 py-2 border bg-transparent hover:opacity-80" style={{ borderColor: "var(--card-border)" }}>
              Sign in
            </button>
          )}
        </div>
      </nav>
      {/* Bottom menu for mobile only */}
      {!isLanding ? (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-black/85 backdrop-blur supports-[backdrop-filter]:bg-black/65 sm:hidden" style={{ borderColor: "var(--card-border)" }}>
          <div className="max-w-md mx-auto flex items-center justify-around py-3">
            <Link href="/" className="px-8 py-3 text-base" aria-label="Cards">
              <img src="/icons/cards.svg" alt="cards" className={`w-7 h-7 ${onDashboard ? 'opacity-60' : 'opacity-100'}`} />
            </Link>
            <Link href="/dashboard" className="px-8 py-3 text-base" aria-label="Dashboard">
              <img src="/icons/home.svg" alt="dashboard" className={`w-7 h-7 ${onDashboard ? 'opacity-100' : 'opacity-60'}`} />
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}


