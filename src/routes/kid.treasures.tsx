import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Sparkles } from "lucide-react";
import { Badge, Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { badges } from "@/data/curriculum";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/kid/treasures")({
  head: () => ({
    meta: [
      { title: "Achievements & Badges. RootBridge" },
      {
        name: "description",
        content:
          "Every badge, story card and decoration you have earned. Nothing is random, nothing expires.",
      },
      { property: "og:title", content: "Treasures. Nepali Kids" },
      { property: "og:description", content: "The child's collection of earned rewards." },
    ],
  }),
  component: Treasures,
});

function Treasures() {
  const { state } = useProgress();
  const earnedIds = new Set(state.badges);
  state.masteredModules.forEach((_, index) => badges[index] && earnedIds.add(badges[index]!.id));

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold">Achievements &amp; Badges</h1>
        <p className="mt-2 text-ink-soft">
          Every badge names something you learned, created, or kept trying. Badges are never random or for sale.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b, i) => {
            const earned = earnedIds.has(b.id);
            return (
              <Link key={b.id} to="/kid/reward/$rewardId" params={{ rewardId: b.id }}>
                <Card
                  accent={earned ? "sun" : "none"}
                  bold={earned}
                  className="h-full p-5 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={
                        "grid h-11 w-11 shrink-0 place-items-center rounded-xl " +
                        (earned ? "bg-sun-soft text-sun" : "bg-canvas text-ink-soft")
                      }
                    >
                      {earned ? <Sparkles size={20} /> : <Lock size={18} />}
                    </span>
                    <Badge tone={earned ? "sun" : "neutral"}>{b.type}</Badge>
                  </div>
                  <h2 className="mt-3 font-display text-lg font-extrabold">{b.title}</h2>
                  <p className="mt-1 text-sm text-ink-soft">{b.rule}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
