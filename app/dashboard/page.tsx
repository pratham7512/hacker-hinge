import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import FavoriteRow from "./row";
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
      <main className="p-6 pb-28 max-w-2xl w-full mx-auto">
        <h1 className="text-xl mb-4">Your favorites</h1>
        {favorites.length === 0 ? (
          <p className="text-white/60">No favorites yet. Swipe right on jobs to save.</p>
        ) : (
          <ul className="space-y-3">
            {favorites.map((f: { id: string; title: string; url: string | null; jobId?: string }) => (
              <FavoriteRow key={f.id} item={f} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}


