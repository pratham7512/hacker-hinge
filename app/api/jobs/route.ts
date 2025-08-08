import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export const revalidate = 3600; // cache for 1 hour

async function fetchHackerNewsJobs(): Promise<{
  id: string;
  title: string;
  url?: string;
}[]> {
  const res = await fetch("https://news.ycombinator.com/jobs", {
    headers: { "user-agent": "hacker-hinge/1.0" },
    cache: "no-store",
  });
  const html = await res.text();
  // Lightweight parse without external deps: use DOMParser via jsdom
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const rows = Array.from(doc.querySelectorAll("tr.athing"));
  const jobs = rows.map((row) => {
    const id = row.getAttribute("id") || crypto.randomUUID();
    const titleLink = row.querySelector("span.titleline a") as HTMLAnchorElement | null;
    const title = titleLink?.textContent?.trim() || "Untitled";
    const url = titleLink?.getAttribute("href") || undefined;
    return { id, title, url };
  });
  return jobs;
}

export async function GET() {
  try {
    const jobs = await fetchHackerNewsJobs();
    return NextResponse.json({ jobs });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}


