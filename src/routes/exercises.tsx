import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Chip, SectionTitle } from "@/components/vitals";
import { EXERCISES, WORKOUTS, type Exercise } from "@/lib/data";

export const Route = createFileRoute("/exercises")({
  head: () => ({
    meta: [
      { title: "Exercise library — Vitl" },
      {
        name: "description",
        content:
          "Search every exercise by muscle group, equipment and level, with coaching cues for perfect form.",
      },
      { property: "og:title", content: "Exercise library — Vitl" },
      { property: "og:description", content: "Coaching cues for every move in your plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExercisesPage,
});

function ExercisesPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const [detail, setDetail] = useState<Exercise | null>(null);

  const groups = useMemo(() => ["All", ...new Set(EXERCISES.map((e) => e.group))], []);
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter(
      (e) =>
        (group === "All" || e.group === group) &&
        (q === "" || e.name.toLowerCase().includes(q) || e.equipment.toLowerCase().includes(q)),
    );
  }, [query, group]);

  const usedIn = (id: string) => WORKOUTS.filter((w) => w.blocks.some((b) => b.exerciseId === id));

  return (
    <AppShell title="Exercises" subtitle={`${EXERCISES.length} moves with coaching cues`}>
      <div className="space-y-5">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exercises or equipment"
            aria-label="Search exercises"
            className="h-12 rounded-2xl pl-10"
          />
        </div>

        <div className="scroll-hide -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {groups.map((g) => (
            <Chip key={g} active={group === g} onClick={() => setGroup(g)}>
              {g}
            </Chip>
          ))}
        </div>

        <section>
          <SectionTitle title="Library" subtitle={`${list.length} exercises`} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setDetail(e)}
                className="surface-card press hover-lift p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary text-xl">
                    {e.emoji}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{e.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {e.group} · {e.equipment}
                    </div>
                  </div>
                </div>
                <p className="mt-3 truncate text-xs text-muted-foreground">{e.cues[0]}</p>
              </button>
            ))}
            {list.length === 0 ? (
              <p className="text-sm text-muted-foreground">No exercises match that search.</p>
            ) : null}
          </div>
        </section>
      </div>

      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {detail?.emoji} {detail?.name}
            </DialogTitle>
            <DialogDescription>
              {detail ? `${detail.group} · ${detail.equipment} · ${detail.level}` : ""}
            </DialogDescription>
          </DialogHeader>
          {detail ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold">Coaching cues</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {detail.cues.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold">Appears in</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {usedIn(detail.id).length > 0
                    ? usedIn(detail.id)
                        .map((w) => w.name)
                        .join(", ")
                    : "Not in one of your current plans yet."}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}