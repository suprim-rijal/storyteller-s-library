import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/kid/setup/theme")({
  head: () => ({
    meta: [
      { title: "Continue setup | RootBridge" },
      {
        name: "description",
        content:
          "Continue RootBridge learner setup with a grown-up.",
      },
      { property: "og:title", content: "Continue setup | RootBridge" },
      { property: "og:description", content: "Continue RootBridge learner setup." },
    ],
  }),
  component: () => <Navigate to="/adult/consent" replace />,
});
