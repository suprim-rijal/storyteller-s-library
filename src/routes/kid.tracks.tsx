import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { tracks } from "@/data/curriculum";
import { trackProgress, useProgress } from "@/lib/progress";
import langArt from "@/assets/illustrations/track-language.jpg";
import cultureArt from "@/assets/illustrations/track-culture.jpg";

export const Route = createFileRoute("/kid/tracks")({
  head: () => ({
    meta: [
      { title: "Choose Your Adventure Path — Nepali Kids" },
      {
        name: "description",
        content:
          "Two separate courses: the systematic Nepali Language track and the Discover Nepal culture track.",
      },
      { property: "og:title", content: "Choose Your Adventure Path" },
      {
        property: "og:description",
        content: "Pick the Nepali language trail or the Discover Nepal culture trail.",
      },
    ],
  }),
  component: Tracks,
});

const art = { language: langArt, culture: cultureArt } as const;

function Tracks() {
  const { state } = useProgress();

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <h1 className="text-center font-display text-3xl font-extrabold sm:text-4xl">
          Choose Your Adventure Path
        </h1>
        <p className="mt-2 text-center text-ink-soft">
          Two paths that never mix. You always know which one you are learning.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {tracks.map((t) => {
            const p = trackProgress(state, t.id);
            const current =
              t.chapters.find((c) => c.modules.some((m) => !state.masteredModules.includes(m.id))) ??
              t.chapters[0]!;
            return (
              <Card
                key={t.id}
                accent={t.id}
                bold
                className="flex flex-col p-5 transition duration-200 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={art[t.id]}
                    alt=""
                    loading="lazy"
                    width={1024}
                    height={640}
                    className="h-48 w-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-bold text-ink-soft">
                    {t.motif} motif
                  </span>
                </div>

                <h2 className="mt-5 font-display text-2xl font-extrabold">
                  <span lang="ne">{t.nepaliTitle}</span> / {t.title}
                </h2>
                <p className="mt-2 text-sm text-ink-soft">{t.tagline}</p>

                <div
                  className={
                    t.id === "language"
                      ? "mt-5 rounded-2xl bg-language-soft p-3"
                      : "mt-5 rounded-2xl bg-culture-soft p-3"
                  }
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                    Current chapter
                  </span>
                  <span
                    className={
                      t.id === "language"
                        ? "block text-sm font-bold text-language"
                        : "block text-sm font-bold text-culture"
                    }
                  >
                    {current.code} · {current.title}
                  </span>
                </div>

                <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                  What we will master:
                </p>
                <ul className="mt-2 space-y-2">
                  {current.modules.slice(0, 3).map((m) => (
                    <li key={m.id} className="flex items-start gap-2 text-sm">
                      <Check size={16} className="mt-0.5 shrink-0 text-grow" />
                      {m.goal}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between text-xs font-bold text-ink-soft">
                  <span>
                    {t.chapters.length} chapters · {p.modules} modules
                  </span>
                  <span>
                    {p.doneLessons} / {p.lessons} lessons
                  </span>
                </div>
                <ProgressBar className="mt-2" value={p.pct} tone={t.id} label={`${t.title} progress`} />

                <div className="mt-6">
                  <Link to="/kid/track/$trackId/map" params={{ trackId: t.id }}>
                    <Button variant={t.id} size="lg" fullWidth>
                      {t.id === "language" ? "Explore Sounds →" : "Begin Voyage →"}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        <p className="mt-8 text-center">
          <Badge tone="grow">No hearts · no lives · no timers · unlimited retries</Badge>
        </p>
      </main>
    </div>
  );
}
