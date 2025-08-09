import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { hash } from "bcryptjs";

const schema = z.object({
  email: z.string().email().max(200),
  code: z.string().length(6),
  newPassword: z.string().min(8).max(200),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, newPassword } = schema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    const vt = await prisma.verificationToken.findFirst({
      where: { identifier: `${normalizedEmail}#reset`, token: code },
    });
    if (!vt || vt.expires < new Date()) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    const passwordHash = await hash(newPassword, 10);
    await prisma.user.update({ where: { email: normalizedEmail }, data: { passwordHash } });
    await prisma.verificationToken.deleteMany({ where: { identifier: `${normalizedEmail}#reset` } });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


