import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Clock, Dumbbell, Flame } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Chip, SectionTitle, StatCard } from "@/components/vitals";
import { EXERCISES, WORKOUTS } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/workouts")({
  head: () => ({
    meta: [
      { title: "Workout plans — Vitl" },
      {
        name: "description",
        content:
          "Browse strength, conditioning and mobility sessions, then train along with a guided player and rest timer.",
      },
      { property: "og:title", content: "Workout plans — Vitl" },
      { property: "og:description", content: "Guided sessions for strength, cardio and mobility." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkoutsLayout,
});

const FOCUS = ["All", "Full body", "Push & pull", "Legs & glutes", "Conditioning", "Core", "Cardio"];

function WorkoutsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/workouts") return <Outlet />;
  return <WorkoutsList />;
}

function WorkoutsList() {
  const { stats } = useStore();
  const [focus, setFocus] = useState("All");
  const list = WORKOUTS.filter((w) => focus === "All" || w.focus === focus);

  return (
    <AppShell title="Workouts" subtitle="Pick a session and press start">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<Dumbbell className="h-4.5 w-4.5" />}
            label="Sessions done"
            value={`${stats.workouts}`}
          />
          <StatCard
            icon={<Clock className="h-4.5 w-4.5" />}
            label="Minutes trained"
            value={`${stats.minutes}`}
            tone="accent"
          />
          <StatCard
            icon={<Flame className="h-4.5 w-4.5" />}
            label="Plans available"
            value={`${WORKOUTS.length}`}
            tone="flame"
          />
          <StatCard
            icon={<Dumbbell className="h-4.5 w-4.5" />}
            label="Exercises"
            value={`${EXERCISES.length}`}
            tone="water"
          />
        </div>

        <div className="scroll-hide -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {FOCUS.map((f) => (
            <Chip key={f} active={focus === f} onClick={() => setFocus(f)}>
              {f}
            </Chip>
          ))}
        </div>

        <section>
          <SectionTitle title="Your plans" subtitle={`${list.length} sessions match`} />
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((w) => (
              <div key={w.id} className="surface-card hover-lift p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-2xl">
                    {w.emoji}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{w.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {w.focus} · {w.level}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {w.minutes} min · ~{w.kcal} kcal · {w.blocks.length} exercises
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {w.blocks.map((b, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                    >
                      {EXERCISES.find((e) => e.id === b.exerciseId)?.name ?? "Exercise"}
                    </span>
                  ))}
                </div>
                <Button variant="hero" className="mt-4 w-full" asChild>
                  <Link to="/workouts/$workoutId" params={{ workoutId: w.id }}>
                    Start workout
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}