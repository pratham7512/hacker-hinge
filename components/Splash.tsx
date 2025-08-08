"use client";
import { useEffect, useState } from "react";

export default function Splash() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1400);
    return () => clearTimeout(t);
  }, []);
  if (done) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="relative">
        <div className="text-2xl md:text-3xl font-mono tracking-[0.2em] animate-fade">
          <span className="opacity-90">Hacker Hinge</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl md:text-5xl font-mono tracking-[0.3em] animate-zoom opacity-0">HH</div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeOut { 0%{opacity:1} 100%{opacity:0} }
        @keyframes zoomIn { 0%{ transform:scale(0.8); opacity:0 } 100%{ transform:scale(1); opacity:1 } }
        .animate-fade { animation: fadeOut 1s ease-in forwards 0.6s; }
        .animate-zoom { animation: zoomIn 0.7s ease-out forwards 0.6s; }
      `}</style>
    </div>
  );
}


