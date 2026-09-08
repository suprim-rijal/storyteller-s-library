import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";
import yak from "@/assets/illustrations/yak-mascot.png";

export const Route = createFileRoute("/kid/me")({
  head: () => ({
    meta: [
      { title: "Me — Nepali Kids" },
      {
        name: "description",
        content: "Your avatar, your theme and your learning pace.",
      },
      { property: "og:title", content: "Me — Nepali Kids" },
      { property: "og:description", content: "Avatar and theme settings." },
    ],
  }),
  component: () => (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-extrabold">Me</h1>
        <Card className="mt-6 flex items-center gap-5 p-6">
          <img
            src={yak}
            alt="Aarav's avatar"
            loading="lazy"
            width={768}
            height={768}
            className="h-20 w-20 rounded-2xl bg-canvas object-contain p-1"
          />
          <div>
            <p className="font-display text-xl font-extrabold">Aarav</p>
            <p className="text-sm text-ink-soft">Theme: Mountain Sky · Pace: Gentle</p>
          </div>
        </Card>
      </main>
    </div>
  ),
});
