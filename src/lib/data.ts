export type Macro = { kcal: number; protein: number; carbs: number; fat: number };

export type FoodItem = Macro & {
  id: string;
  name: string;
  serving: string;
  tags: string[];
  emoji: string;
};

export const FOODS: FoodItem[] = [
  { id: "f1", name: "Greek yogurt bowl", serving: "1 bowl (250g)", kcal: 220, protein: 22, carbs: 18, fat: 6, tags: ["breakfast", "high-protein"], emoji: "🥣" },
  { id: "f2", name: "Overnight oats & berries", serving: "1 jar", kcal: 340, protein: 14, carbs: 52, fat: 9, tags: ["breakfast", "vegetarian"], emoji: "🫐" },
  { id: "f3", name: "Avocado toast + egg", serving: "2 slices", kcal: 410, protein: 18, carbs: 34, fat: 22, tags: ["breakfast"], emoji: "🥑" },
  { id: "f4", name: "Grilled chicken salad", serving: "1 plate", kcal: 430, protein: 42, carbs: 20, fat: 19, tags: ["lunch", "high-protein"], emoji: "🥗" },
  { id: "f5", name: "Salmon, quinoa & greens", serving: "1 plate", kcal: 560, protein: 40, carbs: 45, fat: 22, tags: ["dinner", "omega-3"], emoji: "🐟" },
  { id: "f6", name: "Turkey burrito bowl", serving: "1 bowl", kcal: 610, protein: 44, carbs: 62, fat: 18, tags: ["lunch"], emoji: "🌯" },
  { id: "f7", name: "Tofu stir fry & rice", serving: "1 bowl", kcal: 520, protein: 26, carbs: 68, fat: 14, tags: ["dinner", "vegan"], emoji: "🍚" },
  { id: "f8", name: "Protein shake", serving: "1 scoop + milk", kcal: 210, protein: 30, carbs: 9, fat: 4, tags: ["snack", "high-protein"], emoji: "🥛" },
  { id: "f9", name: "Apple & peanut butter", serving: "1 apple + 1 tbsp", kcal: 250, protein: 7, carbs: 30, fat: 11, tags: ["snack"], emoji: "🍎" },
  { id: "f10", name: "Lentil soup", serving: "1 bowl", kcal: 320, protein: 19, carbs: 48, fat: 5, tags: ["lunch", "vegan"], emoji: "🍲" },
  { id: "f11", name: "Steak & sweet potato", serving: "1 plate", kcal: 640, protein: 48, carbs: 44, fat: 26, tags: ["dinner"], emoji: "🥩" },
  { id: "f12", name: "Egg white omelette", serving: "3 whites + veg", kcal: 180, protein: 24, carbs: 8, fat: 5, tags: ["breakfast", "high-protein"], emoji: "🍳" },
  { id: "f13", name: "Mixed nuts", serving: "30g", kcal: 190, protein: 6, carbs: 7, fat: 16, tags: ["snack"], emoji: "🥜" },
  { id: "f14", name: "Shrimp poke bowl", serving: "1 bowl", kcal: 490, protein: 34, carbs: 58, fat: 12, tags: ["lunch"], emoji: "🍤" },
  { id: "f15", name: "Cottage cheese & honey", serving: "200g", kcal: 230, protein: 26, carbs: 14, fat: 7, tags: ["snack", "high-protein"], emoji: "🍯" },
  { id: "f16", name: "Chickpea curry", serving: "1 bowl", kcal: 480, protein: 20, carbs: 64, fat: 15, tags: ["dinner", "vegan"], emoji: "🍛" },
  { id: "f17", name: "Banana smoothie", serving: "400ml", kcal: 290, protein: 12, carbs: 52, fat: 5, tags: ["breakfast", "snack"], emoji: "🍌" },
  { id: "f18", name: "Chicken & veg traybake", serving: "1 plate", kcal: 520, protein: 46, carbs: 38, fat: 18, tags: ["dinner", "high-protein"], emoji: "🍗" },
];

export type Recipe = {
  id: string;
  name: string;
  slot: MealSlot;
  minutes: number;
  emoji: string;
  macros: Macro;
  tags: string[];
  ingredients: string[];
  steps: string[];
};

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";
export const SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner", "snack"];

export const RECIPES: Recipe[] = [
  {
    id: "r1", name: "Berry protein oats", slot: "breakfast", minutes: 10, emoji: "🫐",
    macros: { kcal: 380, protein: 26, carbs: 52, fat: 8 }, tags: ["vegetarian", "fibre"],
    ingredients: ["60g rolled oats", "1 scoop vanilla protein", "150g mixed berries", "200ml milk", "1 tsp chia seeds"],
    steps: ["Mix oats, milk and chia. Rest 5 min.", "Stir through protein powder.", "Top with berries and serve."],
  },
  {
    id: "r2", name: "Green shakshuka", slot: "breakfast", minutes: 20, emoji: "🍳",
    macros: { kcal: 420, protein: 24, carbs: 22, fat: 26 }, tags: ["vegetarian", "low-carb"],
    ingredients: ["3 eggs", "200g spinach", "1 courgette", "Feta", "Olive oil"],
    steps: ["Wilt greens with oil and garlic.", "Make wells, crack in eggs.", "Cover 6 min, crumble feta over."],
  },
  {
    id: "r3", name: "Crunchy chicken bowl", slot: "lunch", minutes: 18, emoji: "🥗",
    macros: { kcal: 520, protein: 45, carbs: 38, fat: 18 }, tags: ["high-protein"],
    ingredients: ["180g chicken breast", "100g cooked quinoa", "Cucumber & carrot", "Yogurt-lime dressing"],
    steps: ["Grill seasoned chicken 6 min per side.", "Toss veg with dressing.", "Build bowl, slice chicken on top."],
  },
  {
    id: "r4", name: "Miso salmon rice", slot: "dinner", minutes: 25, emoji: "🐟",
    macros: { kcal: 580, protein: 42, carbs: 52, fat: 20 }, tags: ["omega-3"],
    ingredients: ["1 salmon fillet", "150g rice", "Miso paste", "Honey", "Tenderstem broccoli"],
    steps: ["Glaze salmon with miso + honey.", "Roast 14 min at 200C.", "Serve on rice with steamed broccoli."],
  },
  {
    id: "r5", name: "Smoky bean chilli", slot: "dinner", minutes: 30, emoji: "🍲",
    macros: { kcal: 470, protein: 22, carbs: 66, fat: 11 }, tags: ["vegan", "batch-cook"],
    ingredients: ["Black beans", "Kidney beans", "Chopped tomatoes", "Smoked paprika", "Brown rice"],
    steps: ["Soften onion, pepper and spices.", "Add beans and tomatoes, simmer 20 min.", "Serve with rice and lime."],
  },
  {
    id: "r6", name: "Halloumi grain salad", slot: "lunch", minutes: 15, emoji: "🧆",
    macros: { kcal: 540, protein: 28, carbs: 44, fat: 26 }, tags: ["vegetarian"],
    ingredients: ["120g halloumi", "Bulgur wheat", "Roast peppers", "Mint", "Lemon"],
    steps: ["Pan-fry halloumi until golden.", "Toss grains with peppers and herbs.", "Top with halloumi and lemon."],
  },
  {
    id: "r7", name: "Cocoa protein mousse", slot: "snack", minutes: 5, emoji: "🍫",
    macros: { kcal: 230, protein: 24, carbs: 18, fat: 6 }, tags: ["sweet", "high-protein"],
    ingredients: ["200g skyr", "1 tbsp cocoa", "1 scoop protein", "Honey"],
    steps: ["Whisk everything until fluffy.", "Chill 10 min.", "Top with cacao nibs."],
  },
  {
    id: "r8", name: "Hummus & veg plate", slot: "snack", minutes: 5, emoji: "🥕",
    macros: { kcal: 260, protein: 10, carbs: 26, fat: 13 }, tags: ["vegan"],
    ingredients: ["100g hummus", "Carrot sticks", "Cucumber", "Wholegrain crackers"],
    steps: ["Slice veg.", "Plate with hummus and crackers."],
  },
  {
    id: "r9", name: "Teriyaki tofu noodles", slot: "dinner", minutes: 22, emoji: "🍜",
    macros: { kcal: 510, protein: 27, carbs: 68, fat: 13 }, tags: ["vegan"],
    ingredients: ["200g firm tofu", "Soba noodles", "Pak choi", "Teriyaki sauce", "Sesame"],
    steps: ["Crisp tofu in a hot pan.", "Boil noodles, wilt pak choi.", "Toss all with sauce and sesame."],
  },
  {
    id: "r10", name: "Turkey egg wrap", slot: "breakfast", minutes: 12, emoji: "🌯",
    macros: { kcal: 400, protein: 34, carbs: 32, fat: 15 }, tags: ["high-protein"],
    ingredients: ["Wholewheat wrap", "2 eggs", "60g turkey", "Spinach", "Hot sauce"],
    steps: ["Scramble eggs softly.", "Warm wrap, layer turkey and spinach.", "Add eggs, roll and slice."],
  },
];

export type Exercise = {
  id: string;
  name: string;
  group: string;
  equipment: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  emoji: string;
  cues: string[];
};

export const EXERCISES: Exercise[] = [
  { id: "e1", name: "Goblet squat", group: "Legs", equipment: "Dumbbell", level: "Beginner", emoji: "🏋️", cues: ["Chest tall, elbows inside knees", "Sit down between the hips", "Drive the floor away"] },
  { id: "e2", name: "Push-up", group: "Chest", equipment: "Bodyweight", level: "Beginner", emoji: "💪", cues: ["Ribs down, glutes on", "Elbows at 45°", "Full lockout each rep"] },
  { id: "e3", name: "Dumbbell row", group: "Back", equipment: "Dumbbell", level: "Beginner", emoji: "🚣", cues: ["Long spine", "Pull to the hip", "Pause at the top"] },
  { id: "e4", name: "Romanian deadlift", group: "Legs", equipment: "Barbell", level: "Intermediate", emoji: "🦵", cues: ["Hinge, don't squat", "Bar close to legs", "Stretch the hamstrings"] },
  { id: "e5", name: "Overhead press", group: "Shoulders", equipment: "Barbell", level: "Intermediate", emoji: "🙋", cues: ["Brace the midsection", "Head through at the top", "Bar over mid-foot"] },
  { id: "e6", name: "Plank", group: "Core", equipment: "Bodyweight", level: "Beginner", emoji: "🧘", cues: ["Straight line ears to heels", "Squeeze glutes", "Breathe steadily"] },
  { id: "e7", name: "Kettlebell swing", group: "Full body", equipment: "Kettlebell", level: "Intermediate", emoji: "🔔", cues: ["Snap the hips", "Arms are ropes", "Bell floats to chest height"] },
  { id: "e8", name: "Bulgarian split squat", group: "Legs", equipment: "Dumbbell", level: "Advanced", emoji: "🦿", cues: ["Front foot flat", "Knee tracks over toes", "Control the descent"] },
  { id: "e9", name: "Lat pulldown", group: "Back", equipment: "Machine", level: "Beginner", emoji: "🧗", cues: ["Chest up", "Elbows to pockets", "Slow return"] },
  { id: "e10", name: "Bench press", group: "Chest", equipment: "Barbell", level: "Intermediate", emoji: "🛏️", cues: ["Shoulder blades tucked", "Bar to lower chest", "Legs drive"] },
  { id: "e11", name: "Mountain climber", group: "Cardio", equipment: "Bodyweight", level: "Beginner", emoji: "⛰️", cues: ["Hips low", "Quick feet", "Steady breathing"] },
  { id: "e12", name: "Burpee", group: "Cardio", equipment: "Bodyweight", level: "Intermediate", emoji: "🔥", cues: ["Soft landing", "Chest to floor", "Stand tall each rep"] },
  { id: "e13", name: "Face pull", group: "Shoulders", equipment: "Cable", level: "Beginner", emoji: "🎯", cues: ["Pull to eye level", "External rotate", "Light weight, high reps"] },
  { id: "e14", name: "Hanging knee raise", group: "Core", equipment: "Pull-up bar", level: "Intermediate", emoji: "🪝", cues: ["No swinging", "Curl the pelvis", "Lower slowly"] },
  { id: "e15", name: "Rowing intervals", group: "Cardio", equipment: "Machine", level: "Intermediate", emoji: "🚀", cues: ["Legs, body, arms", "Drive with the heels", "Strong finish"] },
  { id: "e16", name: "Walking lunge", group: "Legs", equipment: "Dumbbell", level: "Beginner", emoji: "🚶", cues: ["Long stride", "Torso upright", "Knee kisses the floor"] },
  { id: "e17", name: "Incline dumbbell press", group: "Chest", equipment: "Dumbbell", level: "Intermediate", emoji: "📐", cues: ["30° bench", "Elbows under wrists", "Squeeze at the top"] },
  { id: "e18", name: "Bird dog", group: "Core", equipment: "Bodyweight", level: "Beginner", emoji: "🐕", cues: ["Hips level", "Reach long", "Slow and controlled"] },
];

export type WorkoutBlock = { exerciseId: string; sets: number; reps: string; restSec: number };
export type Workout = {
  id: string;
  name: string;
  focus: string;
  minutes: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  kcal: number;
  emoji: string;
  blocks: WorkoutBlock[];
};

export const WORKOUTS: Workout[] = [
  {
    id: "w1", name: "Full body reset", focus: "Full body", minutes: 32, level: "Beginner", kcal: 280, emoji: "🌿",
    blocks: [
      { exerciseId: "e1", sets: 3, reps: "10", restSec: 60 },
      { exerciseId: "e2", sets: 3, reps: "8-12", restSec: 60 },
      { exerciseId: "e3", sets: 3, reps: "10 / side", restSec: 60 },
      { exerciseId: "e6", sets: 3, reps: "40 sec", restSec: 45 },
    ],
  },
  {
    id: "w2", name: "Upper body strength", focus: "Push & pull", minutes: 45, level: "Intermediate", kcal: 380, emoji: "💪",
    blocks: [
      { exerciseId: "e10", sets: 4, reps: "6-8", restSec: 90 },
      { exerciseId: "e9", sets: 4, reps: "10", restSec: 75 },
      { exerciseId: "e5", sets: 3, reps: "8", restSec: 75 },
      { exerciseId: "e13", sets: 3, reps: "15", restSec: 45 },
    ],
  },
  {
    id: "w3", name: "Lower body power", focus: "Legs & glutes", minutes: 42, level: "Intermediate", kcal: 400, emoji: "🦵",
    blocks: [
      { exerciseId: "e4", sets: 4, reps: "8", restSec: 90 },
      { exerciseId: "e8", sets: 3, reps: "10 / side", restSec: 75 },
      { exerciseId: "e16", sets: 3, reps: "20 steps", restSec: 60 },
      { exerciseId: "e18", sets: 3, reps: "8 / side", restSec: 45 },
    ],
  },
  {
    id: "w4", name: "20-min sweat", focus: "Conditioning", minutes: 20, level: "Beginner", kcal: 240, emoji: "🔥",
    blocks: [
      { exerciseId: "e12", sets: 4, reps: "30 sec", restSec: 30 },
      { exerciseId: "e11", sets: 4, reps: "40 sec", restSec: 30 },
      { exerciseId: "e7", sets: 4, reps: "15", restSec: 40 },
    ],
  },
  {
    id: "w5", name: "Core & mobility", focus: "Core", minutes: 25, level: "Beginner", kcal: 160, emoji: "🧘",
    blocks: [
      { exerciseId: "e6", sets: 3, reps: "45 sec", restSec: 40 },
      { exerciseId: "e14", sets: 3, reps: "10", restSec: 50 },
      { exerciseId: "e18", sets: 3, reps: "10 / side", restSec: 40 },
    ],
  },
  {
    id: "w6", name: "Engine builder", focus: "Cardio", minutes: 35, level: "Advanced", kcal: 430, emoji: "🚀",
    blocks: [
      { exerciseId: "e15", sets: 6, reps: "500m", restSec: 60 },
      { exerciseId: "e7", sets: 4, reps: "20", restSec: 50 },
      { exerciseId: "e12", sets: 3, reps: "40 sec", restSec: 45 },
    ],
  },
];

export const DEFAULT_HABITS = [
  { id: "h1", name: "Drink 2L water", emoji: "💧" },
  { id: "h2", name: "10k steps", emoji: "👟" },
  { id: "h3", name: "Sleep 7h+", emoji: "😴" },
  { id: "h4", name: "Veg with every meal", emoji: "🥦" },
  { id: "h5", name: "5 min stretch", emoji: "🧘" },
];

export type Achievement = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  goal: number;
  metric: "streak" | "workouts" | "meals" | "habits" | "water";
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", name: "First step", description: "Log your very first meal", emoji: "🌱", goal: 1, metric: "meals" },
  { id: "a2", name: "Consistency spark", description: "Reach a 3-day streak", emoji: "✨", goal: 3, metric: "streak" },
  { id: "a3", name: "Week warrior", description: "Reach a 7-day streak", emoji: "🔥", goal: 7, metric: "streak" },
  { id: "a4", name: "Sweat starter", description: "Finish 3 workouts", emoji: "🏅", goal: 3, metric: "workouts" },
  { id: "a5", name: "Training habit", description: "Finish 10 workouts", emoji: "🏆", goal: 10, metric: "workouts" },
  { id: "a6", name: "Food logger", description: "Log 25 meals", emoji: "📒", goal: 25, metric: "meals" },
  { id: "a7", name: "Hydration hero", description: "Log 40 glasses of water", emoji: "💧", goal: 40, metric: "water" },
  { id: "a8", name: "Habit builder", description: "Tick 30 habits", emoji: "🧩", goal: 30, metric: "habits" },
];

export const CHALLENGES = [
  { id: "c1", text: "Hit your protein target today", emoji: "🥚", xp: 30 },
  { id: "c2", text: "Take a 15-minute walk after a meal", emoji: "🚶", xp: 20 },
  { id: "c3", text: "Add a second portion of vegetables", emoji: "🥬", xp: 20 },
  { id: "c4", text: "Drink water before every meal", emoji: "💧", xp: 15 },
  { id: "c5", text: "Stretch for 5 minutes before bed", emoji: "🧘", xp: 15 },
  { id: "c6", text: "Cook one meal from scratch", emoji: "🍳", xp: 30 },
  { id: "c7", text: "Go to bed 30 minutes earlier", emoji: "😴", xp: 25 },
];

export const COMMUNITY = [
  { name: "Maya", emoji: "🧗", text: "Day 21 of tracking — down 2.4kg and lifting heavier than ever.", cheers: 128 },
  { name: "Tobi", emoji: "🏃", text: "Meal prepped 5 lunches on Sunday. Weekday decisions are so much easier.", cheers: 96 },
  { name: "Aisha", emoji: "🚴", text: "Finally hit a 14-day streak. The habit ticks are weirdly addictive.", cheers: 173 },
  { name: "Leo", emoji: "🏋️", text: "Swapped evening snacks for a protein mousse. Same treat, half the calories.", cheers: 64 },
];

export const GROCERY_CATEGORIES = ["Produce", "Protein", "Grains", "Dairy", "Pantry", "Other"] as const;
export type GroceryCategory = (typeof GROCERY_CATEGORIES)[number];

export function categorise(item: string): GroceryCategory {
  const s = item.toLowerCase();
  if (/(spinach|berry|berries|apple|banana|carrot|cucumber|pepper|broccoli|pak choi|courgette|mint|lemon|lime|onion|tomato|veg)/.test(s)) return "Produce";
  if (/(chicken|salmon|tofu|turkey|beef|steak|egg|shrimp|bean|lentil|chickpea|protein)/.test(s)) return "Protein";
  if (/(oat|rice|quinoa|noodle|wrap|bulgur|cracker|bread)/.test(s)) return "Grains";
  if (/(yogurt|skyr|milk|feta|halloumi|cheese)/.test(s)) return "Dairy";
  if (/(miso|honey|sauce|paprika|oil|cocoa|chia|sesame|hummus|nib)/.test(s)) return "Pantry";
  return "Other";
}