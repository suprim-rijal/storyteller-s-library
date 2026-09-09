import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";

export const Route = createFileRoute("/adult/consent")({
  head: () => ({
    meta: [
      { title: "Grown-up setup and consent — Nepali Kids" },
      {
        name: "description",
        content:
          "Guardians choose microphone, voice recording, class join and reminder settings. Everything is off until chosen.",
      },
      { property: "og:title", content: "Grown-up setup and consent — Nepali Kids" },
      {
        property: "og:description",
        content: "Explicit, revocable consent for microphone, recording, class and reminders.",
      },
    ],
  }),
  component: Consent,
});

const items = [
  {
    id: "mic",
    title: "Microphone for speaking practice",
    body: "Push-to-talk only, up to 10 seconds. Speech is coaching feedback and never blocks progress or lowers a score.",
  },
  {
    id: "recording",
    title: "Keep voice recordings",
    body: "Off by default. When off, audio is deleted right after the sound check. Recordings are never used for training.",
  },
  {
    id: "class",
    title: "Join a teacher's class",
    body: "A class code links the child to one teacher. Children cannot message each other freely; sharing is teacher-moderated.",
  },
  {
    id: "reminders",
    title: "Gentle reminders",
    body: "At most one a day, sent to you — never streak-shaming the child.",
  },
];

function Consent() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Badge tone="dream">For grown-ups</Badge>
      <h1 className="mt-3 flex items-center gap-2 font-display text-3xl font-extrabold">
        <ShieldCheck size={26} className="text-dream" /> Your choices, always changeable
      </h1>
      <p className="mt-2 text-ink-soft">
        Nothing below is on until you turn it on, and you can turn any of it off later from the
        parent portal. Learning works fully with all of it off.
      </p>

      <div className="mt-6 grid gap-4">
        {items.map((i) => (
          <Card key={i.id} className="flex items-start gap-4 p-5">
            <input
              id={i.id}
              type="checkbox"
              checked={!!on[i.id]}
              onChange={(e) => setOn((s) => ({ ...s, [i.id]: e.target.checked }))}
              className="mt-1 h-6 w-6 shrink-0"
            />
            <label htmlFor={i.id} className="min-w-0">
              <span className="block font-display text-lg font-extrabold">{i.title}</span>
              <span className="block text-sm text-ink-soft">{i.body}</span>
            </label>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-display text-lg font-extrabold">What we never do</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li>No adverts, no third-party ad tracking, no selling data.</li>
          <li>No public profiles, no child-to-child free messaging, no leaderboards.</li>
          <li>No hearts, lives, energy, timers, loot boxes or paying to recover progress.</li>
          <li>No inferring a child's caste, ethnicity, religion or immigration status.</li>
        </ul>
        <Button variant="grow" className="mt-5" onClick={() => navigate({ to: "/kid/ready" })}>
          Save and hand the tablet back →
        </Button>
      </Card>
    </main>
  );
}
