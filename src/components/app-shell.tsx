import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Apple,
  CalendarDays,
  Dumbbell,
  Flame,
  LayoutGrid,
  LineChart,
  ListChecks,
  Moon,
  Settings,
  ShoppingBasket,
  Sparkles,
  Sun,
  Leaf,
  Repeat,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { greeting, useStore } from "@/lib/store";

const NAV = [
  { to: "/today", label: "Today", icon: LayoutGrid },
  { to: "/nutrition", label: "Nutrition", icon: Apple },
  { to: "/planner", label: "Meal planner", icon: CalendarDays },
  { to: "/coach", label: "Coach", icon: Sparkles },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/exercises", label: "Exercises", icon: Repeat },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/grocery", label: "Grocery", icon: ShoppingBasket },
  { to: "/profile", label: "Profile", icon: Settings },
] as const;

const MOBILE_NAV = [
  { to: "/today", label: "Today", icon: LayoutGrid },
  { to: "/nutrition", label: "Food", icon: Apple },
  { to: "/workouts", label: "Train", icon: Dumbbell },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/profile", label: "You", icon: Settings },
] as const;

export function ThemeToggle() {
  const { state, update } = useStore();
  const dark = state.theme === "dark";
  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => update((s) => ({ ...s, theme: dark ? "light" : "dark" }))}
      className="press grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
    >
      {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
    </button>
  );
}

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const { state, streak, level, hydrated } = useStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (hydrated && !state.onboarded) navigate({ to: "/onboarding" });
  }, [hydrated, state.onboarded, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Link to="/" className="flex items-center gap-2.5 px-2">
          <span className="gradient-fresh grid h-9 w-9 place-items-center rounded-xl text-primary-foreground shadow-glow">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">Vitl</span>
        </Link>

        <nav className="mt-8 flex-1 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                )}
              >
                <item.icon className={cn("h-4.5 w-4.5", active && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="surface-card mt-4 p-4">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Level {level.level}</span>
            <span className="text-primary">{level.label}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="gradient-fresh h-full rounded-full transition-[width] duration-700"
              style={{ width: `${level.progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {100 - level.progress}% to your next level
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-xl">
          <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-6">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold tracking-widest uppercase text-primary">
                {title ?? greeting(state.profile.name)}
              </p>
              <h1 className="truncate text-lg font-bold sm:text-xl">
                {subtitle ?? "Let's make today count"}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold">
                <Flame className="h-4 w-4 text-flame" />
                <span className="tabular-nums">{streak}</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pt-5 pb-28 sm:px-6 lg:pb-12">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {MOBILE_NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "press flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-12 place-items-center rounded-full transition-colors",
                    active && "bg-primary/12",
                  )}
                >
                  <item.icon className="h-4.5 w-4.5" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}