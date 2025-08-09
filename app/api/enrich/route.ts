import { NextResponse } from "next/server";

// Accepts: { title: string, url?: string, domain?: string, description?: string }
// Returns: { ok: true, data: { description?: string; role?: string; tags?: string[]; [k: string]: unknown } }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, url, domain, description } = body as {
      title: string;
      url?: string;
      domain?: string;
      description?: string;
    };
    if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Missing PERPLEXITY_API_KEY" }, { status: 500 });

    const prompt = `Return concise JSON following the provided schema only.\nGuidelines:\n- description: 2-3 lines summarizing the job and what type of role it is\n- role: clear role title (e.g., Senior Frontend Engineer)\n- tags: 3-8 short tags like tech stack, seniority, remote/on-site\n- company: short company name if available\n- location: short\n- compensation: short if explicitly mentioned\n- apply_url: use the provided URL if it's an apply page, otherwise omit\nUse only provided info; do not fabricate.\nTitle: ${title}\nDomain: ${domain ?? ""}\nURL: ${url ?? ""}\nContent: ${description ?? ""}`;

    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          { role: "system", content: "You are a helpful assistant that returns concise JSON only." },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.2,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "job_enrichment",
            schema: {
              type: "object",
              properties: {
                description: { type: "string" },
                role: { type: "string" },
                tags: { type: "array", items: { type: "string" } },
                company: { type: "string" },
                location: { type: "string" },
                compensation: { type: "string" },
                apply_url: { type: "string" }
              },
              required: ["description"],
              additionalProperties: true
            }
          }
        }
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json({ error: `Perplexity error: ${res.status} ${txt}` }, { status: 502 });
    }

    const data = await res.json();
    // Try to read structured output directly from message content
    const content = data?.choices?.[0]?.message?.content ?? "";
    let parsed: unknown = {};
    if (content && typeof content === "string") {
      try {
        parsed = JSON.parse(content);
      } catch {
        parsed = { description: content };
      }
    } else if (data?.choices?.[0]?.message?.parsed) {
      parsed = data.choices[0].message.parsed;
    }

    return NextResponse.json({ ok: true, data: parsed });
  } catch {
    return NextResponse.json({ error: "Failed to enrich" }, { status: 500 });
  }
}


