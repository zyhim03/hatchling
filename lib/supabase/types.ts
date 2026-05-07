/**
 * Hand-written types for the `profiles` table. Mirrors the shape the
 * progress hooks use locally (Progress, DailyState, BossState).
 */

export type ProfileRow = {
  user_id: string;
  display_name: string | null;

  completed: number[];
  xp: number;
  stars: Record<number, number>;
  attempts: Record<number, number>;
  streak: number;
  best_streak: number;
  last_chapter: number | null;
  started_at: number | null;

  daily_history: Record<
    string,
    { dateKey: string; correct: number; total: number; perfect: boolean }
  >;
  daily_streak: number;
  daily_best_streak: number;
  daily_last_perfect: string | null;

  boss_runs: { ts: number; correct: number; total: number; durationMs: number }[];
  boss_best:
    | { ts: number; correct: number; total: number; durationMs: number }
    | null;

  updated_at: string;
};
