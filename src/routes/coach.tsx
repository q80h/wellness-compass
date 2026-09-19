import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/vitals";
import { askCoach } from "@/lib/coach.functions";
import { dateKey, sumMacros, useStore } from "@/lib/store";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "AI nutrition coach — Vitl" },
      {
        name: "description",
        content:
          "Ask Vitl's AI coach what to eat next, how to hit your protein target or how to adapt your training week.",
      },
      { property: "og:title", content: "AI nutrition coach — Vitl" },
      {
        property: "og:description",
        content: "Personalised food and training answers based on what you logged today.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoachPage,
});

type Msg = { role: "user" | "coach"; text: string };

const SUGGESTIONS = [
  "What should I eat for dinner tonight?",
  "How do I hit my protein target today?",
  "I'm low on energy — what should I change?",
  "Give me a quick high-protein snack idea",
  "How should I plan my training this week?",
];

function CoachPage() {
  const { state, day, targets, streak } = useStore();
  const call = useServerFn(askCoach);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "coach",
      text: "Hi! I'm your Vitl coach. I can see today's calories, macros, water and training — ask me anything about what to eat or do next.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    const log = day(dateKey());
    const totals = sumMacros(log.meals);
    const context = [
      `Goal: ${state.profile.goal}`,
      `Weight ${state.profile.weightKg}kg, target ${state.profile.targetWeightKg}kg, activity ${state.profile.activity}`,
      `Diet preferences: ${state.profile.diet.length ? state.profile.diet.join(", ") : "none"}`,
      `Targets: ${targets.kcal} kcal, ${targets.protein}g protein, ${targets.carbs}g carbs, ${targets.fat}g fat`,
      `Eaten so far: ${totals.kcal} kcal, ${totals.protein}g protein, ${totals.carbs}g carbs, ${totals.fat}g fat`,
      `Meals logged: ${log.meals.map((m) => m.name).join(", ") || "none"}`,
      `Water: ${log.water}/${targets.water} glasses`,
      `Workouts today: ${log.workouts.length}`,
      `Current streak: ${streak} days`,
    ].join("\n");

    try {
      const res = await call({ data: { question: q, context } });
      setMessages((m) => [...m, { role: "coach", text: res.text }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "coach", text: "I couldn't reach the coach just now. Please try again in a moment." },
      ]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
  };

  return (
    <AppShell title="Coach" subtitle="Ask anything about food and training">
      <div className="space-y-5">
        <section className="surface-card p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI nutrition assistant
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Your coach sees today's logged food, macros, water and workouts, so answers are tailored
            to you. It never gives medical advice.
          </p>
        </section>

        <section className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
                  : "surface-card max-w-[92%] px-4 py-3 text-sm whitespace-pre-wrap"
              }
            >
              {m.text}
            </div>
          ))}
          {busy ? (
            <div className="surface-card flex max-w-[92%] items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking about your day…
            </div>
          ) : null}
          <div ref={endRef} />
        </section>

        <section>
          <SectionTitle title="Try asking" subtitle="Tap a question to send it" />
          <div className="scroll-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={busy}
                onClick={() => void send(s)}
                className="press shrink-0 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        <form
          className="sticky bottom-24 z-10 flex items-end gap-2 lg:bottom-4"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder="Ask your coach…"
            aria-label="Ask your coach"
            className="min-h-12 resize-none rounded-2xl bg-card"
          />
          <Button
            type="submit"
            variant="hero"
            size="icon-lg"
            disabled={busy || input.trim().length === 0}
            aria-label="Send question"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}