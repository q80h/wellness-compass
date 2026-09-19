import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ACHIEVEMENTS,
  CHALLENGES,
  DEFAULT_HABITS,
  FOODS,
  RECIPES,
  SLOTS,
  type Macro,
  type MealSlot,
} from "./data";

/* ---------------------------------- types --------------------------------- */

export type Goal = "lose" | "maintain" | "gain";
export type Activity = "low" | "moderate" | "high" | "athlete";

export type Profile = {
  name: string;
  goal: Goal;
  sex: "female" | "male" | "other";
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activity: Activity;
  diet: string[];
  workoutDays: number;
  reminderMeals: boolean;
  reminderWorkout: boolean;
  reminderWater: boolean;
  reminderTime: string;
};

export type LoggedMeal = Macro & {
  uid: string;
  name: string;
  emoji: string;
  slot: MealSlot;
  servings: number;
};

export type DayLog = {
  meals: LoggedMeal[];
  water: number;
  habits: string[];
  challenges: string[];
  workouts: { workoutId: string; minutes: number; kcal: number }[];
};

export type GroceryItem = { id: string; name: string; category: string; checked: boolean };

export type Habit = { id: string; name: string; emoji: string; why?: string; custom?: boolean };

export type PersonalRecord = {
  id: string;
  exerciseId: string;
  name: string;
  weight: number;
  reps: number;
  date: string;
};

export type Area = { label: string; source: "auto" | "manual" };

export type Tier = "free" | "pro";

export type AppState = {
  onboarded: boolean;
  profile: Profile;
  days: Record<string, DayLog>;
  weights: { date: string; kg: number }[];
  plan: Record<string, { [K in MealSlot]?: string | undefined }>;
  grocery: GroceryItem[];
  habits: Habit[];
  theme: "light" | "dark";
  celebrated: string[];
  tier: Tier;
  avatar: { emoji: string; tone: string };
  nameChangedAt: string | null;
  area: Area | null;
  prs: PersonalRecord[];
  coachUsed: Record<string, number>;
};

export const AVATAR_EMOJIS = [
  "🥑",
  "🌿",
  "🍓",
  "🔥",
  "🏋️",
  "🏃",
  "🧘",
  "🚴",
  "🥕",
  "🐝",
  "⚡",
  "🌞",
] as const;

export const AVATAR_TONES = ["fresh", "citrus", "water", "flame"] as const;

export const NAME_COOLDOWN_DAYS = 7;

/** Days left before the display name can be changed again. */
export function nameCooldownLeft(nameChangedAt: string | null): number {
  if (!nameChangedAt) return 0;
  const changed = new Date(nameChangedAt).getTime();
  if (Number.isNaN(changed)) return 0;
  const elapsed = (Date.now() - changed) / 86_400_000;
  return Math.max(0, Math.ceil(NAME_COOLDOWN_DAYS - elapsed));
}

const STORAGE_KEY = "vitl.state.v1";

export const emptyDay = (): DayLog => ({
  meals: [],
  water: 0,
  habits: [],
  challenges: [],
  workouts: [],
});

export const dateKey = (d: Date = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const shiftDay = (key: string, delta: number) => {
  const parts = key.split("-").map(Number);
  const date = new Date(parts[0] ?? 2026, (parts[1] ?? 1) - 1, (parts[2] ?? 1) + delta);
  return dateKey(date);
};

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const defaultProfile: Profile = {
  name: "",
  goal: "lose",
  sex: "female",
  age: 29,
  heightCm: 170,
  weightKg: 72,
  targetWeightKg: 66,
  activity: "moderate",
  diet: [],
  workoutDays: 4,
  reminderMeals: true,
  reminderWorkout: true,
  reminderWater: false,
  reminderTime: "08:30",
};

/* --------------------------- sample seeded history -------------------------- */

function seedState(): AppState {
  const days: Record<string, DayLog> = {};
  const today = dateKey();
  const fallback = FOODS[0] as (typeof FOODS)[number];
  const pick = (slot: MealSlot) => {
    const matches = FOODS.filter((f) => f.tags.includes(slot));
    return matches[Math.floor(Math.random() * matches.length)] ?? fallback;
  };

  for (let i = 1; i <= 9; i++) {
    const key = shiftDay(today, -i);
    const meals: LoggedMeal[] = SLOTS.slice(0, 3).map((slot, idx) => {
      const f = pick(slot);
      return {
        uid: `${key}-${idx}`,
        name: f.name,
        emoji: f.emoji,
        slot,
        servings: 1,
        kcal: f.kcal,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
      };
    });
    days[key] = {
      meals,
      water: 4 + (i % 4),
      habits: DEFAULT_HABITS.slice(0, 2 + (i % 3)).map((h) => h.id),
      challenges: i % 2 === 0 ? [CHALLENGES[i % CHALLENGES.length]?.id ?? "c1"] : [],
      workouts:
        i % 2 === 1
          ? [
              {
                workoutId: ["w1", "w2", "w3", "w4"][i % 4] ?? "w1",
                minutes: 30 + (i % 3) * 6,
                kcal: 260 + i * 8,
              },
            ]
          : [],
    };
  }
  days[today] = emptyDay();

  const weights = Array.from({ length: 8 }, (_, i) => ({
    date: shiftDay(today, -(7 - i) * 4),
    kg: Number((74.2 - i * 0.32 + (i % 2 === 0 ? 0.18 : -0.12)).toFixed(1)),
  }));

  const plan: AppState["plan"] = {};
  WEEKDAYS.forEach((d, i) => {
    plan[d] = {
      breakfast: RECIPES.filter((r) => r.slot === "breakfast")[i % 3]?.id,
      lunch: RECIPES.filter((r) => r.slot === "lunch")[i % 2]?.id,
      dinner: RECIPES.filter((r) => r.slot === "dinner")[i % 4]?.id,
      snack: RECIPES.filter((r) => r.slot === "snack")[i % 2]?.id,
    };
  });

  return {
    onboarded: false,
    profile: defaultProfile,
    days,
    weights,
    plan,
    grocery: [],
    habits: DEFAULT_HABITS,
    theme: "light",
    celebrated: [],
  };
}

/* -------------------------------- nutrition -------------------------------- */

export function computeTargets(p: Profile): Macro & { water: number } {
  const s = p.sex === "male" ? 5 : p.sex === "female" ? -161 : -78;
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + s;
  const factor = { low: 1.25, moderate: 1.45, high: 1.62, athlete: 1.78 }[p.activity];
  let kcal = bmr * factor;
  if (p.goal === "lose") kcal -= 420;
  if (p.goal === "gain") kcal += 340;
  kcal = Math.round(kcal / 10) * 10;
  const protein = Math.round((p.goal === "gain" ? 2.0 : 1.8) * p.weightKg);
  const fat = Math.round((kcal * 0.27) / 9);
  const carbs = Math.max(60, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { kcal, protein, carbs, fat, water: p.weightKg > 80 ? 10 : 8 };
}

export const sumMacros = (meals: LoggedMeal[]): Macro =>
  meals.reduce(
    (a, m) => ({
      kcal: a.kcal + m.kcal,
      protein: a.protein + m.protein,
      carbs: a.carbs + m.carbs,
      fat: a.fat + m.fat,
    }),
    { kcal: 0, protein: 0, carbs: 0, fat: 0 },
  );

export function dailyChallenge(key: string): (typeof CHALLENGES)[number] {
  const seed = key.split("-").reduce((a, b) => a + Number(b), 0);
  const fallback = CHALLENGES[0] as (typeof CHALLENGES)[number];
  return CHALLENGES[seed % CHALLENGES.length] ?? fallback;
}

/* ---------------------------------- store ---------------------------------- */

type Ctx = {
  hydrated: boolean;
  state: AppState;
  update: (fn: (s: AppState) => AppState) => void;
  day: (key?: string) => DayLog;
  updateDay: (key: string, fn: (d: DayLog) => DayLog) => void;
  targets: Macro & { water: number };
  streak: number;
  xp: number;
  level: { level: number; label: string; progress: number };
  unlocked: string[];
  stats: { workouts: number; meals: number; habits: number; water: number; minutes: number };
  reset: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => seedState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        setState({ ...seedState(), ...parsed, profile: { ...defaultProfile, ...parsed.profile } });
      }
    } catch {
      /* ignore corrupted storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable */
    }
  }, [state, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  const update = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);

  const day = useCallback(
    (key: string = dateKey()) => state.days[key] ?? emptyDay(),
    [state.days],
  );

  const updateDay = useCallback(
    (key: string, fn: (d: DayLog) => DayLog) =>
      setState((s) => ({ ...s, days: { ...s.days, [key]: fn(s.days[key] ?? emptyDay()) } })),
    [],
  );

  const targets = useMemo(() => computeTargets(state.profile), [state.profile]);

  const streak = useMemo(() => {
    let n = 0;
    let key = dateKey();
    for (let i = 0; i < 400; i++) {
      const d = state.days[key];
      const active = d && (d.meals.length > 0 || d.workouts.length > 0 || d.habits.length > 0);
      if (active) n++;
      else if (i > 0) break;
      key = shiftDay(key, -1);
    }
    return n;
  }, [state.days]);

  const stats = useMemo(() => {
    let workouts = 0,
      meals = 0,
      habits = 0,
      water = 0,
      minutes = 0;
    Object.values(state.days).forEach((d) => {
      workouts += d.workouts.length;
      minutes += d.workouts.reduce((a, w) => a + w.minutes, 0);
      meals += d.meals.length;
      habits += d.habits.length;
      water += d.water;
    });
    return { workouts, meals, habits, water, minutes };
  }, [state.days]);

  const xp = useMemo(
    () =>
      stats.meals * 8 +
      stats.workouts * 45 +
      stats.habits * 6 +
      Math.floor(stats.water / 2) +
      streak * 12,
    [stats, streak],
  );

  const level = useMemo(() => {
    const labels = ["Sprout", "Rooted", "Thriving", "Strong", "Unstoppable", "Legend"];
    const lvl = Math.min(labels.length, Math.floor(xp / 500) + 1);
    return {
      level: lvl,
      label: labels[lvl - 1] ?? "Sprout",
      progress: Math.round(((xp % 500) / 500) * 100),
    };
  }, [xp]);

  const unlocked = useMemo(
    () =>
      ACHIEVEMENTS.filter((a) => {
        const value = a.metric === "streak" ? streak : stats[a.metric];
        return value >= a.goal;
      }).map((a) => a.id),
    [stats, streak],
  );

  const reset = useCallback(() => {
    const fresh = seedState();
    setState({ ...fresh, theme: state.theme });
  }, [state.theme]);

  const value: Ctx = {
    hydrated,
    state,
    update,
    day,
    updateDay,
    targets,
    streak,
    xp,
    level,
    unlocked,
    stats,
    reset,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export function greeting(name: string) {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name}` : part;
}

export function achievementProgress(
  metric: Achievementish,
  stats: Ctx["stats"],
  streak: number,
): number {
  return metric === "streak" ? streak : stats[metric];
}
type Achievementish = "streak" | "workouts" | "meals" | "habits" | "water";