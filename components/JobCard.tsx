"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

type Job = { id: string; title: string; url?: string; domain?: string; logo?: string; description?: string; role?: string; tags?: string[] };

export default function JobCard({
  job,
  onSwipe,
  indexInStack = 0,
  isTop = false,
}: {
  job: Job;
  onSwipe?: (dir: "left" | "right", job: Job) => void;
  indexInStack?: number;
  isTop?: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const opacity = useTransform(x, [-150, 0, 150], [0.2, 1, 0.2]);
  const [isDragging, setIsDragging] = useState(false);

  const stackStyle = useMemo(() => {
    const translateY = indexInStack * 10; // px
    const scale = 1 - indexInStack * 0.04;
    const zIndex = 100 - indexInStack;
    return { translateY, scale, zIndex };
  }, [indexInStack]);

  useEffect(() => {
    if (!isTop || !onSwipe) return;
    const unsubscribe = x.on("change", (latest) => {
      if (!isDragging) return;
      if (latest > 120) {
        setIsDragging(false);
        animate(x, 500, { duration: 0.28 });
        onSwipe("right", job);
      } else if (latest < -120) {
        setIsDragging(false);
        animate(x, -500, { duration: 0.28 });
        onSwipe("left", job);
      }
    });
    return () => unsubscribe();
  }, [isDragging, job, onSwipe, x, isTop]);

  return (
    <motion.div
      className="w-[94vw] max-w-md bg-[var(--card-bg)] border rounded-2xl p-5 shadow-xl absolute left-1/2 -translate-x-1/2 overflow-hidden"
      style={{
        x: isTop ? x : undefined,
        rotate: isTop ? rotate : undefined,
        opacity: isTop ? opacity : 0.9,
        y: stackStyle.translateY,
        scale: stackStyle.scale,
        zIndex: stackStyle.zIndex,
        pointerEvents: isTop ? "auto" : "none",
        borderColor: "var(--card-border)",
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      dragMomentum={false}
      onDragStart={() => isTop && setIsDragging(true)}
      onDragEnd={(_, info) => {
        if (!isTop) return;
        setIsDragging(false);
        if (Math.abs(info.offset.x) < 90) animate(x, 0, { duration: 0.2 });
      }}
    >
      <div className="pointer-events-none absolute inset-0 shine" />
      {/* Full-surface color feedback overlay */}
      {isTop && (
        <div className="pointer-events-none absolute inset-0" style={{ background: x.get() > 0 ? "rgba(0,200,120,0.08)" : x.get() < 0 ? "rgba(220,40,60,0.08)" : "transparent" }} />
      )}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md overflow-hidden bg-[var(--chip-bg)] border flex items-center justify-center" style={{ borderColor: "var(--chip-border)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={job.logo || "/globe.svg"}
            alt="logo"
            className="w-6 h-6"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg leading-6 md:text-xl line-clamp-3" style={{ color: "var(--foreground)" }}>{job.title}</div>
          <div className="text-xs md:text-sm truncate" style={{ color: "var(--text-subtle)" }}>{job.domain || "news.ycombinator.com"}</div>
        </div>
      </div>
      {job.role ? (
        <div className="mt-2 inline-flex items-center gap-2 text-sm md:text-base">
          <span className="px-2 py-0.5 rounded border" style={{ background: "var(--chip-bg)", borderColor: "var(--chip-border)" }}>{job.role}</span>
        </div>
      ) : null}
      {job.description ? (
        <p className="mt-2 text-sm md:text-base line-clamp-[10] whitespace-pre-line" style={{ color: "var(--text-muted)" }}>{job.description}</p>
      ) : (
        <div className="mt-4 flex items-center gap-2 text-white/70 text-sm">
          <span className="inline-flex align-middle"><span className="inline-block rounded-full bg-[var(--accent)] blip-s" /></span>
          <span>summarizing</span>
          <span className="type-ellipses" aria-hidden></span>
          <style jsx>{`
            @keyframes blipOnOff { 0%, 49% { opacity: 0 } 50%, 100% { opacity: 1 } }
            .blip-s { width: 8px; height: 8px; animation: blipOnOff .6s steps(1,end) infinite }
            @keyframes dots { 0%{content:""} 33%{content:"."} 66%{content:".."} 100%{content:"..."} }
            .type-ellipses::after { content: ""; animation: dots 1.2s steps(3,end) infinite; }
            .type-ellipses { width: 1ch; display: inline-block; text-align: left }
          `}</style>
        </div>
      )}
      {Array.isArray(job.tags) && job.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.tags.map((t) => (
            <span key={t} className="text-xs md:text-sm px-2 py-0.5 rounded-full border" style={{ background: "var(--chip-bg)", borderColor: "var(--chip-border)" }}>
              {t}
            </span>
          ))}
        </div>
      ) : null}
      {job.url ? (
        <a href={job.url} target="_blank" className="inline-block mt-3 text-sm md:text-base underline" style={{ color: "var(--text-muted)" }}>
          View source
        </a>
      ) : null}
    </motion.div>
  );
}


