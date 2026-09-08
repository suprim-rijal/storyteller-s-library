import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import langArt from "@/assets/illustrations/track-language.jpg";
import cultureArt from "@/assets/illustrations/track-culture.jpg";

export const Route = createFileRoute("/kid/tracks")({
  head: () => ({
    meta: [
      { title: "Choose Your Adventure Path — Nepali Kids" },
      {
        name: "description",
        content:
          "Pick between the Nepali Language course and the Discover Nepal culture course.",
      },
      { property: "og:title", content: "Choose Your Adventure Path" },
      {
        property: "og:description",
        content: "Two separate tracks: Nepali language and Nepali culture.",
      },
    ],
  }),
  component: Tracks,
});

const tracks = [
  {
    id: "language",
    accent: "language" as const,
    art: langArt,
    tag: "भाषा · LANGUAGE",
    title: "नेपाली भाषा / Nepali Language",
    body: "Learn the enchanting sounds of Devanagari. Build words, trace vowels, and learn to speak with local hill birds!",
    chapter: "Chapter 2: Vowels of the Valley",
    chapterMark: "क",
    goals: [
      "12 foundational vowels & speech tones",
      "Recognizing characters by shape",
      "Singing vowel songs with Yaju",
    ],
    cta: "Explore Sounds →",
  },
  {
    id: "culture",
    accent: "culture" as const,
    art: cultureArt,
    tag: "थाहा · CULTURE",
    title: "नेपाल चिनौँ / Discover Nepal",
    body: "Embark on a magnificent tour. Explore traditional arts, climb historic temples, and discover native animals of the Himalayas.",
    chapter: "Chapter 1: Kathmandu Courtyards",
    chapterMark: "🏛",
    goals: [
      "Durbar Square architecture & history",
      "Greeting elders (Namaste gestures)",
      "Making traditional festival lamps",
    ],
    cta: "Begin Voyage →",
  },
];

function Tracks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <h1 className="text-center font-display text-3xl font-extrabold sm:text-4xl">
          Choose Your Adventure Path
        </h1>
        <p className="mt-2 text-center text-ink-soft">
          Where would you like to travel today? Yaju is ready for both paths!
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {tracks.map((t) => (
            <Card
              key={t.id}
              accent={t.accent}
              bold
              className="flex cursor-pointer flex-col p-5 transition duration-200 hover:scale-[1.02] hover:shadow-lg"
              onClick={() => navigate({ to: "/kid/track/$trackId/map", params: { trackId: t.id } })}
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={t.art}
                  alt=""
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="h-48 w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-bold text-ink-soft">
                  {t.tag}
                </span>
              </div>

              <h2 className="mt-5 font-display text-2xl font-extrabold">{t.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{t.body}</p>

              <div
                className={
                  t.accent === "language"
                    ? "mt-5 flex items-center gap-3 rounded-2xl bg-language-soft p-3"
                    : "mt-5 flex items-center gap-3 rounded-2xl bg-culture-soft p-3"
                }
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface font-bold">
                  {t.chapterMark}
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                    Current chapter
                  </span>
                  <span
                    className={
                      t.accent === "language"
                        ? "block text-sm font-bold text-language"
                        : "block text-sm font-bold text-culture"
                    }
                  >
                    {t.chapter}
                  </span>
                </span>
              </div>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                What we will master:
              </p>
              <ul className="mt-2 space-y-2">
                {t.goals.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-grow" />
                    {g}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Button variant={t.accent} size="lg" fullWidth>
                  {t.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-ink-soft">
          <Badge tone="grow">No hearts · No timers</Badge>
        </p>
      </main>
    </div>
  );
}
