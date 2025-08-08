"use client";
import { useMemo } from "react";

export default function Blip({ size = 12 }: { size?: number }) {
  const s = `${size}px`;
  // Randomize duration/delay for an organic on/off blink
  const { duration, delay } = useMemo(() => {
    const d = (Math.random() * 0.6 + 0.4).toFixed(2); // 0.4s - 1.0s
    const dl = (Math.random() * 0.5).toFixed(2); // 0 - 0.5s
    return { duration: `${d}s`, delay: `${dl}s` };
  }, []);

  return (
    <span className="inline-flex items-center align-middle" style={{ lineHeight: 0 }}>
      <span
        aria-hidden
        style={{ width: s, height: s, animationDuration: duration, animationDelay: delay }}
        className="inline-block rounded-full bg-[var(--accent)] blip"
      />
      <style jsx>{`
        @keyframes blipOnOff { 0%, 49% { opacity: 0 } 50%, 100% { opacity: 1 } }
        .blip { animation-name: blipOnOff; animation-timing-function: steps(1, end); animation-iteration-count: infinite; }
      `}</style>
    </span>
  );
}


