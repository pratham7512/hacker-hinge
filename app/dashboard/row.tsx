"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";

type Fav = { id: string; title: string; url: string | null; jobId?: string };

export default function FavoriteRow({ item }: { item: Fav }) {
  const x = useMotionValue(0);
  const [hover, setHover] = useState(false);
  const [removed, setRemoved] = useState(false);

  async function remove() {
    setRemoved(true);
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: item.id, jobId: item.jobId }),
    });
  }

  return (
    <motion.li
      className="bg-[var(--card-bg)] border rounded-lg overflow-hidden"
      style={{ borderColor: "var(--card-border)", color: "var(--foreground)", opacity: removed ? 0.4 : 1 }}
    >
      <div className="relative">
        {/* Desktop hover delete */}
        <button
          onClick={remove}
          className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-transparent border"
          style={{ borderColor: hover ? "var(--card-border)" : "transparent", opacity: hover ? 1 : 0 }}
        >
          <span className="sr-only">Delete</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/trash.svg" alt="delete" className="w-4 h-4" />
        </button>

        {/* Mobile swipe to delete */}
        <div className="md:hidden absolute inset-0 flex items-center justify-end pr-4 pointer-events-none">
          <span className="text-sm" style={{ color: "var(--text-subtle)" }}>Delete</span>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: -40, right: 0 }}
          style={{ x }}
          onDragEnd={(_, info) => {
            if (info.offset.x <= -35) {
              animate(x, -300, { duration: 0.25 });
              remove();
            } else {
              animate(x, 0, { duration: 0.2 });
            }
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="p-4 pr-16"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="text-base pr-2">{item.title}</div>
            {item.url ? (
              <Link
                className="shrink-0 rounded-md px-3 py-1 text-sm bg-[var(--accent)] text-black hover:opacity-90"
                href={item.url}
                target="_blank"
              >
                Apply
              </Link>
            ) : null}
          </div>
        </motion.div>
      </div>
    </motion.li>
  );
}


