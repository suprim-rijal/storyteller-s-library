import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Globe, Sprout, Award } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import yak from "@/assets/illustrations/yak-mascot.png";

export const Route = createFileRoute("/kid/home")({
  head: () => ({
    meta: [
      { title: "Journey — Nepali Kids" },
      {
        name: "description",
        content:
          "Aarav's learning hub: current lesson, language and culture progress, and the Practice Garden.",
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

const week = [
  { day: "M", done: true },
  { day: "T", done: false },
  { day: "W", done: true },
  { day: "T", done: false },
  { day: "F", done: true },
  { day: "S", done: false },
  { day: "S", done: false },
];

function KidHome() {
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
                Ready to climb the Vowel Peak today, Aarav?
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                Yaju the Yak is packing our bags for the trip. We have 12 review
                seeds waiting for warm mountain rain!
              </p>
            </div>
          </Card>

          <Card className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-culture-soft font-display text-3xl font-extrabold text-culture">
                अ
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-culture">
                  Current lesson
                </p>
                <h2 className="font-display text-xl font-extrabold">
                  Sweet Vowels: Meet 'अ' (Ah)
                </h2>
                <p className="text-sm text-ink-soft">
                  Chapter 2: Mountain Soundscapes · 4 mins left
                </p>
              </div>
            </div>
            <Link to="/kid/lesson/$lessonId" params={{ lessonId: "vowel-a" }}>
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
                <span>3 / 8 Chapters</span>
              </div>
              <ProgressBar className="mt-2" value={3} max={8} tone="language" label="Language chapters" />
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-extrabold">Discover Nepal</h3>
                <Globe size={18} className="shrink-0 text-culture" />
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                Culture, custom, nature and majestic monuments
              </p>
              <div className="mt-4 flex items-center justify-between text-xs font-bold text-ink-soft">
                <span>CULTURE DISCOVERIES</span>
                <span>1 / 6 Chapters</span>
              </div>
              <ProgressBar className="mt-2" value={1} max={6} tone="culture" label="Culture chapters" />
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
              Your hard-earned lesson seeds are waiting to turn into vibrant
              blossoms!
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold">
              <span className="font-display text-2xl text-sun">12</span> Review seeds
              waiting for water
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
              You did wonderful learning on 3 days this week! No stress, play at
              your mountain pace.
            </p>
            <ul className="mt-4 flex justify-between">
              {week.map(({ day, done }, i) => (
                <li key={i} className="flex flex-col items-center gap-1.5">
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
                  <span className="text-[10px] font-bold text-ink-soft">{day}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card accent="grow" bold className="flex items-start gap-3 bg-grow-soft p-5">
            <Award size={20} className="mt-0.5 shrink-0 text-grow" />
            <div>
              <h3 className="font-display font-extrabold text-grow">
                Rhino Explorer Patch
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                Unlock by completing Chapter 2's cultural trail!
              </p>
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}
