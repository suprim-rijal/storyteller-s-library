import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { getChapterOfModule, getModule, getTrackOfChapter } from "@/data/curriculum";
import { moduleProgress, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/kid/module/$moduleId")({
  head: ({ params }) => {
    const mod = getModule(params.moduleId);
    const title = mod ? `${mod.code} ${mod.title}` : "Module";
    return {
      meta: [
        { title: `${title}. Nepali Kids` },
        { name: "description", content: mod?.goal ?? "Module lobby with lessons, review and quest." },
        { property: "og:title", content: title },
        { property: "og:description", content: mod?.goal ?? "Module lobby." },
      ],
    };
  },
  component: ModuleLobby,
});

function ModuleLobby() {
  const { moduleId } = Route.useParams();
  const mod = getModule(moduleId);
  const { state } = useProgress();
  if (!mod) throw notFound();
  const chapter = getChapterOfModule(mod.id)!;
  const track = getTrackOfChapter(chapter.id)!;
  const p = moduleProgress(state, mod.id);
  const testReady = p.done >= mod.lessons.length - 1;

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Link
          to="/kid/chapter/$chapterId"
          params={{ chapterId: chapter.id }}
          className="text-sm font-bold text-ink-soft hover:underline"
        >
          ← {chapter.code}: {chapter.title}
        </Link>

        <Card accent={track.id} bold className="mt-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={track.id}>{mod.code}</Badge>
            <Badge tone="sun">{mod.xp} XP planned</Badge>
            <Badge tone="neutral">{mod.testTasks}-task quest</Badge>
          </div>
          <h1 className="mt-2 font-display text-3xl font-extrabold">{mod.title}</h1>
          <p className="mt-2 text-ink-soft">
            <span className="font-bold">What you will be able to do: </span>
            {mod.goal}
          </p>
          <div className="mt-4 flex items-center justify-between text-xs font-bold text-ink-soft">
            <span>LESSON STONES</span>
            <span>
              {p.done} / {p.total}
            </span>
          </div>
          <ProgressBar className="mt-2" value={p.pct} tone={track.id} label="Module progress" />
          {mod.note ? (
            <p className="mt-4 rounded-2xl bg-canvas p-3 text-xs text-ink-soft">{mod.note}</p>
          ) : null}
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-3">
            {mod.lessons.map((lesson, i) => {
              const done = state.completedLessons.includes(lesson.id);
              return (
                <Link key={lesson.id} to="/kid/lesson/$lessonId" params={{ lessonId: lesson.id }}>
                  <Card className="flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-canvas font-display text-lg font-extrabold">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-extrabold">
                        {lesson.title}
                      </span>
                      <span className="block text-xs text-ink-soft">
                        {lesson.phase} · about {lesson.minutes} minutes
                      </span>
                    </span>
                    {done ? (
                      <CheckCircle2 size={22} className="shrink-0 text-grow" />
                    ) : (
                      <Circle size={22} className="shrink-0 text-line" />
                    )}
                  </Card>
                </Link>
              );
            })}

            <Card accent="sun" bold className="flex flex-wrap items-center gap-4 bg-sun-soft p-5">
              <div className="min-w-0">
                <h2 className="font-display text-lg font-extrabold">Module quest</h2>
                <p className="text-sm text-ink-soft">
                  {mod.testTasks} varied tasks, untimed, no new content. Pausing is always allowed.
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <Link to="/kid/module/$moduleId/review" params={{ moduleId: mod.id }}>
                  <Button variant="outline" size="sm">
                    Readiness review
                  </Button>
                </Link>
                <Link to="/kid/module/$moduleId/test" params={{ moduleId: mod.id }}>
                  <Button variant="sun" size="sm" disabled={!testReady}>
                    {testReady ? "Start quest →" : "Finish the lessons first"}
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <aside className="grid content-start gap-4">
            <Card className="p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
                <Sparkles size={18} className="text-language" /> Skills in this module
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {mod.skills.map((s) => (
                  <li key={s}>
                    <Badge tone="language">{s}</Badge>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5">
              <h2 className="font-display text-lg font-extrabold">Target items</h2>
              <ul className="mt-3 space-y-2">
                {mod.items.map((v, i) => (
                  <li key={v.np + i} className="rounded-2xl bg-canvas px-3 py-2 text-sm">
                    <span lang="ne" className="font-display text-lg font-extrabold">
                      {v.np}
                    </span>
                    <span className="ml-2 text-ink-soft">
                      {v.rom} · {v.en}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
