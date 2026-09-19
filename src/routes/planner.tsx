import { createFileRoute } from "@tanstack/react-router";
import { Clock, Plus, ShoppingBasket, Shuffle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Chip, SectionTitle } from "@/components/vitals";
import { categorise, RECIPES, SLOTS, type MealSlot, type Recipe } from "@/lib/data";
import { dateKey, sumMacros, useStore, WEEKDAYS, type GroceryItem, type LoggedMeal } from "@/lib/store";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Weekly meal planner — Vitl" },
      {
        name: "description",
        content:
          "Plan breakfast, lunch, dinner and snacks for the whole week, then send every ingredient to your grocery list.",
      },
      { property: "og:title", content: "Weekly meal planner — Vitl" },
      {
        property: "og:description",
        content: "Build your week of meals and generate a grocery list in one tap.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const { state, update, updateDay } = useStore();
  const today = WEEKDAYS[(new Date().getDay() + 6) % 7] ?? "Mon";
  const [activeDay, setActiveDay] = useState(today);
  const [picker, setPicker] = useState<{ day: string; slot: MealSlot } | null>(null);
  const [detail, setDetail] = useState<Recipe | null>(null);

  const dayPlan = state.plan[activeDay] ?? {};

  const setSlotRecipe = (dayName: string, slot: MealSlot, recipeId: string | undefined) =>
    update((s) => {
      const existing = { ...(s.plan[dayName] ?? {}) };
      if (recipeId === undefined) delete existing[slot];
      else existing[slot] = recipeId;
      return { ...s, plan: { ...s.plan, [dayName]: existing } };
    });

  const surpriseDay = (dayName: string) => {
    const next: { [K in MealSlot]?: string } = {};
    SLOTS.forEach((slot) => {
      const options = RECIPES.filter((r) => r.slot === slot);
      const pick = options[Math.floor(Math.random() * options.length)];
      if (pick) next[slot] = pick.id;
    });
    update((s) => ({ ...s, plan: { ...s.plan, [dayName]: next } }));
    toast.success(`${dayName} re-planned`, { description: "Four fresh meals picked for you" });
  };

  const sendToGrocery = () => {
    const names = new Set<string>();
    WEEKDAYS.forEach((d) => {
      const p = state.plan[d] ?? {};
      SLOTS.forEach((slot) => {
        const recipe = RECIPES.find((r) => r.id === p[slot]);
        recipe?.ingredients.forEach((i) => names.add(i));
      });
    });
    const existing = new Set(state.grocery.map((g) => g.name.toLowerCase()));
    const items: GroceryItem[] = [...names]
      .filter((n) => !existing.has(n.toLowerCase()))
      .map((n, i) => ({
        id: `g-${Date.now()}-${i}`,
        name: n,
        category: categorise(n),
        checked: false,
      }));
    if (items.length === 0) {
      toast("Grocery list already up to date");
      return;
    }
    update((s) => ({ ...s, grocery: [...s.grocery, ...items] }));
    toast.success(`${items.length} ingredients added`, { description: "Open your grocery list" });
  };

  const logPlannedDay = () => {
    const key = dateKey();
    const meals: LoggedMeal[] = SLOTS.flatMap((slot) => {
      const recipe = RECIPES.find((r) => r.id === (state.plan[today] ?? {})[slot]);
      if (!recipe) return [];
      return [
        {
          uid: `${Date.now()}-${slot}`,
          name: recipe.name,
          emoji: recipe.emoji,
          slot,
          servings: 1,
          ...recipe.macros,
        },
      ];
    });
    if (meals.length === 0) {
      toast("Nothing planned for today yet");
      return;
    }
    updateDay(key, (d) => ({ ...d, meals: [...d.meals, ...meals] }));
    toast.success("Today's plan logged", { description: `${meals.length} meals added` });
  };

  const dayMacros = sumMacros(
    SLOTS.flatMap((slot) => {
      const recipe = RECIPES.find((r) => r.id === dayPlan[slot]);
      if (!recipe) return [];
      return [
        {
          uid: recipe.id,
          name: recipe.name,
          emoji: recipe.emoji,
          slot,
          servings: 1,
          ...recipe.macros,
        } satisfies LoggedMeal,
      ];
    }),
  );

  return (
    <AppShell title="Meal planner" subtitle="Plan the week, shop once, eat well">
      <div className="space-y-6">
        <div className="scroll-hide -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {WEEKDAYS.map((d) => (
            <Chip key={d} active={activeDay === d} onClick={() => setActiveDay(d)}>
              {d}
              {d === today ? " •" : ""}
            </Chip>
          ))}
        </div>

        <section className="surface-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold">{activeDay}</h2>
              <p className="text-xs text-muted-foreground">
                {dayMacros.kcal} kcal · P{dayMacros.protein} C{dayMacros.carbs} F{dayMacros.fat}
              </p>
            </div>
            <Button variant="pill" size="sm" onClick={() => surpriseDay(activeDay)}>
              <Shuffle className="mr-1.5 h-3.5 w-3.5" /> Surprise me
            </Button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {SLOTS.map((slot) => {
              const recipe = RECIPES.find((r) => r.id === dayPlan[slot]);
              return (
                <div key={slot} className="rounded-2xl border border-border bg-card p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold tracking-widest uppercase text-primary">
                      {slot}
                    </span>
                    {recipe ? (
                      <button
                        type="button"
                        aria-label={`Clear ${slot}`}
                        className="press grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:text-foreground"
                        onClick={() => setSlotRecipe(activeDay, slot, undefined)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                  {recipe ? (
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setDetail(recipe)}
                        className="press grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-xl"
                        aria-label={`View ${recipe.name} recipe`}
                      >
                        {recipe.emoji}
                      </button>
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => setDetail(recipe)}
                          className="block w-full truncate text-left font-semibold hover:text-primary"
                        >
                          {recipe.name}
                        </button>
                        <p className="text-xs text-muted-foreground">
                          {recipe.macros.kcal} kcal · {recipe.minutes} min
                        </p>
                      </div>
                      <Button
                        variant="pill"
                        size="sm"
                        onClick={() => setPicker({ day: activeDay, slot })}
                      >
                        Swap
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="soft"
                      className="mt-2 w-full"
                      onClick={() => setPicker({ day: activeDay, slot })}
                    >
                      <Plus className="mr-1.5 h-4 w-4" /> Add a {slot}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="hero" onClick={sendToGrocery}>
              <ShoppingBasket className="mr-1.5 h-4 w-4" /> Send week to grocery list
            </Button>
            <Button variant="pill" onClick={logPlannedDay}>
              Log today's plan
            </Button>
          </div>
        </section>

        <section>
          <SectionTitle title="Recipe library" subtitle="Tap any recipe for ingredients and steps" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RECIPES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setDetail(r)}
                className="surface-card press hover-lift p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-xl">
                    {r.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{r.name}</div>
                    <div className="text-[11px] capitalize text-muted-foreground">{r.slot}</div>
                  </div>
                </div>
                <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {r.minutes} min · {r.macros.kcal} kcal ·{" "}
                  {r.macros.protein}g protein
                </p>
              </button>
            ))}
          </div>
        </section>
      </div>

      <Dialog open={picker !== null} onOpenChange={(open) => !open && setPicker(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">Choose a {picker?.slot}</DialogTitle>
            <DialogDescription>
              {picker ? `Sets the ${picker.slot} for ${picker.day}.` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {RECIPES.filter((r) => !picker || r.slot === picker.slot).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  if (picker) {
                    setSlotRecipe(picker.day, picker.slot, r.id);
                    toast.success(`${r.name} planned`, { description: `${picker.day} ${picker.slot}` });
                  }
                  setPicker(null);
                }}
                className="press flex w-full items-center gap-3 rounded-2xl border border-border p-3 text-left hover:bg-secondary/60"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-lg">
                  {r.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{r.name}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {r.macros.kcal} kcal · {r.minutes} min
                  </span>
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {detail?.emoji} {detail?.name}
            </DialogTitle>
            <DialogDescription>
              {detail
                ? `${detail.minutes} min · ${detail.macros.kcal} kcal · P${detail.macros.protein} C${detail.macros.carbs} F${detail.macros.fat}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {detail ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold">Ingredients</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {detail.ingredients.map((i) => (
                    <li key={i}>• {i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold">Method</h4>
                <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  {detail.steps.map((s, i) => (
                    <li key={s} className="flex gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/12 text-[11px] font-bold text-primary">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
              <Button
                variant="hero"
                className="w-full"
                onClick={() => {
                  const key = dateKey();
                  updateDay(key, (d) => ({
                    ...d,
                    meals: [
                      ...d.meals,
                      {
                        uid: `${Date.now()}-${detail.id}`,
                        name: detail.name,
                        emoji: detail.emoji,
                        slot: detail.slot,
                        servings: 1,
                        ...detail.macros,
                      },
                    ],
                  }));
                  toast.success(`${detail.name} logged`, {
                    description: `+${detail.macros.kcal} kcal`,
                  });
                  setDetail(null);
                }}
              >
                Log this now
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}