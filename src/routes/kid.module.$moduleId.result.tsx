import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Award, Sparkles } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { getChapterOfModule, getModule, getTrackOfChapter } from "@/data/curriculum";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/kid/module/$moduleId/result")({
  head: ({ params }) => {
    const mod = getModule(params.moduleId);
    const title = mod ? `Result. ${mod.title}` : "Result";
    return {
      meta: [
        { title: `${title}. Nepali Kids` },
        {
          name: "description",
          content: "Effort and named skills are celebrated, with up to two skills to grow next.",
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "Module result and reward reveal." },
      ],
    };
  },
  component: Result,
});

function Result() {
  const { moduleId } = Route.useParams();
  const mod = getModule(moduleId);
  const { state } = useProgress();
  if (!mod) throw notFound();
  const chapter = getChapterOfModule(mod.id)!;
  const track = getTrackOfChapter(chapter.id)!;
  const nextModule =
    chapter.modules[chapter.modules.findIndex((m) => m.id === mod.id) + 1] ??
    track.chapters[track.chapters.findIndex((c) => c.id === chapter.id) + 1]?.modules[0];

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card accent="grow" bold className="bg-grow-soft p-6 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-surface text-grow">
            <Award size={30} />
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold">
            {mod.code} complete, {state.name}!
          </h1>
          <p className="mt-2 text-ink-soft">
            You kept going and that is what built this. +{mod.xp} XP added to your journey.
          </p>
        </Card>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <h2 className="font-display text-lg font-extrabold">Mastered</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {mod.skills.slice(0, 3).map((s) => (
                <li key={s}>
                  <Badge tone="grow">{s}</Badge>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <h2 className="font-display text-lg font-extrabold">Growing next</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {(mod.skills.slice(3).length ? mod.skills.slice(3) : ["Using these words in a story"]).map(
                (s) => (
                  <li key={s}>
                    <Badge tone="sun">{s}</Badge>
                  </li>
                ),
              )}
            </ul>
          </Card>
        </div>

        <Card accent="dream" bold className="mt-6 bg-dream-soft p-5">
          <Badge tone="dream">Reward</Badge>
          <h2 className="mt-2 flex items-center gap-2 font-display text-xl font-extrabold text-dream">
            <Sparkles size={20} /> A new story card for your Treasures
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            Rewards are never random and never for sale. Nothing you earn expires.
          </p>
          <Link to="/kid/treasures" className="mt-4 inline-block">
            <Button variant="outline" size="sm">
              Open Treasures →
            </Button>
          </Link>
        </Card>

        <div className="mt-8 flex flex-wrap gap-3">
          {nextModule ? (
            <Link to="/kid/module/$moduleId" params={{ moduleId: nextModule.id }}>
              <Button variant={track.id}>Continue to {nextModule.code} →</Button>
            </Link>
          ) : null}
          <Link to="/kid/track/$trackId/map" params={{ trackId: track.id }}>
            <Button variant="outline">Back to the trail</Button>
          </Link>
          <Link to="/kid/home">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
