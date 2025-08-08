"use client";
import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import JobCard from "@/components/JobCard";

type Job = { id: string; title: string; url?: string };

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [index, setIndex] = useState(0);
  const current = jobs[index];

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs ?? []))
      .catch(() => setJobs([]));
  }, []);

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

  return (
    <div className="min-h-dvh flex flex-col items-center">
      <Nav />
      <main className="flex-1 w-full flex flex-col items-center justify-center gap-6 p-6">
        {current ? (
          <JobCard job={current} onSwipe={handleSwipe} />
        ) : (
          <div className="text-sm text-white/60">No more jobs. Check back later.</div>
        )}
      </main>
    </div>
  );
}
