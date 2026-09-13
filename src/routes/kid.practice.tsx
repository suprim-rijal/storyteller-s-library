import { createFileRoute, Link } from "@tanstack/react-router";
import { SprayCan, Mic, Pencil, Music4 } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { ageBands, reviewIntervals } from "@/data/curriculum";
import { useProgress } from "@/lib/progress";
import gardenBg from "@/assets/illustrations/garden-bg.jpg";

export const Route = createFileRoute("/kid/practice")({
  head: () => ({
    meta: [
      { title: "Practice Garden. Nepali Kids" },
      {
        name: "description",
        content:
          "A stress-free spaced-review space: review seeds, pronunciation studio, tracing and songs. Overdue items are never late.",
      },
      { property: "og:title", content: "Practice Garden. Nepali Kids" },
      {
        property: "og:description",
        content: "Water your skill-seeds and blossom your Nepali vocabulary.",
      },
    ],
  }),
  component: Practice,
});

const soft: Record<string, string> = {
  language: "bg-language-soft text-language",
  culture: "bg-culture-soft text-culture",
  sun: "bg-sun-soft text-sun",
  grow: "bg-grow-soft text-grow",
};

function Practice() {
  const { state } = useProgress();
  const due = state.reviewDue.length;
  const band = ageBands.find((b) => b.id === state.ageBand) ?? ageBands[1]!;
  const cap = band.id === "sprouts" ? 6 : band.id === "explorers" ? 12 : 20;
  const visible = Math.min(due, cap);

  const modules = [
    {
      accent: "language" as const,
      icon: SprayCan,
      title: "Ready to Review",
      body: "Water your due skill-seeds. Nothing here is ever marked late.",
      count: `${visible} items`,
    },
    {
      accent: "culture" as const,
      icon: Mic,
      title: "Pronunciation Studio",
      body: "Push-to-talk coaching. It never gives a score and never blocks you.",
      count: `${Math.max(1, Math.round(visible / 3))} items`,
    },
    {
      accent: "sun" as const,
      icon: Pencil,
      title: "अक्षर Tracing",
      body: "Trace, then copy, then write character trails at your own pace.",
      count: `${Math.max(2, Math.round(visible / 2))} items`,
    },
    {
      accent: "grow" as const,
      icon: Music4,
      title: "Traditional Songs",
      body: "Sing along; every song has words on screen and can be slowed.",
      count: "6 items",
    },
  ];

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="relative">
        <img
          src={gardenBg}
          alt=""
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-surface/30" />

        <div className="relative mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-center font-display text-3xl font-extrabold sm:text-4xl">
            Review Garden &amp; Soundlands
          </h1>
          <p className="mt-2 text-center text-sm text-ink-soft">
            A beautiful, stress-free space to blossom your Nepali. We show at most {cap} seeds at a
            time so it always feels doable.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {modules.map(({ accent, icon: Icon, title, body, count }) => (
              <Card key={title} accent={accent} bold translucent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${soft[accent]}`}
                  >
                    <Icon size={20} />
                  </span>
                  <Badge tone={accent}>{count}</Badge>
                </div>
                <h2 className="mt-4 font-display text-xl font-extrabold">{title}</h2>
                <p className="mt-1 text-sm text-ink-soft">{body}</p>
                <Link to="/kid/tracks" className="mt-4 block">
                  <Button variant={accent} fullWidth className={`${soft[accent]} hover:opacity-80`}>
                    Enter Section →
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <Card translucent className="mt-8 p-5">
            <h2 className="font-display text-lg font-extrabold">How seeds come back</h2>
            <p className="mt-2 text-sm text-ink-soft">
              A word you meet returns after {reviewIntervals.join(", ")} days. If it is late, it
              just says “ready to grow”. nothing wilts, nothing is lost, and there is no streak to
              break.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
