"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowser } from "./client";
import { useUser } from "./useUser";
import type { ProfileRow } from "./types";
import type { Progress } from "@/lib/progress";
import type { DailyState, BossState } from "@/lib/sideProgress";

const PROGRESS_KEY = "hatchling.progress.v1";
const DAILY_KEY = "hatchling.daily.v1";
const BOSS_KEY = "hatchling.boss.v1";

export type CombinedState = {
  progress: Progress;
  daily: DailyState;
  boss: BossState;
};

const empty = (): CombinedState => ({
  progress: {
    completed: [],
    xp: 0,
    lastChapter: null,
    streak: 0,
    bestStreak: 0,
    stars: {},
    attempts: {},
    startedAt: null,
  },
  daily: {
    history: {},
    streak: 0,
    bestStreak: 0,
    lastPerfectDate: null,
  },
  boss: { runs: [], best: null },
});

function readLocal(): CombinedState {
  if (typeof window === "undefined") return empty();
  const out = empty();
  try {
    const p = localStorage.getItem(PROGRESS_KEY);
    if (p) Object.assign(out.progress, JSON.parse(p));
    const d = localStorage.getItem(DAILY_KEY);
    if (d) Object.assign(out.daily, JSON.parse(d));
    const b = localStorage.getItem(BOSS_KEY);
    if (b) Object.assign(out.boss, JSON.parse(b));
  } catch {
    // ignore
  }
  return out;
}

function writeLocal(s: CombinedState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(s.progress));
  localStorage.setItem(DAILY_KEY, JSON.stringify(s.daily));
  localStorage.setItem(BOSS_KEY, JSON.stringify(s.boss));
}

function rowToCombined(row: ProfileRow): CombinedState {
  return {
    progress: {
      completed: row.completed ?? [],
      xp: row.xp ?? 0,
      stars: row.stars ?? {},
      attempts: row.attempts ?? {},
      streak: row.streak ?? 0,
      bestStreak: row.best_streak ?? 0,
      lastChapter: row.last_chapter ?? null,
      startedAt: row.started_at ?? null,
    },
    daily: {
      history: row.daily_history ?? {},
      streak: row.daily_streak ?? 0,
      bestStreak: row.daily_best_streak ?? 0,
      lastPerfectDate: row.daily_last_perfect ?? null,
    },
    boss: {
      runs: row.boss_runs ?? [],
      best: row.boss_best ?? null,
    },
  };
}

function combinedToRow(s: CombinedState): Partial<ProfileRow> {
  return {
    completed: s.progress.completed,
    xp: s.progress.xp,
    stars: s.progress.stars,
    attempts: s.progress.attempts,
    streak: s.progress.streak,
    best_streak: s.progress.bestStreak,
    last_chapter: s.progress.lastChapter,
    started_at: s.progress.startedAt,
    daily_history: s.daily.history,
    daily_streak: s.daily.streak,
    daily_best_streak: s.daily.bestStreak,
    daily_last_perfect: s.daily.lastPerfectDate,
    boss_runs: s.boss.runs,
    boss_best: s.boss.best,
  };
}

/** Merge guest localStorage with whatever the DB had. Local wins for "more progress". */
function mergePreferringMore(
  local: CombinedState,
  remote: CombinedState
): CombinedState {
  const local_xp = local.progress.xp ?? 0;
  const remote_xp = remote.progress.xp ?? 0;
  const winner = local_xp >= remote_xp ? local : remote;
  return {
    progress: { ...winner.progress },
    daily: {
      ...winner.daily,
      // Keep all daily history we've seen on either side.
      history: { ...remote.daily.history, ...local.daily.history },
    },
    boss: {
      ...winner.boss,
      // Concat run history and re-sort by recency.
      runs: [...local.boss.runs, ...remote.boss.runs]
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 10),
    },
  };
}

/**
 * Bridge hook used internally by `useProgress` / `useDaily` / `useBoss` once
 * we wire them. Exposes a single CombinedState with auto sync.
 */
export function useProfileSync() {
  const { user, loading: authLoading } = useUser();
  const [state, setState] = useState<CombinedState>(empty());
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialPullDone = useRef(false);

  // 1) On mount: load local state immediately.
  useEffect(() => {
    const local = readLocal();
    setState(local);
    stateRef.current = local;
    setHydrated(true);
  }, []);

  // 2) When user signs in: pull profile, optionally migrate local guest progress.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      initialPullDone.current = false;
      return;
    }
    const supabase = getSupabaseBrowser();
    if (!supabase) return;

    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (cancelled) return;
      if (error && error.code !== "PGRST116") {
        console.warn("[hatchling] profile fetch failed:", error.message);
        return;
      }
      const remote: CombinedState = data ? rowToCombined(data as ProfileRow) : empty();
      const local = stateRef.current;
      const merged = mergePreferringMore(local, remote);
      setState(merged);
      stateRef.current = merged;
      writeLocal(merged); // keep local mirror in sync

      // If the merge promoted local-only data, push it back up.
      if (JSON.stringify(merged) !== JSON.stringify(remote)) {
        await supabase.from("profiles").upsert(
          {
            user_id: user.id,
            ...combinedToRow(merged),
          },
          { onConflict: "user_id" }
        );
      }
      initialPullDone.current = true;
    })();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  // 3) Debounced push when state changes (only when authed + after initial pull).
  const scheduleSave = useCallback(
    (next: CombinedState) => {
      if (!user || !initialPullDone.current) return;
      const supabase = getSupabaseBrowser();
      if (!supabase) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await supabase
          .from("profiles")
          .upsert(
            { user_id: user.id, ...combinedToRow(next) },
            { onConflict: "user_id" }
          );
      }, 700);
    },
    [user]
  );

  const update = useCallback(
    (mut: (prev: CombinedState) => CombinedState) => {
      setState((prev) => {
        const next = mut(prev);
        stateRef.current = next;
        writeLocal(next);
        scheduleSave(next);
        return next;
      });
    },
    [scheduleSave]
  );

  return { state, hydrated, update, user };
}
