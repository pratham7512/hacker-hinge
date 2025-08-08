"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

type Job = { id: string; title: string; url?: string };

export default function JobCard({ job, onSwipe }: { job: Job; onSwipe: (dir: "left" | "right", job: Job) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const opacity = useTransform(x, [-150, 0, 150], [0.2, 1, 0.2]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
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
  }, [isDragging, job, onSwipe, x]);

  return (
    <motion.div
      className="w-[92vw] max-w-sm bg-[#0c0c0c] border border-white/10 rounded-xl p-5 shadow-xl"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        if (Math.abs(info.offset.x) < 160) animate(x, 0, { duration: 0.2 });
      }}
    >
      <div className="text-base leading-6">{job.title}</div>
      {job.url ? (
        <a href={job.url} target="_blank" className="text-sm text-white/70 underline">
          Source link
        </a>
      ) : null}
      <div className="mt-4 text-xs text-white/40">Swipe right to save, left to skip</div>
    </motion.div>
  );
}


