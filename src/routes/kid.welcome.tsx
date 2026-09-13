import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import yak from "@/assets/illustrations/yak-mascot.png";

export const Route = createFileRoute("/kid/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome. Nepali Kids" },
      {
        name: "description",
        content:
          "A short, calm welcome from the learning guide before choosing a name, guide and theme.",
      },
      { property: "og:title", content: "Welcome. Nepali Kids" },
      { property: "og:description", content: "The child's first screen after signing in." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <main className="grid min-h-screen place-items-center bg-language-soft px-4 py-12">
      <Card accent="language" bold className="max-w-xl p-8 text-center">
        <img
          src={yak}
          alt="Yaju the yak waving"
          width={768}
          height={768}
          className="mx-auto h-40 w-40 object-contain"
        />
        <Badge tone="sun">नमस्ते</Badge>
        <h1 className="mt-3 font-display text-3xl font-extrabold">
          Namaste! I am Yaju, and I will climb with you.
        </h1>
        <p className="mt-3 text-ink-soft">
          Here you will learn Nepali sounds and letters, and you will discover Nepal. its places,
          people and celebrations. There are no lives, no timers and no leaderboards. You can try
          anything as many times as you like.
        </p>
        <Link to="/kid/setup/guide" className="mt-6 inline-block">
          <Button variant="grow" size="lg">
            Let's begin →
          </Button>
        </Link>
        <p className="mt-4 text-xs text-ink-soft">
          A grown-up sets up the account, then this space is yours.
        </p>
      </Card>
    </main>
  );
}
