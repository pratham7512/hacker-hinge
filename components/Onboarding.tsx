"use client";
import { useEffect, useState } from "react";

export default function Onboarding() {
  const [seen, setSeen] = useState(true);
  useEffect(() => {
    const k = "hh_onboarding_v1";
    if (!localStorage.getItem(k)) {
      setSeen(false);
      localStorage.setItem(k, "1");
    }
  }, []);
  if (seen) return null;
  return (
    <div className="fixed inset-0 z-[9998] bg-black/70 flex items-center justify-center p-6">
      <div className="bg-[#0c0c0c] border border-white/10 rounded-xl p-5 max-w-sm w-full text-center">
        <div className="text-xl mb-2">Quick tips</div>
        <p className="text-white/80 text-sm mb-4">Swipe right to save, left to skip. Use arrow keys on desktop.</p>
        <button onClick={() => setSeen(true)} className="rounded-md px-4 py-2 bg-white text-black w-full">Got it</button>
      </div>
    </div>
  );
}


