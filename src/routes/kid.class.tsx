import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";

export const Route = createFileRoute("/kid/class")({
  head: () => ({
    meta: [
      { title: "Class — Nepali Kids" },
      {
        name: "description",
        content: "Assignments from your teacher and safe homework submissions.",
      },
      { property: "og:title", content: "Class — Nepali Kids" },
      { property: "og:description", content: "Teacher assignments and homework." },
    ],
  }),
  component: () => (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-extrabold">Class</h1>
        <p className="mt-2 text-ink-soft">
          Assignments from Sunita Miss and safe audio homework will appear here.
        </p>
        <Card className="mt-6 p-6">
          <p className="font-bold">No assignments right now</p>
          <p className="mt-1 text-sm text-ink-soft">
            Your teacher hasn't sent anything yet. Enjoy the Practice Garden meanwhile!
          </p>
        </Card>
      </main>
    </div>
  ),
});
