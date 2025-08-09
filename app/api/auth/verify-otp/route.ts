import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { hash } from "bcryptjs";

const schema = z.object({
  email: z.string().email().max(200),
  code: z.string().length(6),
  password: z.string().min(8).max(200).optional(),
});

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { email, code, password } = schema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    const vt = await prisma.verificationToken.findFirst({
      where: { identifier: `${normalizedEmail}#signup`, token: code },
    });
    if (!vt || vt.expires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    // Upsert user and mark email verified
    const passwordHash = password ? await hash(password, 10) : undefined;
    await prisma.user.upsert({
      where: { email: normalizedEmail },
      update: { emailVerified: new Date(), ...(passwordHash ? { passwordHash } : {}) },
      create: { email: normalizedEmail, emailVerified: new Date(), ...(passwordHash ? { passwordHash } : {}) },
    });

    // Delete token after use
    await prisma.verificationToken.deleteMany({ where: { identifier: `${normalizedEmail}#signup` } });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


