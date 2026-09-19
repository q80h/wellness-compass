import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Droplets, Minus, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip, EmptyState, MacroBar, Ring, SectionTitle } from "@/components/vitals";
import { FOODS, SLOTS, type FoodItem, type MealSlot } from "@/lib/data";
import { dateKey, shiftDay, sumMacros, useStore, type LoggedMeal } from "@/lib/store";

export const Route = createFileRoute("/nutrition")({
  head: () => ({
    meta: [
      { title: "Nutrition tracking — Vitl" },
      {
        name: "description",
        content:
          "Search foods, log meals by breakfast, lunch, dinner or snack and watch your calories and macros update live.",
      },
      { property: "og:title", content: "Nutrition tracking — Vitl" },
      {
        property: "og:description",
        content: "Log meals in seconds and keep your calories and macros on target.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NutritionPage,
});

const prettyDate = (key: string) => {
  const parts = key.split("-").map(Number);
  const d = new Date(parts[0] ?? 2026, (parts[1] ?? 1) - 1, parts[2] ?? 1);
  if (key === dateKey()) return "Today";
  if (key === shiftDay(dateKey(), -1)) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
};

function NutritionPage() {
  const { day, updateDay, targets } = useStore();
  const [key, setKey] = useState(dateKey());
  const [query, setQuery] = useState("");
  const [slot, setSlot] = useState<MealSlot>("breakfast");
  const log = day(key);
  const totals = sumMacros(log.meals);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FOODS.filter((f) => {
      const matchQuery = q ? f.name.toLowerCase().includes(q) || f.tags.some((t) => t.includes(q)) : true;
      const matchSlot = q ? true : f.tags.includes(slot);
      return matchQuery && matchSlot;
    }).slice(0, 12);
  }, [query, slot]);

  const addFood = (food: FoodItem, servings = 1) => {
    const meal: LoggedMeal = {
      uid: `${Date.now()}-${food.id}`,
      name: food.name,
      emoji: food.emoji,
      slot,
      servings,
      kcal: Math.round(food.kcal * servings),
      protein: Math.round(food.protein * servings),
      carbs: Math.round(food.carbs * servings),
      fat: Math.round(food.fat * servings),
    };
    updateDay(key, (d) => ({ ...d, meals: [...d.meals, meal] }));
    toast.success(`${food.name} added to ${slot}`, { description: `+${meal.kcal} kcal` });
  };

  const removeMeal = (uid: string) =>
    updateDay(key, (d) => ({ ...d, meals: d.meals.filter((m) => m.uid !== uid) }));

  const setServings = (uid: string, delta: number) =>
    updateDay(key, (d) => ({
      ...d,
      meals: d.meals.map((m) => {
        if (m.uid !== uid) return m;
        const next = Math.max(0.5, Number((m.servings + delta).toFixed(1)));
        const ratio = next / m.servings;
        return {
          ...m,
          servings: next,
          kcal: Math.round(m.kcal * ratio),
          protein: Math.round(m.protein * ratio),
          carbs: Math.round(m.carbs * ratio),
          fat: Math.round(m.fat * ratio),
        };
      }),
    }));

  return (
    <AppShell title="Nutrition" subtitle={`${totals.kcal} of ${targets.kcal} kcal logged`}>
      <div className="space-y-6">
        <div className="surface-card flex items-center justify-between gap-2 p-2">
          <Button
            variant="pill"
            size="icon"
            aria-label="Previous day"
            onClick={() => setKey((k) => shiftDay(k, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="truncate text-sm font-semibold">{prettyDate(key)}</span>
          <Button
            variant="pill"
            size="icon"
            aria-label="Next day"
            disabled={key === dateKey()}
            onClick={() => setKey((k) => shiftDay(k, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <section className="surface-card grid gap-6 p-5 sm:grid-cols-[auto_minmax(0,1fr)]">
          <div className="grid place-items-center">
            <Ring value={totals.kcal} target={targets.kcal} size={160}>
              <div className="text-center">
                <div className="font-display text-3xl font-bold tabular-nums">{totals.kcal}</div>
                <div className="text-xs font-medium text-muted-foreground">kcal eaten</div>
                <div className="text-[11px] text-muted-foreground/80">of {targets.kcal}</div>
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
                  Water {log.water}/{targets.water} glasses
                </span>
              </span>
              <span className="flex shrink-0 gap-1.5">
                <Button
                  variant="pill"
                  size="icon"
                  aria-label="Remove a glass of water"
                  onClick={() => updateDay(key, (d) => ({ ...d, water: Math.max(0, d.water - 1) }))}
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
          </div>
        </section>

        <section>
          <SectionTitle title="Add food" subtitle="Pick a meal, then tap any food to log it" />
          <div className="scroll-hide -mx-4 mb-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {SLOTS.map((s) => (
              <Chip key={s} active={slot === s} onClick={() => setSlot(s)}>
                <span className="capitalize">{s}</span>
              </Chip>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search foods, e.g. chicken or oats"
              className="h-12 rounded-2xl pl-10"
              aria-label="Search foods"
            />
          </div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {results.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => addFood(f)}
                className="surface-card press hover-lift flex items-center gap-3 p-3.5 text-left"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-xl">
                  {f.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{f.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {f.serving} · {f.kcal} kcal · {f.protein}g protein
                  </span>
                </span>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            ))}
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No foods match “{query}”. Try a simpler word.
              </p>
            ) : null}
          </div>
        </section>

        <section>
          <SectionTitle title="Logged today" subtitle={`${log.meals.length} items`} />
          {log.meals.length === 0 ? (
            <EmptyState
              emoji="🍽️"
              title="Nothing logged yet"
              body="Add your first meal above — it only takes a tap and your rings update instantly."
            />
          ) : (
            <div className="space-y-4">
              {SLOTS.map((s) => {
                const meals = log.meals.filter((m) => m.slot === s);
                if (meals.length === 0) return null;
                const st = sumMacros(meals);
                return (
                  <div key={s} className="surface-card p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold capitalize">{s}</h3>
                      <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                        {st.kcal} kcal
                      </span>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {meals.map((m) => (
                        <li key={m.uid} className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-2.5">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-card text-lg">
                            {m.emoji}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold">{m.name}</span>
                            <span className="block text-[11px] text-muted-foreground">
                              {m.servings}× · {m.kcal} kcal · P{m.protein} C{m.carbs} F{m.fat}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1">
                            <Button
                              variant="pill"
                              size="icon"
                              aria-label={`Decrease servings of ${m.name}`}
                              onClick={() => setServings(m.uid, -0.5)}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="pill"
                              size="icon"
                              aria-label={`Increase servings of ${m.name}`}
                              onClick={() => setServings(m.uid, 0.5)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="pill"
                              size="icon"
                              aria-label={`Remove ${m.name}`}
                              onClick={() => {
                                removeMeal(m.uid);
                                toast("Removed", { description: m.name });
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}