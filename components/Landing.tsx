"use client";
import Blip from "./Blip";
import LandingCards from "./LandingCards";
import Link from "next/link";

export default function Landing() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-10">
      {/* Single-screen hero (no scroll) */}
      <section className="h-[calc(100dvh-100px)] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Logo row: H, text, blip as full stop */}
        <div className="flex items-end align-baseline justify-center gap-3 mb-4">
          <div className="flex items-center gap-2">
          <img src="/logo-h.svg" className="w-16 h-16" alt="H" />
          <h1 className="text-5xl md:text-6xl font-bold lowercase tracking-wide">hackerhinge</h1>
          </div>
          <span className="mb-[5px] ml-0.2"><Blip size={10} /></span>
        </div>
        <p className="text-white/85 mt-3 text-lg md:text-xl max-w-3xl">
          The minimalist way to explore Hacker News jobs — YC startups, Who’s Hiring and HN Jobs — with fast swipes and
          smart summaries.
        </p>

        {/* Auto-swiping info cards that look like real cards */}
        <LandingCards />

        <div className="mt-6">
          <Link href="/signin" className="inline-block rounded-md px-6 py-3 bg-[var(--accent)] text-black text-base font-semibold">
            get started
          </Link>
        </div>
      </section>
    </div>
  );
}


