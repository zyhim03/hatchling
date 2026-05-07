"use client";

import { useCallback } from "react";
import { useProfileSync } from "./supabase/profileSync";

/* ─── Daily challenge progress ─────────────────────────────────── */

export type DailyResult = {
  dateKey: string;
  correct: number;
  total: number;
  perfect: boolean;
};

export type DailyState = {
  history: Record<string, DailyResult>;
  streak: number; // consecutive perfect days
  bestStreak: number;
  lastPerfectDate: string | null;
};

function isYesterday(prev: string, today: string): boolean {
  const [y1, m1, d1] = prev.split("-").map(Number);
  const [y2, m2, d2] = today.split("-").map(Number);
  const a = new Date(y1, m1 - 1, d1).getTime();
  const b = new Date(y2, m2 - 1, d2).getTime();
  const diffDays = Math.round((b - a) / 86400000);
  return diffDays === 1;
}

export function useDaily() {
  const { state, hydrated, update } = useProfileSync();

  const recordDaily = useCallback(
    (dateKey: string, correct: number, total: number) => {
      update((prev) => {
        const d = prev.daily;
        const perfect = correct === total;
        let streak = d.streak;
        if (perfect) {
          if (!d.lastPerfectDate) streak = 1;
          else if (d.lastPerfectDate === dateKey) streak = d.streak;
          else if (isYesterday(d.lastPerfectDate, dateKey)) streak = d.streak + 1;
          else streak = 1;
        } else if (d.lastPerfectDate && d.lastPerfectDate !== dateKey) {
          streak = 0;
        }

        return {
          ...prev,
          daily: {
            ...d,
            history: {
              ...d.history,
              [dateKey]: { dateKey, correct, total, perfect },
            },
            streak,
            bestStreak: Math.max(d.bestStreak, streak),
            lastPerfectDate: perfect ? dateKey : d.lastPerfectDate,
          },
        };
      });
    },
    [update]
  );

  return { state: state.daily, hydrated, recordDaily };
}

/* ─── Boss rush progress ───────────────────────────────────────── */

export type BossRun = {
  ts: number;
  correct: number;
  total: number;
  durationMs: number;
};

export type BossState = {
  runs: BossRun[]; // capped at 10 most recent
  best: BossRun | null; // by score then time
};

function isBetter(a: BossRun, b: BossRun) {
  if (a.correct !== b.correct) return a.correct > b.correct;
  return a.durationMs < b.durationMs;
}

export function useBoss() {
  const { state, hydrated, update } = useProfileSync();

  const recordRun = useCallback(
    (run: BossRun) => {
      update((prev) => {
        const b = prev.boss;
        const runs = [run, ...b.runs].slice(0, 10);
        const best = !b.best || isBetter(run, b.best) ? run : b.best;
        return { ...prev, boss: { runs, best } };
      });
    },
    [update]
  );

  return { state: state.boss, hydrated, recordRun };
}
