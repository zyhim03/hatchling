"use client";

import { useCallback } from "react";
import { CHAPTERS } from "./chapters";
import { useProfileSync } from "./supabase/profileSync";

export type Progress = {
  completed: number[]; // chapter ids
  xp: number;
  lastChapter: number | null;
  streak: number;
  bestStreak: number;
  stars: Record<number, number>; // chapter id -> 0..3
  attempts: Record<number, number>; // chapter id -> # of attempts on the challenge
  startedAt: number | null;
};

/**
 * useProgress now reads/writes through the unified profile sync layer.
 * Behavior unchanged for guests (still localStorage); when authed, the
 * same state is mirrored to Supabase with debounce.
 */
export function useProgress() {
  const { state, hydrated, update } = useProfileSync();
  const progress = state.progress;

  const complete = useCallback(
    (id: number, stars = 0, perfect = false) => {
      update((prev) => {
        const p = prev.progress;
        const alreadyDone = p.completed.includes(id);
        const ch = CHAPTERS.find((c) => c.id === id);
        const baseXP = ch?.xp ?? 0;
        const starBonus = stars * 25;
        const perfectBonus = perfect ? 50 : 0;
        const earnedXP = alreadyDone ? 0 : baseXP + starBonus + perfectBonus;

        const prevStars = p.stars[id] ?? 0;
        const nextStars = Math.max(prevStars, stars);
        const newStreak = perfect ? p.streak + 1 : p.streak;

        const next: Progress = {
          ...p,
          completed: alreadyDone
            ? p.completed
            : [...p.completed, id].sort((a, b) => a - b),
          xp: p.xp + earnedXP,
          lastChapter: id,
          streak: newStreak,
          bestStreak: Math.max(p.bestStreak, newStreak),
          stars: { ...p.stars, [id]: nextStars },
          startedAt: p.startedAt ?? Date.now(),
        };
        return { ...prev, progress: next };
      });
    },
    [update]
  );

  const breakStreak = useCallback(() => {
    update((prev) => ({
      ...prev,
      progress: { ...prev.progress, streak: 0 },
    }));
  }, [update]);

  const recordAttempt = useCallback(
    (id: number) => {
      update((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          attempts: {
            ...prev.progress.attempts,
            [id]: (prev.progress.attempts[id] ?? 0) + 1,
          },
        },
      }));
    },
    [update]
  );

  const visit = useCallback(
    (id: number) => {
      update((prev) => ({
        ...prev,
        progress: {
          ...prev.progress,
          lastChapter: id,
          startedAt: prev.progress.startedAt ?? Date.now(),
        },
      }));
    },
    [update]
  );

  const reset = useCallback(() => {
    update(() => ({
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
    }));
  }, [update]);

  const isUnlocked = useCallback(
    (id: number) => {
      if (id === 0) return true;
      return (
        progress.completed.includes(id - 1) || progress.completed.includes(id)
      );
    },
    [progress.completed]
  );

  const isComplete = useCallback(
    (id: number) => progress.completed.includes(id),
    [progress.completed]
  );

  return {
    progress,
    hydrated,
    complete,
    visit,
    reset,
    isUnlocked,
    isComplete,
    breakStreak,
    recordAttempt,
  };
}
