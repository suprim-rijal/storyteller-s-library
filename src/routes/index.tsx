import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, BookOpen, Mountain } from "lucide-react";
import { Button, Card } from "@/design-system/nepali-kids";
import yak from "@/assets/illustrations/yak-mascot.png";
import mountains from "@/assets/illustrations/mountain-trail-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nepali Kids — Learn Nepali language and culture, gently" },
      {
        name: "description",
        content:
          "A stress-free Nepali language and culture journey for children aged 4-12. No hearts, no timers, endless retries.",
      },
      { property: "og:title", content: "Nepali Kids" },
      {
        property: "og:description",
        content: "Learn Nepali language and culture, gently. Ages 4-12.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main id="start" className="min-h-screen">
      <section className="relative overflow-hidden">
        <img
          src={mountains}
          alt=""
          width={1536}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-surface/80 px-4 py-1.5 text-xs font-bold text-language">
              <Sparkles size={14} /> नेपाली नानीहरू · Ages 4–12
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-ink sm:text-6xl">
              Climb into Nepali,
              <br />
              one gentle step at a time.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              Two parallel paths — नेपाली भाषा for language and नेपाल चिनौँ for
              culture. No hearts, no timers, no leaderboards. Children may retry
              as often as they like.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/kid/welcome">
                <Button size="lg">Start Learning →</Button>
              </Link>
              <Link to="/kid/home">
                <Button size="lg" variant="quiet">
                  Continue my journey
                </Button>
              </Link>
              <Link to="/adult/dashboard">
                <Button size="lg" variant="outline">
                  I'm a parent
                </Button>
              </Link>
            </div>
          </div>
          <img
            src={yak}
            alt="Yaju the yak, the Nepali Kids mascot"
            width={768}
            height={768}
            className="mx-auto w-64 drop-shadow-xl sm:w-80"
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 sm:grid-cols-3">
        {[
          {
            icon: BookOpen,
            title: "Systematic language path",
            body: "Explicit, cumulative phonics from Devanagari vowels upward, CEFR-informed can-do outcomes.",
          },
          {
            icon: Mountain,
            title: "Culture, kept separate",
            body: "Festivals, temples and traditions live on their own non-hierarchical track — never blurred with grammar.",
          },
          {
            icon: Sparkles,
            title: "Pressure-free by design",
            body: "Errors trigger instruction, not scarcity. Speech recognition coaches, it never gates progress.",
          },
        ].map(({ icon: Icon, title, body }) => (
          <Card key={title} className="p-6">
            <Icon className="text-language" size={26} />
            <h2 className="mt-3 font-display text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{body}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
