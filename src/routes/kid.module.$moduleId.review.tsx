import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Badge, Button, Card, ProgressBar } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { getModule, masteryLabels, reviewIntervals } from "@/data/curriculum";
import { moduleProgress, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/kid/module/$moduleId/review")({
  head: ({ params }) => {
    const mod = getModule(params.moduleId);
    const title = mod ? `Readiness review. ${mod.title}` : "Readiness review";
    return {
      meta: [
        { title: `${title}. Nepali Kids` },
        {
          name: "description",
          content:
            "Skill petals show what is ready, growing or still a seed, and offer a short targeted practice.",
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "A calm readiness check before the module quest. It never uses a test attempt.",
        },
      ],
    };
  },
  component: Review,
});

const petal = (i: number, done: number) =>
  done > i + 1 ? "Ready" : done > i ? "Growing" : "Let's practise";

function Review() {
  const { moduleId } = Route.useParams();
  const mod = getModule(moduleId);
  const { state } = useProgress();
  if (!mod) throw notFound();
  const p = moduleProgress(state, mod.id);

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <Link
          to="/kid/module/$moduleId"
          params={{ moduleId: mod.id }}
          className="text-sm font-bold text-ink-soft hover:underline"
        >
          ← {mod.code} {mod.title}
        </Link>

        <h1 className="mt-4 font-display text-3xl font-extrabold">Readiness review</h1>
        <p className="mt-2 text-ink-soft">
          These petals are not a score. They tell us which two-minute practice would help most.
          Looking here never uses a quest attempt.
        </p>

        <Card className="mt-6 p-5">
          <div className="flex items-center justify-between text-xs font-bold text-ink-soft">
            <span>LESSONS EXPERIENCED</span>
            <span>
              {p.done} / {p.total}
            </span>
          </div>
          <ProgressBar className="mt-2" value={p.pct} tone="grow" label="Lessons experienced" />
        </Card>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {mod.skills.map((skill, i) => {
            const label = petal(i, p.done);
            return (
              <Card key={skill} className="p-5">
                <h2 className="font-display text-lg font-extrabold">{skill}</h2>
                <p className="mt-2">
                  <Badge tone={label === "Ready" ? "grow" : label === "Growing" ? "sun" : "neutral"}>
                    {label}
                  </Badge>
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  {label === "Ready"
                    ? "Strong evidence in two modes. Eligible for the quest."
                    : label === "Growing"
                      ? "Guided retrieval in a close context will help."
                      : "Let's re-model this with a contrast and a concrete picture."}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/kid/practice">
            <Button variant="grow">Do a 2-minute targeted practice →</Button>
          </Link>
          <Link to="/kid/module/$moduleId/test" params={{ moduleId: mod.id }}>
            <Button variant="outline">I'm ready for the quest</Button>
          </Link>
        </div>

        <Card className="mt-8 p-5">
          <h2 className="font-display text-lg font-extrabold">How mastery is read</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {masteryLabels.map((m) => (
              <li key={m.label} className="rounded-2xl bg-canvas p-3">
                <span className="font-bold">{m.label}</span>{" "}
                <span className="text-ink-soft">({m.range})</span>
                <p className="text-ink-soft">{m.behavior}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-soft">
            Review returns after {reviewIntervals.join(", ")} days. Overdue items say “ready to
            grow”, never “late”.
          </p>
        </Card>
      </main>
    </div>
  );
}
