"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Nav from "@/components/Nav";
import JobCard from "@/components/JobCard";
import Landing from "../components/Landing";
import Blip from "@/components/Blip";

type Job = { id: string; title: string; url?: string; domain?: string; logo?: string; description?: string; role?: string; tags?: string[] };
type Enriched = { description?: string; role?: string; tags?: string[]; company?: string; location?: string; compensation?: string; apply_url?: string };

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [index, setIndex] = useState(0);
  const current = jobs[index];
  const [loading, setLoading] = useState(true);
  const [enrichCache, setEnrichCache] = useState<Record<string, Enriched>>({});
  const { status } = useSession();

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  // Sequential enrichment: current and next only
  useEffect(() => {
    const toEnrich = [jobs[index], jobs[index + 1]].filter(Boolean) as Job[];
    let cancelled = false;
    (async () => {
      for (const j of toEnrich) {
        if (cancelled) break;
        if (enrichCache[j.id]) continue;
        try {
          const r = await fetch("/api/enrich", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ title: j.title, url: j.url, domain: j.domain, description: j.description }),
          });
          const data = await r.json();
          if (data?.ok && data?.data && !cancelled) {
            setEnrichCache((prev) => ({ ...prev, [j.id]: data.data as Enriched }));
          }
        } catch {}
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [index, jobs]);

  async function handleSwipe(dir: "left" | "right", job: Job) {
    if (dir === "right") {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobId: job.id, title: job.title, url: job.url }),
      });
    }
    setIndex((i) => Math.min(i + 1, jobs.length));
  }

  // Arrow key support for desktop
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current) return;
      if (e.key === "ArrowLeft") handleSwipe("left", current);
      if (e.key === "ArrowRight") handleSwipe("right", current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  return (
    <div className="min-h-dvh flex flex-col items-center">
      <Nav />
      <main className="flex-1 w-full flex flex-col items-center justify-center gap-6 p-6 pb-24 text-lg">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="text-base text-white/80 flex items-center gap-2">
              <Blip size={12} />
              <span>fetching jobs</span>
              <span className="type-ellipses" aria-hidden>...</span>
            </div>
            <style jsx>{`
              @keyframes dots { 0%{content:""} 33%{content:"."} 66%{content:".."} 100%{content:"..."} }
              .type-ellipses::after { content: ""; animation: dots 1.2s steps(3,end) infinite; }
              .type-ellipses { width: 1ch; display: inline-block; text-align: left }
            `}</style>
          </div>
        ) : status !== "authenticated" ? (
          <Landing />
        ) : current ? (
          <div className="relative h-[70vh] w-full">
            {jobs.slice(index, index + 3).map((job, i) => {
              const enriched = enrichCache[job.id];
              const merged = {
                ...job,
                // show description only when enriched is ready to avoid flicker
                description: enriched?.description,
                role: enriched?.role ?? job.role,
                tags: enriched?.tags ?? job.tags,
              };
              return (
                <JobCard key={job.id} job={merged} indexInStack={i} isTop={i === 0} onSwipe={handleSwipe} />
              );
            })}
          </div>
        ) : (
          <div className="text-base text-white/60">No more jobs. Check back later.</div>
        )}
        {/* onboarding removed by request */}
      </main>
    </div>
  );
}
