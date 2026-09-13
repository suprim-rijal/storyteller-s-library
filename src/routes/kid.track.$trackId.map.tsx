import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Lock, Sprout, Flower2, RefreshCw } from "lucide-react";
import { Badge, Button, Card, cn } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { bridges, getTrack } from "@/data/curriculum";
import { moduleStatus, useProgress } from "@/lib/progress";
import trailBg from "@/assets/illustrations/mountain-trail-bg.jpg";

export const Route = createFileRoute("/kid/track/$trackId/map")({
  head: ({ params }) => {
    const title =
      params.trackId === "culture"
        ? "Discover Nepal. Chapter Trail"
        : "Nepali Language. Chapter Trail";
    return {
      meta: [
        { title: `${title}. Nepali Kids` },
        {
          name: "description",
          content:
            "A vertical journey map of chapters and modules, showing mastered, active and locked steps with their prerequisites.",
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: "Follow the trail chapter by chapter. Locked steps always say what to finish first.",
        },
      ],
    };
  },
  component: TrackMap,
});

function TrackMap() {
  const { trackId } = Route.useParams();
  const track = getTrack(trackId);
  const { state } = useProgress();
  if (!track) throw notFound();

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="relative">
        <img
          src={trailBg}
          alt=""
          width={1536}
          height={1024}
          className="fixed inset-0 -z-10 h-full w-full object-cover opacity-70"
        />

        <div className="mx-auto max-w-3xl px-4 py-10">
          <div className="text-center">
            <Badge tone={track.id}>{track.nepaliTitle}</Badge>
            <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
              Chapter Trail: {track.title}
            </h1>
            <p className="mt-2 text-sm text-ink-soft">{track.tagline}</p>
          </div>

          <ol className="relative mt-10 space-y-8 before:absolute before:bottom-6 before:left-6 before:top-6 before:w-1 before:rounded-full before:bg-line">
            {track.chapters.map((chapter) => {
              const mastered = chapter.modules.every((m) =>
                state.masteredModules.includes(m.id),
              );
              const open = chapter.modules.some(
                (m) => moduleStatus(state, m.id) !== "locked",
              );
              return (
                <li key={chapter.id} className="relative grid grid-cols-[3rem_minmax(0,1fr)] gap-5">
                  <span
                    className={cn(
                      "relative z-10 grid h-12 w-12 place-items-center rounded-full border-4 border-surface",
                      mastered
                        ? "bg-grow text-white"
                        : open
                          ? track.id === "language"
                            ? "bg-language pulse-ring text-white"
                            : "bg-culture pulse-ring text-white"
                          : "bg-line text-ink-soft",
                    )}
                  >
                    {mastered ? <Flower2 size={20} /> : open ? <Sprout size={20} /> : <Lock size={18} />}
                  </span>

                  <Card translucent bold accent={mastered ? "grow" : open ? track.id : "none"} className="min-w-0 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={mastered ? "grow" : open ? track.id : "neutral"}>
                        {chapter.code}
                      </Badge>
                      {mastered ? (
                        <Badge tone="grow">Mastered</Badge>
                      ) : open ? (
                        <Badge tone="sun">In progress</Badge>
                      ) : (
                        <Badge tone="neutral">
                          Locked · finish the chapter above first
                        </Badge>
                      )}
                    </div>
                    <h2 className="mt-2 font-display text-xl font-extrabold">
                      {chapter.title}
                      {chapter.nepaliTitle ? (
                        <span lang="ne" className="ml-2 text-base text-ink-soft">
                          {chapter.nepaliTitle}
                        </span>
                      ) : null}
                    </h2>
                    <p className="mt-1 text-sm text-ink-soft">{chapter.summary}</p>

                    <ul className="mt-4 space-y-2">
                      {chapter.modules.map((m) => {
                        const status = moduleStatus(state, m.id);
                        return (
                          <li key={m.id}>
                            <Link
                              to="/kid/module/$moduleId"
                              params={{ moduleId: m.id }}
                              disabled={status === "locked"}
                              className={cn(
                                "flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm",
                                status === "locked"
                                  ? "pointer-events-none border-line bg-canvas text-ink-soft"
                                  : "border-line bg-surface hover:border-language",
                              )}
                            >
                              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-canvas">
                                {status === "mastered" ? (
                                  <Flower2 size={14} className="text-grow" />
                                ) : status === "in-progress" ? (
                                  <RefreshCw size={14} className="text-sun" />
                                ) : status === "available" ? (
                                  <Sprout size={14} className="text-language" />
                                ) : (
                                  <Lock size={13} />
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="font-bold">{m.code}</span> {m.title}
                              </span>
                              <span className="shrink-0 text-xs font-bold uppercase text-ink-soft">
                                {status === "locked" ? "locked" : status}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </Card>
                </li>
              );
            })}
          </ol>

          <Card accent="dream" bold className="mt-10 bg-dream-soft p-5">
            <Badge tone="dream">Optional bridge trail</Badge>
            <h2 className="mt-2 font-display text-xl font-extrabold text-dream">
              Cross-track adventures
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Bridges open when both tracks are ready. They add a little evidence to each
              side and never unlock a core module by themselves.
            </p>
            <ul className="mt-4 space-y-3">
              {bridges.slice(0, 4).map((b) => (
                <li key={b.id} className="rounded-2xl bg-surface p-3 text-sm">
                  <p className="font-bold">{b.experience}</p>
                  <p className="mt-1 text-xs text-ink-soft">
                    Needs {b.languagePrereq} + {b.culturePrereq} · reward: {b.reward}
                  </p>
                </li>
              ))}
            </ul>
            <Link to="/kid/treasures" className="mt-4 inline-block">
              <Button variant="outline" size="sm">
                See achievements and badges
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
