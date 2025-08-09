import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().max(200),
});

function generateOtp(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return String(n);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    // cleanup existing tokens for this identifier
    await prisma.verificationToken.deleteMany({ where: { identifier: normalizedEmail } });

    const token = generateOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.verificationToken.create({
      data: { identifier: normalizedEmail, token, expires },
    });

    // NOTE: integrate your email provider here to send `token` to the user.
    // For development convenience, return the token only in non-production envs.
    const devCode = process.env.NODE_ENV !== "production" ? token : undefined;

    return NextResponse.json({ ok: true, devCode });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


