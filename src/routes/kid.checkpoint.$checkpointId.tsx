import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Compass, Sparkles } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { bridges, getChapter, getTrackOfChapter } from "@/data/curriculum";

export const Route = createFileRoute("/kid/checkpoint/$checkpointId")({
  head: ({ params }) => ({
    meta: [
      { title: `Checkpoint ${params.checkpointId} — Nepali Kids` },
      {
        name: "description",
        content:
          "A 12–20 minute story mission that mixes a chapter's modules, or an optional bridge between the two tracks.",
      },
      { property: "og:title", content: "Checkpoint — Nepali Kids" },
      {
        property: "og:description",
        content: "Chapter checkpoints and optional cross-track bridge adventures.",
      },
    ],
  }),
  component: Checkpoint,
});

function Checkpoint() {
  const { checkpointId } = Route.useParams();
  const bridge = bridges.find((b) => b.id === checkpointId);
  const chapter = getChapter(checkpointId);
  if (!bridge && !chapter) throw notFound();

  const title = bridge ? "Bridge adventure" : `${chapter!.code} checkpoint`;
  const track = chapter ? getTrackOfChapter(chapter.id) : undefined;

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card accent={bridge ? "dream" : (track?.id ?? "language")} bold className="p-6">
          <Badge tone={bridge ? "dream" : "language"}>
            {bridge ? "Optional · never required" : "Story mission"}
          </Badge>
          <h1 className="mt-2 flex items-center gap-2 font-display text-3xl font-extrabold">
            {bridge ? <Sparkles size={24} className="text-dream" /> : <Compass size={24} />}
            {title}
          </h1>
          <p className="mt-3 text-ink-soft">
            {bridge
              ? bridge.experience
              : `A 12–20 minute mission that mixes everything from ${chapter!.title}. Untimed, pausable, with no new content.`}
          </p>

          <ul className="mt-5 grid gap-2 text-sm">
            {bridge ? (
              <>
                <li className="rounded-2xl bg-canvas p-3">
                  <span className="font-bold">Language readiness:</span> {bridge.languagePrereq}
                </li>
                <li className="rounded-2xl bg-canvas p-3">
                  <span className="font-bold">Culture readiness:</span> {bridge.culturePrereq}
                </li>
                <li className="rounded-2xl bg-canvas p-3">
                  <span className="font-bold">Reward:</span> {bridge.reward}
                </li>
              </>
            ) : (
              chapter!.modules.map((m) => (
                <li key={m.id} className="rounded-2xl bg-canvas p-3">
                  <span className="font-bold">{m.code}:</span> {m.title}
                </li>
              ))
            )}
          </ul>

          <p className="mt-5 rounded-2xl bg-canvas p-3 text-xs text-ink-soft">
            Passing is 75% with no critical misconception. If it isn't reached, nothing is lost:
            two named skills come back as short practice, and the mission reopens whenever you
            like. Bridges never mix the two tracks' progress or results.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {chapter ? (
              <Link
                to="/kid/module/$moduleId/test"
                params={{ moduleId: chapter.modules[0]!.id }}
              >
                <Button variant={track?.id ?? "language"}>Start the mission →</Button>
              </Link>
            ) : null}
            <Link to="/kid/home">
              <Button variant="outline">Maybe later</Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}
