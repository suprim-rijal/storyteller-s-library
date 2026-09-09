import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare, ShieldCheck, Users } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";

export const Route = createFileRoute("/kid/class")({
  head: () => ({
    meta: [
      { title: "Class — Nepali Kids" },
      {
        name: "description",
        content:
          "Teacher quests, moderated sharing and a class garden. No free child-to-child messaging.",
      },
      { property: "og:title", content: "Class — Nepali Kids" },
      { property: "og:description", content: "The moderated classroom space." },
    ],
  }),
  component: KidClass,
});

const quests = [
  {
    title: "Say namaste to a family member",
    body: "Record or tell your teacher how it went. Teacher reviews before anything is shared.",
    status: "Open",
  },
  {
    title: "Draw one thing you saw with a Devanagari label",
    body: "Your drawing joins the class garden once your teacher approves it.",
    status: "Waiting for teacher",
  },
  {
    title: "Bring one question about a festival",
    body: "Questions are answered together, and every answer includes “families may do this differently”.",
    status: "Open",
  },
];

function KidClass() {
  return (
    <div className="min-h-screen">
      <KidNav />
      <main className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
        <h1 className="font-display text-3xl font-extrabold">My class</h1>
        <p className="mt-2 text-ink-soft">
          Class 4B with Miss Sunita. You can send work to your teacher — you cannot message other
          children, and nobody is ranked against anybody.
        </p>

        <div className="mt-6 grid gap-4">
          {quests.map((q) => (
            <Card key={q.title} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={q.status === "Open" ? "grow" : "sun"}>{q.status}</Badge>
                <Badge tone="neutral">Teacher quest</Badge>
              </div>
              <h2 className="mt-2 font-display text-lg font-extrabold">{q.title}</h2>
              <p className="mt-1 text-sm text-ink-soft">{q.body}</p>
              <Button variant="quiet" size="sm" className="mt-4">
                Send to my teacher →
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
              <Users size={18} className="text-language" /> Class garden
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              The garden grows from everyone's effort together. There is no “best” flower and no
              child is compared to another.
            </p>
          </Card>
          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
              <ShieldCheck size={18} className="text-dream" /> Safety here
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
              <li>Everything shared is reviewed by your teacher first.</li>
              <li>Report a problem in one tap; a grown-up sees it.</li>
              <li>
                <MessagesSquare size={13} className="inline" /> No open chat between children.
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
