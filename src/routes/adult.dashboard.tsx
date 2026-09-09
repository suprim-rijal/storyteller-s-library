import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Badge, Button, Card, StatCard } from "@/design-system/nepali-kids";
import { trackProgress, useProgress } from "@/lib/progress";
import selRoti from "@/assets/illustrations/sel-roti.jpg";

export const Route = createFileRoute("/adult/dashboard")({
  head: () => ({
    meta: [
      { title: "Parent Portal — Nepali Kids" },
      {
        name: "description",
        content:
          "Calm progress overview for parents: learning days, play time and CEFR-informed development milestones.",
      },
      { property: "og:title", content: "Parent Portal — Nepali Kids" },
      {
        property: "og:description",
        content: "Stress-free development and milestones, with no ranking.",
      },
    ],
  }),
  component: ParentPortal,
});

const milestones = [
  { skill: "Listening", detail: "Recognizing tones & bird sounds", state: "Growing", tone: "language", date: "Jan 12" },
  { skill: "Speaking", detail: "Greeting gestures & basic pronouns", state: "Blossoming", tone: "grow", date: "Jan 14" },
  { skill: "Reading", detail: "Vowel characters & word linkage", state: "Growing", tone: "language", date: "Jan 10" },
  { skill: "Writing", detail: "Devanagari letter trails", state: "Seed", tone: "sun", date: "Jan 05" },
  { skill: "Culture", detail: "Temples & Himalayan wildlife", state: "Blossoming", tone: "culture", date: "Jan 15" },
] as const;

function ParentPortal() {
  const { state } = useProgress();
  const lp = trackProgress(state, "language");
  const cp = trackProgress(state, "culture");
  const lessons = lp.doneLessons + cp.doneLessons;
  return (
    <div className="min-h-screen bg-white">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-line bg-white px-4 py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-dream-soft text-dream">
            <Lock size={16} />
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-extrabold">
              Nepali Kids Parent Portal
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
              Stress-free development and milestones
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden text-sm text-ink-soft sm:inline">{state.name}'s path</span>
          <Link
            to="/kid/home"
            className="rounded-lg bg-language px-4 py-2 text-sm font-bold text-white hover:bg-language/90"
          >
            Switch to Student Mode →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <StatCard
                label="Learning days"
                value={`${state.rhythmDays.length} days`}
                hint="Rest days are expected"
              />
              <StatCard
                label="Modules mastered"
                value={`${lp.mastered + cp.mastered}`}
                hint={`${lp.mastered} language · ${cp.mastered} culture`}
              />
              <StatCard
                label="Lessons experienced"
                value={`${lessons} steps`}
                hint="Completion is not mastery"
              />
            </div>

            <Card className="p-6">
              <h2 className="font-display text-xl font-extrabold">
                Weekly offline connection
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Reinforce what Aarav is learning with this traditional hands-on
                offline recipe!
              </p>
              <div className="mt-5 flex items-start gap-4 rounded-2xl bg-sun-soft p-4">
                <img
                  src={selRoti}
                  alt="A plate of sel roti"
                  loading="lazy"
                  width={640}
                  height={640}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <h3 className="font-bold">Family Sel Roti Baking!</h3>
                  <p className="text-sm text-ink-soft">
                    Aarav learned the vowel 'अ' and 'आम' (Mango) this week. Bake
                    traditional rice-flour donuts together to celebrate!
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="font-display text-xl font-extrabold">
              Development Milestones
            </h2>
            <ul className="mt-4 divide-y divide-line">
              {milestones.map((m) => (
                <li
                  key={m.skill}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-bold">{m.skill}</p>
                    <p className="text-xs text-ink-soft">{m.detail}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Badge tone={m.tone}>{m.state}</Badge>
                    <p className="mt-1 text-[10px] text-ink-soft">Verified {m.date}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink-soft">
              States follow a CEFR-informed scale. Nepali Kids never ranks children
              against one another.
            </p>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="font-display text-xl font-extrabold">Controls</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>Microphone and voice recording: off unless you turn them on.</li>
              <li>Daily session reminder: at most one, sent to you, never to the child.</li>
              <li>Class link: one teacher, revocable at any time.</li>
              <li>Content and reading level follow the chosen age band, not a test score.</li>
            </ul>
            <Link to="/adult/consent" className="mt-4 inline-block">
              <Button variant="outline" size="sm">
                Review consent settings →
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-xl font-extrabold">Privacy</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>No ads, no ad tracking, no selling data, no public profiles.</li>
              <li>Learning records are pseudonymous and kept apart from your contact details.</li>
              <li>Audio is deleted after the sound check unless you asked us to keep it.</li>
              <li>You can export or delete everything, and deletion is confirmed to you.</li>
              <li>We never infer or store a child's caste, ethnicity, religion or status.</li>
            </ul>
            <p className="mt-4 text-xs text-ink-soft">
              Culture content is reviewed by community readers, always shows more than one
              perspective, and has a correction pathway if something looks wrong to you.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
