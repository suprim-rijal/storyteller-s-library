import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BarChart3, Lock, RotateCcw } from "lucide-react";
import { Badge, Button, Card, Dialog, DialogContent, DialogDescription, DialogTitle, StatCard, Tabs, TabsContent, TabsList, TabsTrigger } from "@/design-system/nepali-kids";
import { trackProgress, useProgress } from "@/lib/progress";
import { isParentModeUnlocked } from "@/lib/preferences";
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

function ParentPortal() {
  const { state, reset } = useProgress();
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  useEffect(() => { if (!isParentModeUnlocked()) navigate({ to: "/kid/home", replace: true }); }, [navigate]);
  const lp = trackProgress(state, "language");
  const cp = trackProgress(state, "culture");
  const lessons = lp.doneLessons + cp.doneLessons;
  const milestones = [
    { skill: "Listening", detail: "Recognizing Nepali sounds", state: lessons > 5 ? "Blossoming" : lessons ? "Growing" : "Seed", tone: lessons > 5 ? "grow" : "language" },
    { skill: "Reading", detail: "Connecting letters and words", state: lp.doneLessons > 3 ? "Blossoming" : lp.doneLessons ? "Growing" : "Seed", tone: lp.doneLessons > 3 ? "grow" : "language" },
    { skill: "Culture", detail: "Discovering places and traditions", state: cp.doneLessons > 3 ? "Blossoming" : cp.doneLessons ? "Growing" : "Seed", tone: cp.doneLessons > 3 ? "grow" : "culture" },
  ] as const;
  const recentDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return { label: date.toLocaleDateString(undefined, { weekday: "narrow" }), active: state.rhythmDays.includes(key) };
  });
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
        <Tabs defaultValue="overview">
          <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="history">Progress history</TabsTrigger><TabsTrigger value="controls">Controls</TabsTrigger></TabsList>
          <TabsContent value="overview">
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
                    <p className="mt-1 text-[10px] text-ink-soft">Based on saved learning</p>
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

          </TabsContent>
          <TabsContent value="history">
            <Card className="mt-5 p-6"><h2 className="flex items-center gap-2 text-xl font-extrabold"><BarChart3 className="text-language" />Learning history</h2><p className="mt-1 text-sm text-ink-soft">A calm view of activity across recent learning days.</p><div className="mt-8 flex h-48 items-end gap-3" aria-label={`${state.rhythmDays.length} active learning days`}>
              {recentDays.map((day) => <div key={day.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full rounded-t-xl bg-language-soft" style={{ height: day.active ? "82%" : "12%" }}><div className="h-full w-full rounded-t-xl bg-language opacity-75" /></div><span className="text-xs font-bold text-ink-soft">{day.label}</span></div>)}
            </div><p className="mt-5 text-sm text-ink-soft">Current module: {lp.doneLessons < lp.lessons ? "Nepali Language" : "Discover Nepal"}. {lessons} lessons completed across {state.rhythmDays.length} learning days.</p></Card>
          </TabsContent>
          <TabsContent value="controls">
            <Card className="mt-5 p-6"><h2 className="text-xl font-extrabold">Parent-only controls</h2><p className="mt-2 text-sm text-ink-soft">Resetting removes this learner's local lesson history, XP, badges, and review queue.</p><Button variant="outline" className="mt-5 border-culture text-culture" onClick={() => setResetOpen(true)}><RotateCcw size={17} />Reset learning progress</Button></Card>
          </TabsContent>
        </Tabs>
      </main>
      <Dialog open={resetOpen} onOpenChange={setResetOpen}><DialogContent><DialogTitle className="pr-10 text-2xl font-extrabold">Reset all progress?</DialogTitle><DialogDescription className="mt-2 text-sm text-ink-soft">This cannot be undone. Type RESET to confirm.</DialogDescription><input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="mt-5 h-12 w-full rounded-xl border-2 border-line px-4 outline-none focus:border-culture" /><Button fullWidth variant="culture" className="mt-4" disabled={confirmText !== "RESET"} onClick={() => { reset(); setResetOpen(false); setConfirmText(""); }}>Reset progress</Button></DialogContent></Dialog>
    </div>
  );
}
