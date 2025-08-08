import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ favorites: [] });
  const favorites = await prisma.favoriteJob.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: "desc" },
  });
  return NextResponse.json({ favorites });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { jobId, title, url } = await req.json();
  if (!jobId || !title) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const fav = await prisma.favoriteJob.upsert({
    where: { userId_jobId: { userId: session.user.id, jobId } },
    update: { title, url },
    create: { userId: session.user.id, jobId, title, url },
  });
  return NextResponse.json({ favorite: fav });
}


