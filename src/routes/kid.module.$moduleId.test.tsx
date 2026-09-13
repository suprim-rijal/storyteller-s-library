import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { LessonEngine } from "@/components/LessonEngine";
import { getChapterOfModule, getModule, getTrackOfChapter } from "@/data/curriculum";
import { buildTest } from "@/lib/exercises";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/kid/module/$moduleId/test")({
  head: ({ params }) => {
    const mod = getModule(params.moduleId);
    const title = mod ? `Module quest. ${mod.title}` : "Module quest";
    return {
      meta: [
        { title: `${title}. Nepali Kids` },
        {
          name: "description",
          content:
            "An untimed module quest with no new content, pausing allowed and no hearts or lives.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "The low-stakes module quest." },
      ],
    };
  },
  component: Quest,
});

function Quest() {
  const { moduleId } = Route.useParams();
  const mod = getModule(moduleId);
  const navigate = useNavigate();
  const { state, masterModule } = useProgress();
  const [done, setDone] = useState<{ flowers: number; hintsUsed: number } | null>(null);
  if (!mod) throw notFound();
  const chapter = getChapterOfModule(mod.id)!;
  const track = getTrackOfChapter(chapter.id)!;
  const exercises = buildTest(mod);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-line bg-surface px-4 py-3">
        <Link
          to="/kid/module/$moduleId"
          params={{ moduleId: mod.id }}
          aria-label="Pause and leave the quest"
          className="grid h-9 w-9 place-items-center rounded-full border-2 border-line text-ink-soft hover:bg-canvas"
        >
          <X size={17} />
        </Link>
        <span className="truncate font-display text-sm font-extrabold sm:text-base">
          {mod.code} quest · {mod.title}
        </span>
        <Badge tone="neutral" className="ml-auto shrink-0">
          Untimed
        </Badge>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {done ? (
          <Card accent="grow" bold className="bg-grow-soft p-6">
            <Badge tone="grow">Quest complete</Badge>
            <h1 className="mt-2 font-display text-3xl font-extrabold">
            You showed {done.flowers} of {exercises.length} skills today, {state.name}.
            </h1>
            <p className="mt-2 text-ink-soft">
              Mastered now: {mod.skills.slice(0, 2).join(", ")}. Growing next:{" "}
              {mod.skills.slice(2).join(", ") || "keep using these in stories"}.
              {done.hintsUsed > 0
                ? " You used hints. That is how learning works, and nothing was taken away."
                : ""}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="grow"
                onClick={() => {
                  masterModule(mod.id, mod.xp);
                  navigate({ to: "/kid/module/$moduleId/result", params: { moduleId: mod.id } });
                }}
              >
                Collect reward →
              </Button>
              <Link to="/kid/module/$moduleId" params={{ moduleId: mod.id }}>
                <Button variant="outline">Back to the lessons</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <>
            <p className="mb-6 text-sm text-ink-soft">
              No new content, no timer, no lives. You can pause and come back at any moment.
            </p>
            <LessonEngine
              exercises={exercises}
              accent={track.id}
              quiet
              romanization={state.romanization}
              reducedMotion={state.reducedMotion}
              onFinish={setDone}
            />
          </>
        )}
      </main>
    </div>
  );
}
