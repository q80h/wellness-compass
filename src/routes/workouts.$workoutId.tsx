import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Pause, Play, SkipForward } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { EmptyState, Ring } from "@/components/vitals";
import { EXERCISES, WORKOUTS } from "@/lib/data";
import { dateKey, useStore } from "@/lib/store";

export const Route = createFileRoute("/workouts/$workoutId")({
  head: () => ({
    meta: [
      { title: "Workout player — Vitl" },
      {
        name: "description",
        content:
          "Train set by set with cues, automatic rest timers and one-tap set logging, then save the session.",
      },
      { property: "og:title", content: "Workout player — Vitl" },
      { property: "og:description", content: "Guided sets, cues and rest timers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkoutPlayer,
});

function WorkoutPlayer() {
  const { workoutId } = Route.useParams();
  const navigate = useNavigate();
  const { updateDay } = useStore();
  const workout = WORKOUTS.find((w) => w.id === workoutId);

  const setList = useMemo(() => {
    if (!workout) return [];
    return workout.blocks.flatMap((b, bi) =>
      Array.from({ length: b.sets }, (_, si) => ({
        key: `${bi}-${si}`,
        blockIndex: bi,
        setIndex: si,
        exerciseId: b.exerciseId,
        reps: b.reps,
        restSec: b.restSec,
      })),
    );
  }, [workout]);

  const [done, setDone] = useState<string[]>([]);
  const [rest, setRest] = useState(0);
  const [resting, setResting] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!resting) return;
    if (rest <= 0) {
      setResting(false);
      return;
    }
    const t = setTimeout(() => setRest((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resting, rest]);

  if (!workout) {
    return (
      <AppShell title="Workout" subtitle="Session not found">
        <EmptyState
          emoji="🤔"
          title="We couldn't find that session"
          body="It may have been renamed. Pick another plan from your workout list."
          action={
            <Button variant="hero" asChild>
              <Link to="/workouts">Back to workouts</Link>
            </Button>
          }
        />
      </AppShell>
    );
  }

  const current = setList.find((s) => !done.includes(s.key));
  const progress = setList.length > 0 ? done.length / setList.length : 0;
  const exercise = current ? EXERCISES.find((e) => e.id === current.exerciseId) : undefined;

  const completeSet = () => {
    if (!current) return;
    setDone((d) => [...d, current.key]);
    setRest(current.restSec);
    setResting(true);
  };

  const finish = () => {
    const minutes = Math.max(1, Math.round(elapsed / 60));
    const share = setList.length > 0 ? done.length / setList.length : 1;
    const kcal = Math.max(20, Math.round(workout.kcal * Math.max(0.25, share)));
    updateDay(dateKey(), (d) => ({
      ...d,
      workouts: [...d.workouts, { workoutId: workout.id, minutes, kcal }],
    }));
    toast.success("Session saved", { description: `${minutes} min · ~${kcal} kcal burned` });
    void navigate({ to: "/today" });
  };

  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AppShell title={workout.name} subtitle={`${workout.focus} · ${workout.minutes} min`}>
      <div className="space-y-5">
        <Button variant="pill" size="sm" asChild>
          <Link to="/workouts">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> All workouts
          </Link>
        </Button>

        <section className="surface-card grid gap-6 p-5 sm:grid-cols-[auto_minmax(0,1fr)]">
          <div className="grid place-items-center">
            <Ring value={done.length} target={Math.max(1, setList.length)} size={150} tone="flame">
              <div className="text-center">
                <div className="font-display text-3xl font-bold tabular-nums">
                  {done.length}/{setList.length}
                </div>
                <div className="text-xs font-medium text-muted-foreground">sets done</div>
                <div className="text-[11px] text-muted-foreground/80">{mmss(elapsed)} elapsed</div>
              </div>
            </Ring>
          </div>
          <div className="min-w-0">
            {current && exercise ? (
              <>
                <div className="text-[11px] font-semibold tracking-widest uppercase text-primary">
                  Set {current.setIndex + 1} · {resting ? "Resting" : "Now"}
                </div>
                <h2 className="mt-1 font-display text-2xl font-bold">
                  {exercise.emoji} {exercise.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {current.reps} · rest {current.restSec}s · {exercise.group}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {exercise.cues.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
                {resting ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-secondary/60 p-3">
                    <span className="font-display text-2xl font-bold tabular-nums">
                      {mmss(rest)}
                    </span>
                    <span className="text-xs text-muted-foreground">rest remaining</span>
                    <span className="ml-auto flex gap-2">
                      <Button variant="pill" size="sm" onClick={() => setResting(false)}>
                        <Pause className="mr-1.5 h-3.5 w-3.5" /> Pause
                      </Button>
                      <Button
                        variant="soft"
                        size="sm"
                        onClick={() => {
                          setResting(false);
                          setRest(0);
                        }}
                      >
                        <SkipForward className="mr-1.5 h-3.5 w-3.5" /> Skip rest
                      </Button>
                    </span>
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="hero" onClick={completeSet}>
                    <Check className="mr-1.5 h-4 w-4" /> Set complete
                  </Button>
                  {!resting && rest > 0 ? (
                    <Button variant="pill" onClick={() => setResting(true)}>
                      <Play className="mr-1.5 h-4 w-4" /> Resume rest
                    </Button>
                  ) : null}
                  <Button variant="pill" onClick={finish}>
                    Finish early
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold">Every set done 🎉</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Great session — save it to add the calories and keep your streak alive.
                </p>
                <Button variant="hero" className="mt-4" onClick={finish}>
                  Save workout
                </Button>
              </>
            )}
          </div>
        </section>

        <section className="surface-card p-5">
          <h3 className="text-sm font-bold">Session plan</h3>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="gradient-fresh h-full rounded-full transition-[width] duration-500"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <ul className="mt-4 space-y-2">
            {setList.map((s) => {
              const ex = EXERCISES.find((e) => e.id === s.exerciseId);
              const isDone = done.includes(s.key);
              return (
                <li
                  key={s.key}
                  className="flex items-center gap-3 rounded-2xl bg-secondary/50 px-3 py-2.5"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-card text-sm">
                    {isDone ? <Check className="h-4 w-4 text-primary" /> : ex?.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {ex?.name ?? "Exercise"}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      Set {s.setIndex + 1} · {s.reps}
                    </span>
                  </span>
                  <Button
                    variant="pill"
                    size="sm"
                    onClick={() =>
                      setDone((d) => (d.includes(s.key) ? d.filter((k) => k !== s.key) : [...d, s.key]))
                    }
                  >
                    {isDone ? "Undo" : "Mark"}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}