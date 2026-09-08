import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";

export const Route = createFileRoute("/kid/treasures")({
  head: () => ({
    meta: [
      { title: "Treasures — Nepali Kids" },
      {
        name: "description",
        content: "Badges, seals and patches collected along the Nepali Kids journey.",
      },
      { property: "og:title", content: "Treasures — Nepali Kids" },
      { property: "og:description", content: "Your collected badges and seals." },
    ],
  }),
  component: () => (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-display text-3xl font-extrabold">Treasures</h1>
        <p className="mt-2 text-ink-soft">Everything you have earned so far.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { name: "Hill Greetings Seal", got: true },
            { name: "Vowel Sprout", got: true },
            { name: "Rhino Explorer Patch", got: false },
          ].map((t) => (
            <Card key={t.name} className="p-5 text-center">
              <span className="text-3xl">{t.got ? "🏅" : "🔒"}</span>
              <p className="mt-2 font-bold">{t.name}</p>
              <p className="text-xs text-ink-soft">{t.got ? "Earned" : "Keep going!"}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  ),
});
