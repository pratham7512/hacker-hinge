"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

type Job = { id: string; title: string; url?: string; domain?: string; logo?: string };

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
      if (latest > 160) {
        setIsDragging(false);
        animate(x, 400, { duration: 0.25 });
        onSwipe("right", job);
      } else if (latest < -160) {
        setIsDragging(false);
        animate(x, -400, { duration: 0.25 });
        onSwipe("left", job);
      }
    });
    return () => unsubscribe();
  }, [isDragging, job, onSwipe, x, isTop]);

  return (
    <motion.div
      className="w-[92vw] max-w-sm bg-[#0c0c0c] border border-white/10 rounded-xl p-5 shadow-xl absolute left-1/2 -translate-x-1/2"
      style={{
        x: isTop ? x : undefined,
        rotate: isTop ? rotate : undefined,
        opacity: isTop ? opacity : 0.9,
        y: stackStyle.translateY,
        scale: stackStyle.scale,
        zIndex: stackStyle.zIndex,
        pointerEvents: isTop ? "auto" : "none",
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => isTop && setIsDragging(true)}
      onDragEnd={(_, info) => {
        if (!isTop) return;
        setIsDragging(false);
        if (Math.abs(info.offset.x) < 160) animate(x, 0, { duration: 0.2 });
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={job.logo || "/globe.svg"}
            alt="logo"
            className="w-6 h-6"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-base leading-6 line-clamp-3">{job.title}</div>
          <div className="text-xs text-white/50 truncate">{job.domain || "news.ycombinator.com"}</div>
        </div>
      </div>
      {job.url ? (
        <a href={job.url} target="_blank" className="inline-block mt-3 text-sm text-white/80 underline">
          View source
        </a>
      ) : null}
      {isTop ? (
        <div className="mt-4 text-xs text-white/40">Swipe right to save, left to skip</div>
      ) : null}
    </motion.div>
  );
}


