import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export const revalidate = 3600; // cache for 1 hour

async function fetchHackerNewsJobs(): Promise<{
  id: string;
  title: string;
  url?: string;
  domain?: string;
  logo?: string;
  description?: string;
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
  const jobs: { id: string; title: string; url?: string; domain?: string; logo?: string; description?: string }[] = rows.map((row) => {
    const id = row.getAttribute("id") || crypto.randomUUID();
    const titleLink = row.querySelector("span.titleline a") as HTMLAnchorElement | null;
    const title = titleLink?.textContent?.trim() || "Untitled";
    const url = titleLink?.getAttribute("href") || undefined;
    let domain: string | undefined;
    let logo: string | undefined;
    try {
      if (url && /^https?:\/\//i.test(url)) {
        const u = new URL(url);
        domain = u.hostname.replace(/^www\./, "");
        logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
      }
    } catch {}
    return { id, title, url, domain, logo };
  });
  // Attempt to fetch meta descriptions for the first few jobs to enrich cards (best-effort, time-limited)
  const ENRICH_COUNT = 20;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    await Promise.all(
      jobs.slice(0, ENRICH_COUNT).map(async (j, idx) => {
        if (!j.url) return;
        try {
          const res = await fetch(j.url, { signal: controller.signal, headers: { "user-agent": "hacker-hinge/1.0" } });
          const html = await res.text();
          const dom2 = new JSDOM(html);
          const doc2 = dom2.window.document;
          const metaDesc =
            doc2.querySelector('meta[name="description"]')?.getAttribute("content") ||
            doc2.querySelector('meta[property="og:description"]')?.getAttribute("content") ||
            doc2.querySelector('meta[name="twitter:description"]')?.getAttribute("content") ||
            "";
          const mainLike = doc2.querySelector("main, article, .content, .post, .entry") as HTMLElement | null;
          const firstParagraph = (mainLike || doc2).querySelector("p")?.textContent?.trim() || "";
          const combined = (metaDesc + "\n\n" + firstParagraph).trim();
          const textSnippet = combined || "";
          if (textSnippet) {
            jobs[idx].description = textSnippet.substring(0, 500);
          }
        } catch {}
      })
    );
  } catch {}
  clearTimeout(timeout);
  return jobs;
}

export async function GET() {
  try {
    const jobs = await fetchHackerNewsJobs();
    return NextResponse.json({ jobs });
  } catch {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}


