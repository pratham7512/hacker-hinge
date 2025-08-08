"use client";
import { useEffect } from "react";

export default function DesktopControls({ onLeft, onRight }: { onLeft: () => void; onRight: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onLeft();
      if (e.key === "ArrowRight") onRight();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onLeft, onRight]);
  return (
    <div className="hidden md:flex items-center gap-6 mt-4">
      <button aria-label="Skip" onClick={onLeft} className="w-12 h-12 rounded-full border border-white/20 bg-white/5">←</button>
      <button aria-label="Save" onClick={onRight} className="w-12 h-12 rounded-full border border-white/20 bg-white/5">→</button>
    </div>
  );
}


