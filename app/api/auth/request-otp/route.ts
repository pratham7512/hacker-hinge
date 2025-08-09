import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import nodemailer from "nodemailer";

const schema = z.object({
  email: z.string().email().max(200),
});

// naive in-memory throttle to avoid abuse (per runtime instance)
const lastSendAtByEmail = new Map<string, number>();

function generateOtp(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return String(n);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    // Throttle: allow a send only every 60s per email
    const now = Date.now();
    const last = lastSendAtByEmail.get(normalizedEmail) ?? 0;
    if (now - last < 60_000) {
      return NextResponse.json({ ok: true });
    }
    lastSendAtByEmail.set(normalizedEmail, now);

    const identifier = `${normalizedEmail}#signup`;
    // cleanup existing tokens for this identifier only
    await prisma.verificationToken.deleteMany({ where: { identifier } });

    const token = generateOtp();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.verificationToken.create({
      data: { identifier, token, expires },
    });

    // Send OTP email using nodemailer
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) {
      // still succeed to avoid blocking signup, but warn in dev
      if (process.env.NODE_ENV !== "production") {
        return NextResponse.json({ ok: true, devCode: token, note: "SMTP not configured" });
      }
      return NextResponse.json({ ok: true });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const from = process.env.MAIL_FROM || `HackerHinge <no-reply@hackerhinge.app>`;
    await transporter.sendMail({
      from,
      to: normalizedEmail,
      subject: `Your HackerHinge verification code`,
      text: `Your verification code is ${token}. It expires in 10 minutes.`,
      html: `<p>Your verification code is <strong style="font-size:18px">${token}</strong>. It expires in 10 minutes.</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


