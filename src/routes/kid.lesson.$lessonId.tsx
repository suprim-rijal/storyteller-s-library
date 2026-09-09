import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { LessonEngine } from "@/components/LessonEngine";
import { getChapterOfModule, getLesson, getTrackOfChapter } from "@/data/curriculum";
import { buildLesson } from "@/lib/exercises";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/kid/lesson/$lessonId")({
  head: ({ params }) => {
    const found = getLesson(params.lessonId);
    const title = found ? `${found.lesson.title} — ${found.module.title}` : "Lesson";
    return {
      meta: [
        { title: `${title} — Nepali Kids` },
        {
          name: "description",
          content:
            "A 5–10 minute lesson: encounter, notice, retrieve and use. Infinite retries, hints that never cost anything.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "The Nepali Kids lesson player." },
      ],
    };
  },
  component: LessonPlayer,
});

function LessonPlayer() {
  const { lessonId } = Route.useParams();
  const found = getLesson(lessonId);
  const navigate = useNavigate();
  const { state, completeLesson } = useProgress();
  const [finished, setFinished] = useState<{ flowers: number } | null>(null);
  if (!found) throw notFound();

  const { lesson, module: mod } = found;
  const chapter = getChapterOfModule(mod.id)!;
  const track = getTrackOfChapter(chapter.id)!;
  const index = mod.lessons.findIndex((l) => l.id === lesson.id);
  const exercises = buildLesson(mod, index);
  const nextLesson = mod.lessons[index + 1];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-line bg-surface px-4 py-3">
        <Link
          to="/kid/module/$moduleId"
          params={{ moduleId: mod.id }}
          aria-label="Exit and save"
          className="grid h-9 w-9 place-items-center rounded-full border-2 border-line text-ink-soft hover:bg-canvas"
        >
          <X size={17} />
        </Link>
        <span className="min-w-0 truncate font-display text-sm font-extrabold sm:text-base">
          {mod.code} · Lesson {index + 1}: {lesson.title}
        </span>
        <Badge tone="neutral" className="ml-auto shrink-0">
          {lesson.phase}
        </Badge>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {finished ? (
          <Card accent="grow" bold className="bg-grow-soft p-6">
            <Badge tone="grow">Reflect</Badge>
            <h1 className="mt-2 font-display text-3xl font-extrabold">
              {finished.flowers} ✿ flowers. Well done, {state.name}!
            </h1>
            <p className="mt-2 text-ink-soft">
              You can now: {mod.goal.toLowerCase()} These words will come back in a story soon.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {nextLesson ? (
                <Button
                  variant="grow"
                  onClick={() =>
                    navigate({ to: "/kid/lesson/$lessonId", params: { lessonId: nextLesson.id } })
                  }
                >
                  Next lesson →
                </Button>
              ) : (
                <Link to="/kid/module/$moduleId/review" params={{ moduleId: mod.id }}>
                  <Button variant="grow">See my readiness review →</Button>
                </Link>
              )}
              <Link to="/kid/home">
                <Button variant="outline">Back home</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <LessonEngine
            exercises={exercises}
            accent={track.id}
            romanization={state.romanization}
            onFinish={({ flowers }) => {
              completeLesson(lesson.id, 20);
              setFinished({ flowers });
            }}
          />
        )}
      </main>
    </div>
  );
}
