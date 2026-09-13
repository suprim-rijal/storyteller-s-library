import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { badges } from "@/data/curriculum";

export const Route = createFileRoute("/kid/reward/$rewardId")({
  head: ({ params }) => {
    const b = badges.find((x) => x.id === params.rewardId);
    const title = b ? `${b.title} unlocked` : "Reward";
    return {
      meta: [
        { title: `${title}. Nepali Kids` },
        {
          name: "description",
          content:
            "Rewards are earned by named effort, never random and never for sale, and they never expire.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: b?.rule ?? "A Nepali Kids reward." },
      ],
    };
  },
  component: Reward,
});

function Reward() {
  const { rewardId } = Route.useParams();
  const badge = badges.find((b) => b.id === rewardId);
  if (!badge) throw notFound();

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Card accent="sun" bold className="bg-sun-soft p-8 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-surface text-sun">
            <Gift size={34} />
          </span>
          <Badge tone="sun" className="mt-4">
            {badge.type}
          </Badge>
          <h1 className="mt-3 font-display text-3xl font-extrabold">{badge.title}</h1>
          <p className="mt-3 text-ink-soft">{badge.rule}</p>
          <p className="mt-4 text-sm text-ink-soft">
            You earned this by what you did. not by luck, not by speed, and not by spending
            anything. It stays yours forever.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/kid/treasures">
              <Button variant="sun">Put it in my Treasures →</Button>
            </Link>
            <Link to="/kid/home">
              <Button variant="outline">Back to my journey</Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
