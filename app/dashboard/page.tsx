import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import Nav from "@/components/Nav";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const favorites = session?.user?.id
    ? await prisma.favoriteJob.findMany({
        where: { userId: session.user.id },
        orderBy: { addedAt: "desc" },
      })
    : [];

  return (
    <div className="min-h-dvh flex flex-col">
      <Nav />
      <main className="p-6 max-w-2xl w-full mx-auto">
        <h1 className="text-xl mb-4">Your favorites</h1>
        {favorites.length === 0 ? (
          <p className="text-white/60">No favorites yet. Swipe right on jobs to save.</p>
        ) : (
          <ul className="space-y-3">
            {favorites.map((f: { id: string; title: string; url: string | null }) => (
              <li key={f.id} className="bg-[#0c0c0c] border border-white/10 rounded-lg p-4">
                <div className="text-base">{f.title}</div>
                {f.url ? (
                  <Link className="text-sm underline text-white/70" href={f.url} target="_blank">
                    Apply / Source
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}


