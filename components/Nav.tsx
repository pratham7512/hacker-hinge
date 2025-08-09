"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { AnimatedBackground } from "@/components/motion-primitives/animated-background";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";

export default function Nav() {
  const { status, data } = useSession();
  const pathname = usePathname();
  const onDashboard = pathname?.startsWith("/dashboard");
  const isLanding = pathname === "/" && status !== "authenticated";
  return (
    <>
      {/* Top bar visible on all screens, simplified for mobile */}
      <nav className="w-full flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--card-border)" }}>
          <Link href="/" className="font-semibold flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-h.svg" alt="H" className="w-7 h-7" />
          <span className="hidden sm:inline lowercase tracking-wide" style={{ opacity: 0.9 }}>hackerhinge</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {status === "authenticated" ? (
            <div className="flex items-center gap-2">
              {data?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.user.image} alt={data.user.name || "profile"} className="w-8 h-8 rounded-full border" style={{ borderColor: "var(--card-border)" }} />
              ) : null}
              <button onClick={() => signOut()} className="text-sm rounded-md px-3 py-1.5 border bg-transparent hover:opacity-80" style={{ borderColor: "var(--card-border)" }}>
                Sign out
              </button>
            </div>
          ) : (
            <button onClick={() => signIn()} className="text-base rounded-md px-4 py-2 border bg-white text-black hover:opacity-90">
              Sign in
            </button>
          )}
        </div>
      </nav>
      {/* Bottom menu - two options with pill highlight, compact height */}
      {!isLanding ? (
        <div className="fixed bottom-0 left-0 right-0 border-t z-50 bg-black/90 backdrop-blur" style={{ borderColor: "var(--card-border)" }}>
          <div className="max-w-xl mx-auto flex items-center justify-center py-2">
            <AnimatedBackground className="rounded-xl bg-white/10" defaultValue={onDashboard ? "dashboard" : "cards"} enableHover>
              <Link data-id="cards" href="/" className="px-4 py-2 text-sm sm:text-base rounded-xl text-white/85" aria-label="Cards">
                Cards
              </Link>
              <Link data-id="dashboard" href="/dashboard" className="px-4 py-2 text-sm sm:text-base rounded-xl text-white/85" aria-label="Dashboard">
                Dashboard
              </Link>
            </AnimatedBackground>
          </div>
        </div>
      ) : null}
    </>
  );
}


