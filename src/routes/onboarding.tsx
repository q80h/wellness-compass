import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Leaf, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { computeTargets, useStore, type Activity, type Goal, type Profile } from "@/lib/store";
import { Ring } from "@/components/vitals";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Build your plan — Vitl" },
      {
        name: "description",
        content:
          "Answer a few questions and Vitl builds your calorie targets, macros, meal plan and training week.",
      },
      { property: "og:title", content: "Build your plan — Vitl" },
      {
        property: "og:description",
        content: "Personalised calorie targets, macros and a training week in under two minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const GOALS: { id: Goal; title: string; body: string; emoji: string }[] = [
  { id: "lose", title: "Lose fat", body: "A gentle calorie deficit with high protein", emoji: "🍃" },
  { id: "maintain", title: "Stay steady", body: "Eat well, train well, hold your shape", emoji: "⚖️" },
  { id: "gain", title: "Build muscle", body: "A small surplus and strength focus", emoji: "💪" },
];

const ACTIVITIES: { id: Activity; title: string; body: string }[] = [
  { id: "low", title: "Mostly sitting", body: "Desk job, little walking" },
  { id: "moderate", title: "Fairly active", body: "Walk daily, train a few times a week" },
  { id: "high", title: "Very active", body: "On your feet plus regular training" },
  { id: "athlete", title: "Athlete", body: "Training most days, sometimes twice" },
];

const DIETS = ["No restrictions", "Vegetarian", "Vegan", "High protein", "Low carb", "Dairy-free", "Gluten-free"];

const STEPS = ["You", "Body", "Activity", "Food", "Plan"];

function Onboarding() {
  const { state, update } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Profile>(state.profile);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const targets = computeTargets(draft);
  const canContinue = step !== 0 || draft.name.trim().length > 0;

  const finish = () => {
    update((s) => ({ ...s, profile: draft, onboarded: true }));
    navigate({ to: "/today" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col px-4 py-8 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="gradient-fresh grid h-9 w-9 place-items-center rounded-xl text-primary-foreground shadow-glow">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-bold">Vitl</span>
        </div>

        <div className="mt-7 flex items-center gap-1.5">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors duration-500",
                  i <= step ? "bg-primary" : "bg-muted",
                )}
              />
              <span
                className={cn(
                  "mt-1.5 hidden text-[11px] font-medium sm:block",
                  i <= step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <div key={step} className="animate-rise mt-8 flex-1">
          {step === 0 && (
            <div>
              <h1 className="text-3xl font-bold">First, what should we call you?</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your plan is built around you, so your day always feels personal.
              </p>
              <Input
                autoFocus
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Your first name"
                className="mt-6 h-14 rounded-2xl text-lg"
              />
              <h2 className="mt-9 text-lg font-bold">What are you working towards?</h2>
              <div className="mt-3 space-y-2.5">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => set("goal", g.id)}
                    className={cn(
                      "press flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
                      draft.goal === g.id
                        ? "border-primary bg-primary/8"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-xl">
                      {g.emoji}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{g.title}</span>
                      <span className="block text-xs text-muted-foreground">{g.body}</span>
                    </span>
                    {draft.goal === g.id ? <Check className="ml-auto h-5 w-5 text-primary" /> : null}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-3xl font-bold">A few numbers</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Used only to estimate your energy needs. You can change these any time.
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {(["female", "male", "other"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set("sex", s)}
                    className={cn(
                      "press rounded-2xl border py-3 text-sm font-semibold capitalize transition-colors",
                      draft.sex === s ? "border-primary bg-primary/8 text-primary" : "border-border bg-card",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <SliderRow
                label="Age"
                value={draft.age}
                unit="years"
                min={16}
                max={80}
                onChange={(v) => set("age", v)}
              />
              <SliderRow
                label="Height"
                value={draft.heightCm}
                unit="cm"
                min={140}
                max={210}
                onChange={(v) => set("heightCm", v)}
              />
              <SliderRow
                label="Current weight"
                value={draft.weightKg}
                unit="kg"
                min={40}
                max={160}
                onChange={(v) => set("weightKg", v)}
              />
              <SliderRow
                label="Goal weight"
                value={draft.targetWeightKg}
                unit="kg"
                min={40}
                max={160}
                onChange={(v) => set("targetWeightKg", v)}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-3xl font-bold">How active is a normal week?</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Be honest rather than ambitious — we'd rather your targets fit real life.
              </p>
              <div className="mt-6 space-y-2.5">
                {ACTIVITIES.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => set("activity", a.id)}
                    className={cn(
                      "press flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition-colors",
                      draft.activity === a.id
                        ? "border-primary bg-primary/8"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block font-semibold">{a.title}</span>
                      <span className="block text-xs text-muted-foreground">{a.body}</span>
                    </span>
                    {draft.activity === a.id ? <Check className="h-5 w-5 shrink-0 text-primary" /> : null}
                  </button>
                ))}
              </div>
              <SliderRow
                label="Workouts per week"
                value={draft.workoutDays}
                unit="days"
                min={1}
                max={7}
                onChange={(v) => set("workoutDays", v)}
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold">How do you like to eat?</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We'll lean your recipe suggestions this way. Pick as many as you like.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {DIETS.map((d) => {
                  const active = draft.diet.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        set(
                          "diet",
                          active ? draft.diet.filter((x) => x !== d) : [...draft.diet, d],
                        )
                      }
                      className={cn(
                        "press rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              <h2 className="mt-9 text-lg font-bold">Gentle nudges</h2>
              <div className="mt-3 space-y-2.5">
                {(
                  [
                    ["reminderMeals", "Remind me to log meals"],
                    ["reminderWorkout", "Remind me about training"],
                    ["reminderWater", "Remind me to drink water"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => set(key, !draft[key])}
                    className={cn(
                      "press flex w-full items-center justify-between rounded-2xl border p-4 text-left text-sm font-medium transition-colors",
                      draft[key] ? "border-primary bg-primary/8" : "border-border bg-card",
                    )}
                  >
                    {label}
                    <span
                      className={cn(
                        "grid h-6 w-11 place-items-center rounded-full transition-colors",
                        draft[key] ? "bg-primary" : "bg-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "h-5 w-5 rounded-full bg-card transition-transform",
                          draft[key] ? "translate-x-2.5" : "-translate-x-2.5",
                        )}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/12 px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Your plan is ready
              </span>
              <h1 className="mt-4 text-3xl font-bold">
                Here's your daily target{draft.name ? `, ${draft.name}` : ""}
              </h1>
              <div className="surface-card mt-6 grid place-items-center gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)]">
                <Ring value={targets.kcal} target={targets.kcal} label="kcal / day" size={150} />
                <div className="w-full space-y-3">
                  <TargetRow label="Protein" value={`${targets.protein}g`} tone="bg-protein" />
                  <TargetRow label="Carbs" value={`${targets.carbs}g`} tone="bg-carbs" />
                  <TargetRow label="Fat" value={`${targets.fat}g`} tone="bg-fat" />
                  <TargetRow label="Water" value={`${targets.water} glasses`} tone="bg-water" />
                </div>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li>• {draft.workoutDays} training days a week, matched to your level</li>
                <li>• A full week of meals you can swap in one tap</li>
                <li>• Habits, streaks and a fresh challenge every morning</li>
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          {step > 0 ? (
            <Button variant="pill" size="xl" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          ) : null}
          <Button
            variant="hero"
            size="xl"
            className="flex-1"
            disabled={!canContinue}
            onClick={() => (step === STEPS.length - 1 ? finish() : setStep((s) => s + 1))}
          >
            {step === STEPS.length - 1 ? "Start my first day" : "Continue"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="surface-card mt-4 p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <span className="font-display text-xl font-bold tabular-nums">
          {value}
          <span className="ml-1 text-xs font-medium text-muted-foreground">{unit}</span>
        </span>
      </div>
      <Slider
        className="mt-3"
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={(v) => onChange(v[0] ?? value)}
      />
    </div>
  );
}

function TargetRow({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-secondary/60 px-3.5 py-2.5">
      <span className="flex items-center gap-2 text-sm font-medium">
        <span className={cn("h-2.5 w-2.5 rounded-full", tone)} />
        {label}
      </span>
      <span className="text-sm font-bold tabular-nums">{value}</span>
    </div>
  );
}