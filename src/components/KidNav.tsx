import { Link } from "@tanstack/react-router";
import { Compass, Sprout, GraduationCap, Gem, Smile, Lock } from "lucide-react";
import { Badge, cn } from "@/design-system/nepali-kids";

const tabs = [
  { to: "/kid/home", label: "Journey", icon: Compass, count: null },
  { to: "/kid/practice", label: "Practice Garden", icon: Sprout, count: 12 },
  { to: "/kid/class", label: "Class", icon: GraduationCap, count: null },
  { to: "/kid/treasures", label: "Treasures", icon: Gem, count: 3 },
  { to: "/kid/me", label: "Me", icon: Smile, count: null },
] as const;

export function KidNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 lg:px-8">
        <div className="flex min-w-0 items-center gap-6">
          <Link to="/kid/home" className="flex shrink-0 items-center gap-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-language text-lg font-bold text-white">
              ने
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg font-extrabold leading-tight text-language">
                Nepali Kids
              </span>
              <span className="block text-[10px] text-ink-soft">नेपाली नानीहरू</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {tabs.map(({ to, label, icon: Icon, count }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex items-center gap-2 rounded-full border-2 border-transparent px-4 py-2 text-sm font-bold text-ink-soft transition hover:text-ink",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language",
                )}
                activeProps={{
                  className: "border-language bg-language-soft !text-language",
                }}
              >
                <Icon size={16} className="shrink-0" />
                {label}
                {count ? <Badge tone="sun">{count}</Badge> : null}
              </Link>
            ))}
          </nav>
        </div>

        <Link
          to="/adult/dashboard"
          className="flex shrink-0 items-center gap-2 rounded-full border-2 border-dream px-4 py-2 text-sm font-bold text-dream transition hover:bg-dream-soft"
        >
          <Lock size={15} /> For Parents
        </Link>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
        {tabs.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-transparent px-3 py-1.5 text-xs font-bold text-ink-soft"
            activeProps={{ className: "border-language bg-language-soft !text-language" }}
          >
            <Icon size={14} /> {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
