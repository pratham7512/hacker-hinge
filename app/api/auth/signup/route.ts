import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(8).max(200),
});

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);
    await prisma.user.create({
      data: { email: normalizedEmail, passwordHash },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}


