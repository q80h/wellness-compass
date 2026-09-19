import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Apple,
  ArrowRight,
  CalendarDays,
  Dumbbell,
  Flame,
  Heart,
  Leaf,
  LineChart,
  ListChecks,
  Sparkles,
  Star,
} from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";
import heroWorkout from "@/assets/hero-workout.jpg";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/app-shell";
import { COMMUNITY } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vitl — Eat better, train smarter, stay consistent" },
      {
        name: "description",
        content:
          "Vitl is your daily nutrition and training companion: calorie and macro tracking, meal plans, workouts, habits, streaks and progress in one bright app.",
      },
      { property: "og:title", content: "Vitl — Eat better, train smarter, stay consistent" },
      {
        property: "og:description",
        content:
          "Track food, plan meals, follow workouts and build habits that actually stick — all in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Apple,
    title: "Know what to eat",
    body: "Log food in seconds, see calories and macros fill up live, and get swaps when you're short on protein.",
  },
  {
    icon: CalendarDays,
    title: "A week that plans itself",
    body: "Drag recipes into your week, then send every ingredient to a tidy grocery list in one tap.",
  },
  {
    icon: Dumbbell,
    title: "Training with a guide",
    body: "Follow full sessions set by set with built-in rest timers and cues, not a spreadsheet.",
  },
  {
    icon: LineChart,
    title: "See it working",
    body: "Weight trends, calorie history and training minutes in charts that are actually readable.",
  },
  {
    icon: ListChecks,
    title: "Small daily wins",
    body: "Habits, water and a fresh daily challenge keep the momentum going on busy days.",
  },
  {
    icon: Sparkles,
    title: "A coach in your pocket",
    body: "Ask what to cook tonight or how to hit your targets and get answers built on your own numbers.",
  },
];

function Landing() {
  const { state, hydrated } = useStore();
  const started = hydrated && state.onboarded;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <span className="gradient-fresh grid h-9 w-9 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-glow">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="truncate font-display text-xl font-bold">Vitl</span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Button variant="hero" size="default" asChild>
              <Link to={started ? "/today" : "/onboarding"}>
                {started ? "Open app" : "Get started"}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-40 -left-32 h-80 w-80 rounded-full bg-accent/25 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:pt-20">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-flame" />
              Nutrition + training, finally in one place
            </span>
            <h1 className="mt-5 text-4xl leading-[1.05] font-bold sm:text-6xl">
              Eat better.
              <br />
              Train smarter.
              <br />
              <span className="text-gradient-fresh">Stay consistent.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              Vitl answers the four questions that actually matter every day: what should I eat, what
              should I do, how am I doing, and what's next?
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="hero" size="xl" asChild>
                <Link to={started ? "/today" : "/onboarding"}>
                  {started ? "Back to my day" : "Build my plan"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="pill" size="xl" asChild>
                <Link to="/exercises">Browse exercises</Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { k: "2 min", v: "to set up your plan" },
                { k: "18+", v: "guided exercises" },
                { k: "0", v: "spreadsheets needed" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-2xl font-bold">{s.k}</dt>
                  <dd className="text-xs text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-rise">
            <img
              src={heroFood}
              alt="Colourful bowl of salmon, quinoa, avocado and greens with fresh berries"
              width={1408}
              height={1104}
              className="w-full rounded-4xl object-cover shadow-lift"
            />
            <div className="surface-card animate-float absolute -bottom-6 -left-2 w-44 p-4 sm:-left-8">
              <div className="text-xs font-semibold text-muted-foreground">Today's calories</div>
              <div className="mt-1 font-display text-2xl font-bold">1,740</div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className="gradient-fresh h-full w-[78%] rounded-full" />
              </div>
              <div className="mt-1.5 text-[11px] text-muted-foreground">480 kcal left</div>
            </div>
            <div className="surface-card absolute -top-4 right-2 flex items-center gap-2 px-3.5 py-2.5">
              <Flame className="h-4 w-4 text-flame" />
              <span className="text-sm font-bold">14-day streak</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">
          Everything you need for the day ahead — nothing you don't.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="surface-card hover-lift p-6">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Split */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="surface-card grid items-center gap-8 overflow-hidden p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-primary">
              Built for real weeks
            </span>
            <h2 className="mt-3 text-3xl font-bold">
              Momentum beats motivation. Vitl makes momentum easy.
            </h2>
            <ul className="mt-6 space-y-3.5">
              {[
                "One tap logs a planned meal — no searching, no maths.",
                "Rest timers, cues and set tracking inside every workout.",
                "Streaks, levels and achievements that reward showing up, not overdoing it.",
                "Light and dark, phone and desktop, all equally at home.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                    <Heart className="h-3 w-3" />
                  </span>
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
            <Button variant="hero" size="xl" className="mt-8" asChild>
              <Link to={started ? "/today" : "/onboarding"}>
                Start my first day
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <img
            src={heroWorkout}
            alt="Person stretching in a bright, plant-filled studio"
            loading="lazy"
            width={1008}
            height={1200}
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>
      </section>

      {/* Community */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">People keep coming back</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COMMUNITY.map((c) => (
            <figure key={c.name} className="surface-card hover-lift p-5">
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm text-muted-foreground">"{c.text}"</blockquote>
              <figcaption className="mt-4 flex items-center gap-2 text-sm font-semibold">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary">
                  {c.emoji}
                </span>
                {c.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="gradient-fresh relative overflow-hidden rounded-4xl px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="text-3xl font-bold sm:text-4xl">Your best week starts with one meal</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 sm:text-base">
            Answer a few quick questions and Vitl builds your calorie targets, meal plan and training
            week around you.
          </p>
          <Button
            size="xl"
            className="mt-8 rounded-full bg-card text-foreground shadow-lift hover:bg-card/90"
            asChild
          >
            <Link to={started ? "/today" : "/onboarding"}>
              {started ? "Open my dashboard" : "Create my plan — it's free"}
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:px-6">
          <span className="flex items-center gap-2 font-semibold text-foreground">
            <Leaf className="h-4 w-4 text-primary" /> Vitl
          </span>
          <span>Made for people who want to feel good, not perfect.</span>
        </div>
      </footer>
    </div>
  );
}