import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BookOpen, Download, Lock } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { getChapter, getTrackOfChapter } from "@/data/curriculum";
import { moduleStatus, useProgress } from "@/lib/progress";

export const Route = createFileRoute("/kid/chapter/$chapterId")({
  head: ({ params }) => {
    const chapter = getChapter(params.chapterId);
    const title = chapter ? `${chapter.code}: ${chapter.title}` : "Chapter";
    return {
      meta: [
        { title: `${title} — Nepali Kids` },
        {
          name: "description",
          content:
            chapter?.summary ??
            "Chapter detail with the narrative goal, ordered modules and a vocabulary preview.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: chapter?.summary ?? "Chapter detail." },
      ],
    };
  },
  component: ChapterDetail,
});

function ChapterDetail() {
  const { chapterId } = Route.useParams();
  const chapter = getChapter(chapterId);
  const { state } = useProgress();
  if (!chapter) throw notFound();
  const track = getTrackOfChapter(chapter.id)!;

  const vocab = chapter.modules.flatMap((m) => m.items).slice(0, 12);

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <Link
          to="/kid/track/$trackId/map"
          params={{ trackId: track.id }}
          className="text-sm font-bold text-ink-soft hover:underline"
        >
          ← Back to the {track.title} trail
        </Link>

        <Card accent={track.id} bold className="mt-4 p-6">
          <Badge tone={track.id}>{chapter.code}</Badge>
          <h1 className="mt-2 font-display text-3xl font-extrabold">
            {chapter.title}
            {chapter.nepaliTitle ? (
              <span lang="ne" className="ml-3 text-xl text-ink-soft">
                {chapter.nepaliTitle}
              </span>
            ) : null}
          </h1>
          <p className="mt-2 text-ink-soft">{chapter.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone="neutral">{chapter.modules.length} modules</Badge>
            <Badge tone="neutral">
              {chapter.modules.reduce((n, m) => n + m.lessons.length, 0)} lessons
            </Badge>
            <Badge tone="sun">
              {chapter.modules.reduce((n, m) => n + m.xp, 0)} XP planned
            </Badge>
          </div>
        </Card>

        <h2 className="mt-8 font-display text-xl font-extrabold">Modules in order</h2>
        <div className="mt-4 grid gap-4">
          {chapter.modules.map((m) => {
            const status = moduleStatus(state, m.id);
            return (
              <Card key={m.id} className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={track.id}>{m.code}</Badge>
                  <Badge tone={status === "mastered" ? "grow" : status === "locked" ? "neutral" : "sun"}>
                    {status}
                  </Badge>
                  <Badge tone="neutral">{m.xp} XP</Badge>
                </div>
                <h3 className="mt-2 font-display text-lg font-extrabold">{m.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{m.goal}</p>
                <div className="mt-4">
                  {status === "locked" ? (
                    <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
                      <Lock size={15} /> Finish the module before this one to open it.
                    </span>
                  ) : (
                    <Link to="/kid/module/$moduleId" params={{ moduleId: m.id }}>
                      <Button variant={track.id} size="sm">
                        Open module lobby →
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
              <BookOpen size={18} className="text-language" /> Vocabulary preview
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {vocab.map((v, i) => (
                <li key={v.np + i} className="rounded-2xl bg-canvas px-3 py-2 text-sm">
                  <span lang="ne" className="font-display text-lg font-extrabold">
                    {v.np}
                  </span>
                  <span className="ml-2 text-ink-soft">
                    {v.rom} — {v.en}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
              <Download size={18} className="text-dream" /> Adult note & checkpoint rule
            </h2>
            <p className="mt-3 text-sm text-ink-soft">
              A chapter checkpoint is a 12–20 minute story mission that combines the modules
              above. A child passes at 75% with no critical misconception; the final quests
              need 80%. Results are shown as dimensions and examples — never a single grade.
            </p>
            <p className="mt-3 text-sm text-ink-soft">
              Every lesson has an accessible transcript, and audio can be slowed at any time.
            </p>
            <Link to="/adult/dashboard" className="mt-4 inline-block">
              <Button variant="outline" size="sm">
                Open the adult note →
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
