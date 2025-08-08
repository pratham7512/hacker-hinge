"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

type InfoCard = { id: string; title: string; description?: string; domain?: string; logo?: string; tags?: string[] };

const CONTENT: InfoCard[] = [
  {
    id: "c1",
    title: "YC startups, HN Jobs,— all in one place",
    description: "Curated roles from the best sources on Hacker News.",
    domain: "news.ycombinator.com",
    tags: ["yc", "who’s hiring", "hn jobs"],
  },
  {
    id: "c2",
    title: "Fast swipes. Right to save, left to skip.",
    description: "Minimal UI designed for focus and flow.",
    domain: "hackerhinge.app",
    tags: ["minimal", "keyboard", "mobile"],
  },
  {
    id: "c3",
    title: "Concise summaries help you decide faster",
    description: "2–3 line descriptions and helpful tags.",
    domain: "hackerhinge.app",
    tags: ["summaries", "tags"],
  },
];

export default function LandingCards() {
  const [index, setIndex] = useState(0);
  const current = CONTENT[index % CONTENT.length];
  const next = CONTENT[(index + 1) % CONTENT.length];

  function advance() {
    setIndex((i) => i + 1);
  }

  return (
    <div className="relative mt-3 w-full max-w-sm h-[32vh] sm:h-[38vh] mx-auto overflow-visible">
      <AutoCard key={next.id} card={next} isTop={false} indexInStack={1} />
      <AutoCard key={current.id} card={current} isTop indexInStack={0} onDone={advance} />
    </div>
  );
}

function AutoCard({ card, isTop, indexInStack, onDone }: { card: InfoCard; isTop: boolean; indexInStack: number; onDone?: () => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-10, 0, 10]);
  const opacity = useTransform(x, [-150, 0, 150], [0.2, 1, 0.2]);

  useEffect(() => {
    if (!isTop) return;
    const controls = animate(x, 460, {
      type: "spring",
      bounce: 0,
      stiffness: 140,
      damping: 22,
      delay: 1.1,
      onComplete: () => onDone && onDone(),
    });
    return () => controls.stop();
  }, [isTop, x]);

  const translateY = indexInStack * 6;
  const scale = 1 - indexInStack * 0.025;
  const zIndex = 100 - indexInStack;

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 w-full max-w-sm h-full bg-[var(--card-bg)] border rounded-2xl p-4 sm:p-5 shadow-xl overflow-hidden"
      style={{ x, rotate, opacity, y: translateY, scale, zIndex, borderColor: "var(--card-border)", willChange: "transform" }}
    >
      <div className="pointer-events-none absolute inset-0 shine" />
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[16px] sm:text-[18px] md:text-xl leading-6 line-clamp-2">{card.title}</div>
          <div className="text-[11px] sm:text-xs md:text-sm opacity-60 truncate">{card.domain}</div>
        </div>
      </div>
      <div className="mt-2 sm:mt-3 flex flex-col h-[calc(100%-64px)]">
        {card.description ? (
          <p className="text-[13px] sm:text-[15px] md:text-base opacity-80 line-clamp-6 text-left">
            {card.description} With Hacker Hinge you also get keyboard controls on desktop, lightweight UI, and a
            personal favorites board.
          </p>
        ) : null}
        {Array.isArray(card.tags) && card.tags.length ? (
          <div className="mt-auto pt-2 sm:pt-3 flex flex-wrap gap-2">
            {card.tags.map((t) => (
              <span key={t} className="text-[11px] sm:text-xs md:text-sm px-2 py-0.5 rounded-full border" style={{ background: "var(--chip-bg)", borderColor: "var(--chip-border)" }}>
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}


