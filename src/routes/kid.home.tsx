import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Globe, Sprout, Award } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { tracks } from "@/data/curriculum";
import { trackProgress, useProgress } from "@/lib/progress";
import yak from "@/assets/illustrations/yak-mascot.png";
export const Route = createFileRoute("/kid/home")({
  head: () => ({
    meta: [
      { title: "Journey — Nepali Kids" },
      {
        name: "description",
        content:
          "Your learning hub: the next lesson, language and culture progress, the Practice Garden and your weekly rhythm.",
      },
      { property: "og:title", content: "Journey — Nepali Kids" },
      {
        property: "og:description",
        content: "The child's daily hub for Nepali language and culture learning.",
      },
    ],
  }),
  component: KidHome,
});

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

function lastSevenDays() {
  const out: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function KidHome() {
  const { state } = useProgress();
  const language = tracks.find((t) => t.id === "language")!;
  const culture = tracks.find((t) => t.id === "culture")!;
  const lp = trackProgress(state, "language");
  const cp = trackProgress(state, "culture");

  const allModules = language.chapters.flatMap((c) => c.modules);
  const nextModule =
    allModules.find((m) => !state.masteredModules.includes(m.id)) ?? allModules[0]!;
  const nextLesson =
    nextModule.lessons.find((l) => !state.completedLessons.includes(l.id)) ??
    nextModule.lessons[0]!;
  const days = lastSevenDays();
  const learnedDays = days.filter((d) => state.rhythmDays.includes(d)).length;
  const due = state.reviewDue.length;

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[1.7fr_1fr] lg:px-8">
        <div className="flex flex-col gap-5">
          <Card className="flex items-center gap-5 bg-language-soft p-6" accent="none">
            <img
              src={yak}
              alt="Yaju the yak"
              width={768}
              height={768}
              className="h-24 w-24 shrink-0 rounded-2xl bg-surface object-contain p-1"
            />
            <div className="min-w-0">
              <Badge tone="sun">NAMASTE &amp; WELCOME!</Badge>
              <h1 className="mt-2 font-display text-2xl font-extrabold leading-snug sm:text-3xl">
                Ready to {nextLesson.title.toLowerCase()} today, {state.name}?
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                {due > 0
                  ? `Yaju is packing our bags. ${due} review seed${due === 1 ? "" : "s"} are waiting for warm mountain rain.`
                  : "Yaju is packing our bags. Every seed is watered — a fresh lesson is the perfect next step."}
              </p>
            </div>
          </Card>

          <Card className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span
                lang="ne"
                className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-culture-soft font-display text-3xl font-extrabold text-culture"
              >
                {nextModule.items[0]?.np.slice(0, 1) ?? "अ"}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-culture">
                  Current lesson
                </p>
                <h2 className="font-display text-xl font-extrabold">{nextLesson.title}</h2>
                <p className="text-sm text-ink-soft">
                  {nextModule.code}: {nextModule.title} · about {nextLesson.minutes} mins
                </p>
              </div>
            </div>
            <Link to="/kid/lesson/$lessonId" params={{ lessonId: nextLesson.id }}>
              <Button variant="grow" size="lg">
                Let's Play! →
              </Button>
            </Link>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-extrabold">Nepali Language</h3>
                <MessageCircle size={18} className="shrink-0 text-language" />
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                Devanagari sounds, letters and writing trails
              </p>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-ink-soft">
                <span>LANGUAGE MILESTONES</span>
                <span>
                  {lp.mastered} / {lp.modules} modules
                </span>
              </div>
              <ProgressBar
                className="mt-2"
                value={lp.pct}
                tone="language"
                label="Language progress"
              />
              <Link
                to="/kid/track/$trackId/map"
                params={{ trackId: "language" }}
                className="mt-3 inline-block text-sm font-bold text-language hover:underline"
              >
                Open the language trail →
              </Link>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-extrabold">Discover Nepal</h3>
                <Globe size={18} className="shrink-0 text-culture" />
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                Places, communities, festivals and everyday life
              </p>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-ink-soft">
                <span>CULTURE DISCOVERIES</span>
                <span>
                  {cp.mastered} / {cp.modules} modules
                </span>
              </div>
              <ProgressBar className="mt-2" value={cp.pct} tone="culture" label="Culture progress" />
              <Link
                to="/kid/track/$trackId/map"
                params={{ trackId: "culture" }}
                className="mt-3 inline-block text-sm font-bold text-culture hover:underline"
              >
                Open the culture trail →
              </Link>
            </Card>
          </div>

          <Link to="/kid/tracks" className="text-sm font-bold text-language hover:underline">
            Choose a different adventure path →
          </Link>
        </div>

        <aside className="flex flex-col gap-5">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sun-soft text-sun">
                <Sprout size={18} />
              </span>
              <h3 className="font-display text-lg font-extrabold">Practice Garden</h3>
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              Your hard-earned lesson seeds are waiting to turn into vibrant blossoms.
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold">
              <span className="font-display text-2xl text-sun">{due}</span> review seeds ready to
              grow
            </p>
            <Link to="/kid/practice" className="mt-4 block">
              <Button variant="sun" fullWidth className="bg-sun-soft text-sun hover:bg-sun-soft/70">
                Water My Garden →
              </Button>
            </Link>
          </Card>

          <Card className="p-5">
            <h3 className="font-display text-lg font-extrabold">Weekly Harmony</h3>
            <p className="mt-2 text-sm text-ink-soft">
              You learned on {learnedDays} day{learnedDays === 1 ? "" : "s"} this week. No stress —
              play at your mountain pace.
            </p>
            <ul className="mt-4 flex justify-between">
              {days.map((date, i) => {
                const done = state.rhythmDays.includes(date);
                return (
                  <li key={date} className="flex flex-col items-center gap-1.5">
                    <span
                      className={
                        done
                          ? "grid h-8 w-8 place-items-center rounded-full bg-culture-soft text-culture"
                          : "grid h-8 w-8 place-items-center rounded-full bg-canvas text-ink-soft"
                      }
                      aria-label={done ? "Learned" : "Rest day"}
                    >
                      {done ? "✿" : "·"}
                    </span>
                    <span className="text-[10px] font-bold text-ink-soft">{dayLabels[i]}</span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Link to="/kid/reward/$rewardId" params={{ rewardId: "try-another-way" }}>
            <Card accent="grow" bold className="flex items-start gap-3 bg-grow-soft p-5">
              <Award size={20} className="mt-0.5 shrink-0 text-grow" />
              <div>
                <h3 className="font-display font-extrabold text-grow">Try Another Way</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  Earned by finding a second route to an answer — never by making mistakes.
                </p>
              </div>
            </Card>
          </Link>
        </aside>
      </main>
    </div>
  );
}
