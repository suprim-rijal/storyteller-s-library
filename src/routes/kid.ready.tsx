import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { useProgress } from "@/lib/progress";
import yak from "@/assets/illustrations/yak-mascot.png";

export const Route = createFileRoute("/kid/ready")({
  head: () => ({
    meta: [
      { title: "You're ready — Nepali Kids" },
      {
        name: "description",
        content: "Setup is complete. Start with the first language module or explore Nepal first.",
      },
      { property: "og:title", content: "You're ready — Nepali Kids" },
      { property: "og:description", content: "The handoff screen at the end of setup." },
    ],
  }),
  component: Ready,
});

function Ready() {
  const { state, update } = useProgress();

  return (
    <main className="grid min-h-screen place-items-center bg-grow-soft px-4 py-12">
      <Card accent="grow" bold className="max-w-xl p-8 text-center">
        <img
          src={yak}
          alt=""
          width={768}
          height={768}
          className="mx-auto h-32 w-32 object-contain"
        />
        <Badge tone="grow">All set</Badge>
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          Ready when you are, {state.name}!
        </h1>
        <p className="mt-3 text-ink-soft">
          Two paths are open: Nepali language and Discover Nepal. They stay separate, so you can
          walk them at different speeds.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/kid/tracks" onClick={() => update({ onboarded: true })}>
            <Button variant="grow" size="lg">
              Choose my path →
            </Button>
          </Link>
          <Link to="/kid/home" onClick={() => update({ onboarded: true })}>
            <Button variant="outline" size="lg">
              Go to my journey
            </Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
