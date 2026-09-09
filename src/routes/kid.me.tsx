import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Button, Card, ProgressBar } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import { ageBands, themes } from "@/data/curriculum";
import { levelFromXp, useProgress } from "@/lib/progress";
import yak from "@/assets/illustrations/yak-mascot.png";

export const Route = createFileRoute("/kid/me")({
  head: () => ({
    meta: [
      { title: "Me — Nepali Kids" },
      {
        name: "description",
        content:
          "Your name, guide, theme, romanization and calm mode — plus your level and rhythm days.",
      },
      { property: "og:title", content: "Me — Nepali Kids" },
      { property: "og:description", content: "Avatar, theme and learning-pace settings." },
    ],
  }),
  component: Me,
});

function Me() {
  const { state, update, reset } = useProgress();
  const level = levelFromXp(state.xp);
  const nextLevelXp = Math.round(100 * Math.pow(level + 1, 1.35));
  const band = ageBands.find((b) => b.id === state.ageBand) ?? ageBands[1]!;

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold">Me</h1>

        <Card accent="language" bold className="mt-6 flex flex-wrap items-center gap-5 p-6">
          <img
            src={yak}
            alt={`${state.name}'s guide`}
            loading="lazy"
            width={768}
            height={768}
            className="h-24 w-24 rounded-2xl bg-canvas object-contain p-1"
          />
          <div className="min-w-0 flex-1">
            <p className="font-display text-2xl font-extrabold">{state.name}</p>
            <p className="text-sm text-ink-soft">
              {band.name} · ages {band.ages} · {band.session}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-ink-soft">
              <span>LEVEL {level}</span>
              <span>
                {state.xp} / {nextLevelXp} XP
              </span>
            </div>
            <ProgressBar
              className="mt-1"
              value={state.xp}
              max={nextLevelXp}
              tone="sun"
              label="Level progress"
            />
          </div>
        </Card>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Card className="p-5">
            <h2 className="font-display text-lg font-extrabold">My theme</h2>
            <div className="mt-3 grid gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => update({ theme: t.id })}
                  aria-pressed={state.theme === t.id}
                  className={
                    "rounded-2xl border-2 p-3 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language " +
                    (state.theme === t.id ? "border-culture bg-culture-soft" : "border-line")
                  }
                >
                  <span className="block font-bold">{t.name}</span>
                  <span className="block text-xs text-ink-soft">{t.desc}</span>
                </button>
              ))}
            </div>
          </Card>

          <div className="grid content-start gap-5">
            <Card className="p-5">
              <h2 className="font-display text-lg font-extrabold">How I like to learn</h2>
              <label className="mt-3 flex items-center gap-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={state.romanization}
                  onChange={(e) => update({ romanization: e.target.checked })}
                  className="h-5 w-5"
                />
                Show romanization
              </label>
              <label className="mt-2 flex items-center gap-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={state.reducedMotion}
                  onChange={(e) => update({ reducedMotion: e.target.checked })}
                  className="h-5 w-5"
                />
                Calm mode: less motion and sound
              </label>
              <p className="mt-3 text-xs text-ink-soft">
                Audio can always be slowed, and every listening task has a written or tap-based
                alternative.
              </p>
            </Card>

            <Card className="p-5">
              <h2 className="font-display text-lg font-extrabold">My rhythm</h2>
              <p className="mt-2 text-sm text-ink-soft">
                You have learned on {state.rhythmDays.length} day
                {state.rhythmDays.length === 1 ? "" : "s"} so far. Rest days are part of the plan —
                nothing is ever lost.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="grow">{state.completedLessons.length} lessons experienced</Badge>
                <Badge tone="sun">{state.masteredModules.length} modules mastered</Badge>
              </div>
            </Card>

            <Card className="p-5">
              <h2 className="font-display text-lg font-extrabold">Start again</h2>
              <p className="mt-2 text-sm text-ink-soft">
                This clears the practice memory saved on this device only.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="outline" size="sm" onClick={reset}>
                  Clear my progress
                </Button>
                <Link to="/kid/welcome">
                  <Button variant="quiet" size="sm">
                    Redo setup
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
