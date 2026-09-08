import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Sprout, Flower2, Lock, Star } from "lucide-react";
import { Badge, Button, Card, cn } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import trailBg from "@/assets/illustrations/mountain-trail-bg.jpg";

export const Route = createFileRoute("/kid/track/$trackId/map")({
  head: () => ({
    meta: [
      { title: "Chapter Trail — Nepali Kids" },
      {
        name: "description",
        content:
          "The vertical journey map of chapters: mastered, in progress and locked.",
      },
      { property: "og:title", content: "Chapter Trail — Nepali Kids" },
      {
        property: "og:description",
        content: "Ascend step-by-step to the summit of sounds.",
      },
    ],
  }),
  component: TrailMap,
});

type NodeState = "mastered" | "active" | "locked";

const nodes: {
  state: NodeState;
  title: string;
  meta: string;
  side: "left" | "right";
}[] = [
  {
    state: "mastered",
    title: "Chapter 1: Hill Greetings",
    meta: "5 modules · Mastered ✿",
    side: "left",
  },
  {
    state: "active",
    title: "Chapter 2: Vowel Valley",
    meta: "3 / 6 modules · 15 mins left",
    side: "right",
  },
  {
    state: "locked",
    title: "Chapter 3: Consonant Trails",
    meta: "8 modules · Locked",
    side: "left",
  },
];

function TrailMap() {
  const { trackId } = Route.useParams();
  const navigate = useNavigate();
  const isCulture = trackId === "culture";

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="relative">
        <img
          src={trailBg}
          alt=""
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-surface/25" />

        <div className="relative mx-auto max-w-4xl px-4 py-12">
          <h1 className="text-center font-display text-3xl font-extrabold sm:text-4xl">
            Chapter Trail: {isCulture ? "Discover Nepal" : "Nepali Language"}
          </h1>
          <p className="mt-2 text-center text-sm text-ink-soft">
            Let's ascend step-by-step to the summit of sounds!
          </p>

          <ol className="relative mt-12 space-y-14">
            <span
              aria-hidden
              className="absolute left-1/2 top-0 h-full -translate-x-1/2 border-l-4 border-dotted border-ink/25"
            />
            {nodes.map((n) => (
              <li
                key={n.title}
                className={cn(
                  "relative grid items-center gap-4",
                  "grid-cols-[1fr_auto_1fr]",
                )}
              >
                <div
                  className={cn(
                    "min-w-0",
                    n.side === "left" ? "col-start-1 text-right" : "col-start-3 text-left",
                  )}
                >
                  {n.state === "active" ? <Badge tone="language">IN PROGRESS</Badge> : null}
                  <h2
                    className={cn(
                      "font-display text-lg font-extrabold",
                      n.state === "mastered" && "text-grow",
                      n.state === "active" && "text-ink",
                      n.state === "locked" && "text-ink-soft/60",
                    )}
                  >
                    {n.title}
                  </h2>
                  <p
                    className={cn(
                      "text-xs font-bold",
                      n.state === "locked" ? "text-ink-soft/50" : "text-ink-soft",
                    )}
                  >
                    {n.meta}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={n.state !== "active"}
                  onClick={() =>
                    navigate({ to: "/kid/lesson/$lessonId", params: { lessonId: "vowel-a" } })
                  }
                  aria-label={n.title}
                  className={cn(
                    "col-start-2 grid h-16 w-16 place-items-center rounded-full border-4 bg-surface transition",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language",
                    n.state === "mastered" && "border-grow text-grow",
                    n.state === "active" && "pulse-ring border-language text-language hover:scale-105",
                    n.state === "locked" && "cursor-not-allowed border-line text-ink-soft/50",
                  )}
                >
                  {n.state === "mastered" ? (
                    <Flower2 size={26} />
                  ) : n.state === "active" ? (
                    <Sprout size={26} />
                  ) : (
                    <Lock size={24} />
                  )}
                </button>


              </li>
            ))}
          </ol>

          <Card
            accent="sun"
            bold
            translucent
            className="mt-16 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 shadow-[0_0_28px_-6px_rgba(240,160,32,0.6)] sm:flex sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Star size={22} className="shrink-0 text-sun" />
              <div className="min-w-0">
                <h3 className="font-display font-extrabold">
                  Bridge Trail: Monkey Temple Adventure
                </h3>
                <p className="text-sm text-ink-soft">
                  A beautiful cross-track cultural dive! Earn a special monkey seal.
                </p>
              </div>
            </div>
            <Link to="/kid/lesson/$lessonId" params={{ lessonId: "monkey-temple" }}>
              <Button variant="sun" size="sm" className="bg-transparent text-sun hover:bg-sun-soft">
                Cross →
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
