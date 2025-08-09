"use client";
import Blip from "./Blip";
import LandingCards from "./LandingCards";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Single-screen hero (no scroll) */}
      <section className="min-h-[calc(100dvh-110px)] flex flex-col items-center justify-center text-center overflow-hidden px-2">
        {/* Logo row: H, text, blip as full stop */}
        <div className="flex items-end align-baseline justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <img src="/logo-h.svg" className="w-12 h-12 sm:w-16 sm:h-16" alt="H" />
            <h1 className="text-4xl sm:text-6xl font-bold lowercase tracking-wide leading-tight">hackerhinge</h1>
          </div>
          <span className="mb-[9px] ml-0.3"><Blip size={10} /></span>
        </div>
        <p className="text-white/85 mt-2 text-base sm:text-xl leading-snug max-w-[92vw] sm:max-w-3xl">
          The minimalist way to explore Hacker News jobs — YC startups, Who’s Hiring and HN Jobs — with fast swipes and
          smart summaries.
        </p>

        {/* Auto-swiping info cards that look like real cards */}
        <LandingCards />

        <div className="mt-4 sm:mt-6">
          <Link href="/signin" className="inline-block rounded-md px-4 py-2 sm:px-6 sm:py-3 bg-[var(--accent)] text-black text-sm sm:text-base font-semibold">
            get started
          </Link>
        </div>
      </section>
    </div>
  );
}


