import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Droplets, Dumbbell, Flame, Minus, Plus, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Chip, MacroBar, Ring, SectionTitle, StatCard } from "@/components/vitals";
import { Button } from "@/components/ui/button";
import {
  ACHIEVEMENTS,
  COMMUNITY,
  RECIPES,
  SLOTS,
  WORKOUTS,
  type MealSlot,
} from "@/lib/data";
import {
  dailyChallenge,
  dateKey,
  greeting,
  sumMacros,
  useStore,
  WEEKDAYS,
  type LoggedMeal,
} from "@/lib/store";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today — Vitl" },
      {
        name: "description",
        content:
          "Your personalised day: calories left, planned meals, today's workout, habits and your daily challenge.",
      },
      { property: "og:title", content: "Today — Vitl" },
      { property: "og:description", content: "Calories, meals, training and habits for today." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Today,
});

function Today() {
  const { state, day, updateDay, targets, streak, level, unlocked, stats } = useStore();
  const key = dateKey();
  const log = day(key);
  const totals = sumMacros(log.meals);
  const weekday = WEEKDAYS[(new Date().getDay() + 6) % 7] ?? "Mon";
  const plan = state.plan[weekday] ?? {};
  const challenge = dailyChallenge(key);
  const workout =
    WORKOUTS.find((w) => w.level === (state.profile.workoutDays > 4 ? "Intermediate" : "Beginner")) ??
    WORKOUTS[0]!;
  const doneWorkout = log.workouts.length > 0;
  const remaining = Math.max(0, targets.kcal - totals.kcal);

  const logRecipe = (slot: MealSlot, recipeId?: string) => {
    const recipe = RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return;
    const meal: LoggedMeal = {
      uid: `${Date.now()}-${slot}`,
      name: recipe.name,
      emoji: recipe.emoji,
      slot,
      servings: 1,
      ...recipe.macros,
    };
    updateDay(key, (d) => ({ ...d, meals: [...d.meals, meal] }));
    toast.success(`${recipe.name} logged`, { description: `+${recipe.macros.kcal} kcal` });
  };

  const toggleHabit = (id: string) =>
    updateDay(key, (d) => ({
      ...d,
      habits: d.habits.includes(id) ? d.habits.filter((h) => h !== id) : [...d.habits, id],
    }));

  const nextAchievement = ACHIEVEMENTS.find((a) => !unlocked.includes(a.id));

  return (
    <AppShell
      title={greeting(state.profile.name)}
      subtitle={
        remaining > 0 ? `${remaining} kcal left today` : "Target reached — nice work today"
      }
    >
      <div className="space-y-6">
        {/* Energy card */}
        <section className="surface-card animate-rise grid gap-6 p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6">
          <div className="grid place-items-center">
            <Ring value={totals.kcal} target={targets.kcal} size={172}>
              <div className="text-center">
                <div className="font-display text-3xl font-bold tabular-nums">{remaining}</div>
                <div className="text-xs font-medium text-muted-foreground">kcal left</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground/80">
                  of {targets.kcal}
                </div>
              </div>
            </Ring>
          </div>
          <div className="space-y-3.5">
            <MacroBar label="Protein" value={totals.protein} target={targets.protein} tone="protein" />
            <MacroBar label="Carbs" value={totals.carbs} target={targets.carbs} tone="carbs" />
            <MacroBar label="Fat" value={totals.fat} target={targets.fat} tone="fat" />
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/60 px-3.5 py-2.5">
              <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                <Droplets className="h-4 w-4 shrink-0 text-water" />
                <span className="truncate">
                  Water {log.water}/{targets.water}
                </span>
              </span>
              <span className="flex shrink-0 gap-1.5">
                <Button
                  variant="pill"
                  size="icon"
                  aria-label="Remove a glass of water"
                  onClick={() =>
                    updateDay(key, (d) => ({ ...d, water: Math.max(0, d.water - 1) }))
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="soft"
                  size="icon"
                  aria-label="Add a glass of water"
                  onClick={() => updateDay(key, (d) => ({ ...d, water: d.water + 1 }))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </span>
            </div>
            <Button variant="hero" className="w-full" asChild>
              <Link to="/nutrition">Log food</Link>
            </Button>
          </div>
        </section>

        {/* What to eat */}
        <section>
          <SectionTitle
            title="What to eat today"
            subtitle={`Your ${weekday} plan — tap to log it instantly`}
            action={
              <Button variant="pill" size="sm" asChild>
                <Link to="/planner">Edit week</Link>
              </Button>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {SLOTS.map((slot) => {
              const recipe = RECIPES.find((r) => r.id === plan[slot]);
              const logged = log.meals.some((m) => m.slot === slot);
              return (
                <div key={slot} className="surface-card hover-lift flex items-center gap-3.5 p-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl">
                    {recipe?.emoji ?? "🍽️"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold tracking-widest uppercase text-primary">
                      {slot}
                    </div>
                    <div className="truncate font-semibold">{recipe?.name ?? "Nothing planned"}</div>
                    <div className="text-xs text-muted-foreground">
                      {recipe
                        ? `${recipe.macros.kcal} kcal · ${recipe.macros.protein}g protein · ${recipe.minutes} min`
                        : "Add something in the planner"}
                    </div>
                  </div>
                  {logged ? (
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : (
                    <Button
                      variant="soft"
                      size="icon"
                      aria-label={`Log ${recipe?.name ?? "meal"}`}
                      disabled={!recipe}
                      onClick={() => logRecipe(slot, recipe?.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Training */}
        <section className="grid gap-3 lg:grid-cols-2">
          <div className="surface-card overflow-hidden p-5">
            <div className="text-[11px] font-semibold tracking-widest uppercase text-primary">
              Today's session
            </div>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-3xl">{workout.emoji}</span>
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold">{workout.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {workout.focus} · {workout.minutes} min · ~{workout.kcal} kcal
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {workout.blocks.slice(0, 4).map((b, i) => (
                <span
                  key={i}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {b.sets} × {b.reps}
                </span>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <Button variant="hero" className="flex-1" asChild>
                <Link to="/workouts/$workoutId" params={{ workoutId: workout.id }}>
                  {doneWorkout ? "Train again" : "Start workout"}
                </Link>
              </Button>
              <Button variant="pill" asChild>
                <Link to="/workouts">All plans</Link>
              </Button>
            </div>
            {doneWorkout ? (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
                <Check className="h-3.5 w-3.5" /> Session already logged today
              </p>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="surface-card p-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Daily challenge
              </div>
              <div className="mt-2 flex items-start gap-3">
                <span className="text-2xl">{challenge.emoji}</span>
                <p className="text-sm font-semibold">{challenge.text}</p>
              </div>
              <Button
                variant={log.challenges.includes(challenge.id) ? "soft" : "hero"}
                className="mt-4 w-full"
                onClick={() =>
                  updateDay(key, (d) => ({
                    ...d,
                    challenges: d.challenges.includes(challenge.id)
                      ? d.challenges.filter((c) => c !== challenge.id)
                      : [...d.challenges, challenge.id],
                  }))
                }
              >
                {log.challenges.includes(challenge.id)
                  ? `Done · +${challenge.xp} XP`
                  : `Accept · ${challenge.xp} XP`}
              </Button>
            </div>

            <div className="surface-card p-5">
              <div className="text-[11px] font-semibold tracking-widest uppercase text-primary">
                Quick habits
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {state.habits.map((h) => (
                  <Chip
                    key={h.id}
                    active={log.habits.includes(h.id)}
                    onClick={() => toggleHabit(h.id)}
                  >
                    <span className="mr-1">{h.emoji}</span>
                    {h.name}
                  </Chip>
                ))}
              </div>
              <Button variant="pill" size="sm" className="mt-4" asChild>
                <Link to="/habits">Habit tracker</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Momentum */}
        <section>
          <SectionTitle title="How you're doing" subtitle="Your last few days at a glance" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Flame className="h-4.5 w-4.5" />}
              label="Day streak"
              value={`${streak}`}
              hint="Keep it alive today"
              tone="flame"
            />
            <StatCard
              icon={<Dumbbell className="h-4.5 w-4.5" />}
              label="Workouts done"
              value={`${stats.workouts}`}
              hint={`${stats.minutes} minutes trained`}
            />
            <StatCard
              icon={<Trophy className="h-4.5 w-4.5" />}
              label="Achievements"
              value={`${unlocked.length}/${ACHIEVEMENTS.length}`}
              hint={nextAchievement ? `Next: ${nextAchievement.name}` : "All unlocked!"}
              tone="accent"
            />
            <StatCard
              icon={<Sparkles className="h-4.5 w-4.5" />}
              label={`Level ${level.level}`}
              value={level.label}
              hint={`${level.progress}% to next level`}
            />
          </div>
        </section>

        <section>
          <SectionTitle title="From the community" subtitle="Real wins from people like you" />
          <div className="scroll-hide -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {COMMUNITY.map((c) => (
              <div key={c.name} className="surface-card w-72 shrink-0 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary">
                    {c.emoji}
                  </span>
                  {c.name}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
                <p className="mt-3 text-xs font-medium text-primary">{c.cheers} cheers</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}