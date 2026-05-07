"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TopBar } from "@/components/game/TopBar";
import { Mascot } from "@/components/game/Mascot";
import { XPBar } from "@/components/game/XPBar";
import { Stars } from "@/components/game/Stars";
import { Sparkle } from "@/components/game/Scribble";
import { WorldMap } from "@/components/game/WorldMap";
import {
  CHAPTERS,
  STAGE_FOR_PROGRESS,
  STAGE_LABEL,
  TOTAL_XP,
} from "@/lib/chapters";
import { useProgress } from "@/lib/progress";
import { useDaily, useBoss } from "@/lib/sideProgress";
import { todayKey } from "@/lib/quizPool";

export default function PlayMap() {
  const { progress, hydrated, isUnlocked, isComplete, reset } = useProgress();
  const { state: dailyState, hydrated: dailyHydrated } = useDaily();
  const { state: bossState, hydrated: bossHydrated } = useBoss();
  const stage = STAGE_FOR_PROGRESS(progress.completed.length);
  const pct = Math.round((progress.completed.length / CHAPTERS.length) * 100);
  const totalStars = hydrated
    ? Object.values(progress.stars).reduce((a, b) => a + b, 0)
    : 0;
  const maxStars = CHAPTERS.length * 3;
  const todaysDaily = dailyHydrated ? dailyState.history[todayKey()] : undefined;
  const dailyDone = !!todaysDaily;

  return (
    <main className="min-h-screen relative">
      <TopBar />

      <div className="mx-auto max-w-7xl px-6 py-8 relative">
        {/* Big page heading */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-ember mb-2">
              ⚔ the journey
            </div>
            <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05]">
              Hatchling{"'s "}
              <span className="font-serif-wonky italic text-ember">
                world
              </span>
              .
            </h1>
            <p className="text-ink-mute mt-1 text-sm">
              From the nest to the sky · eleven stops along the way
            </p>
          </div>

          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center gap-4 rounded-pill border border-line/60 bg-bg-elev/60 backdrop-blur px-4 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
                stage
              </span>
              <span className="font-display text-sm text-ink">
                {STAGE_LABEL[stage]}
              </span>
            </div>
            <span className="w-px h-4 bg-line/50" />
            <Stars count={Math.round((totalStars / maxStars) * 3)} size={14} />
            <span className="text-xs font-mono text-ember">
              {totalStars}/{maxStars}
            </span>
            {progress.streak > 0 && (
              <>
                <span className="w-px h-4 bg-line/50" />
                <span className="text-xs font-mono text-yolk">
                  🔥 {progress.streak}
                </span>
              </>
            )}
          </motion.div>
        </div>

        {/* Layout: map (centerpiece) + side rails */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* The big illustrated journey */}
          <WorldMap
            isUnlocked={(id) => (hydrated ? isUnlocked(id) : id === 0)}
            isComplete={(id) => (hydrated ? isComplete(id) : false)}
            starsByChapter={hydrated ? progress.stars : {}}
            completedCount={hydrated ? progress.completed.length : 0}
          />

          {/* Side rail */}
          <div className="space-y-4">
            {/* Status banner — sticky */}
            <div className="rounded-card border-2 border-line/60 bg-gradient-to-br from-bg-elev/80 to-bg-soft/40 p-5 relative overflow-hidden">
              <Sparkle className="absolute top-2 right-2" size={12} />
              <div className="flex items-start gap-3">
                <div className="wobble flex-shrink-0">
                  <Mascot stage={stage} size={64} />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
                    your hatchling
                  </div>
                  <div className="font-display text-xl tracking-tight">
                    {STAGE_LABEL[stage]}
                  </div>
                  <div className="text-xs text-ink-mute mt-0.5">
                    {progress.completed.length} / {CHAPTERS.length} cleared ·
                    {pct}%
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <XPBar xp={hydrated ? progress.xp : 0} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-1 text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim text-center">
                <Stat label="xp" value={hydrated ? `${progress.xp}` : "—"} />
                <Stat
                  label="stars"
                  value={hydrated ? `${totalStars}/${maxStars}` : "—"}
                />
                <Stat
                  label="streak"
                  value={
                    hydrated
                      ? progress.streak > 0
                        ? `🔥${progress.streak}`
                        : "—"
                      : "—"
                  }
                />
              </div>
            </div>

            {/* Daily ticket */}
            <Link
              href="/play/daily"
              className="group block rounded-card border-2 border-dashed border-yolk/50 bg-gradient-to-br from-yolk/10 to-ember/10 p-5 hover:border-yolk hover:from-yolk/20 transition relative overflow-hidden"
            >
              <Sparkle className="absolute top-2 right-2" size={10} color="#ffcd6b" />
              <div className="flex items-start gap-3">
                <div className="text-3xl">☀️</div>
                <div className="flex-1">
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-yolk mb-0.5">
                    daily ticket
                  </div>
                  <div className="font-display text-base tracking-tight">
                    Today's{" "}
                    <span className="font-serif-wonky italic text-ember">
                      five
                    </span>
                  </div>
                  <div className="text-xs text-ink-mute mt-0.5">
                    {dailyDone
                      ? `done — ${todaysDaily?.correct}/${todaysDaily?.total}`
                      : "five questions, fresh today"}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-ink-dim">
                  streak{" "}
                  <span className="text-yolk">
                    {dailyHydrated && dailyState.streak > 0
                      ? `🔥${dailyState.streak}`
                      : "—"}
                  </span>
                </span>
                <span className="text-ember group-hover:translate-x-0.5 transition">
                  enter →
                </span>
              </div>
            </Link>

            {/* Boss rush ticket */}
            <Link
              href="/play/boss-rush"
              className="group block rounded-card border-2 border-dashed border-rose/50 bg-gradient-to-br from-rose/10 to-violet/10 p-5 hover:border-rose hover:from-rose/20 transition relative overflow-hidden"
            >
              <Sparkle
                className="absolute top-2 right-2"
                size={10}
                color="#ff7aa6"
              />
              <div className="flex items-start gap-3">
                <div className="text-3xl">⚔️</div>
                <div className="flex-1">
                  <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-rose mb-0.5">
                    boss arena
                  </div>
                  <div className="font-display text-base tracking-tight">
                    Ten in{" "}
                    <span className="font-serif-wonky italic text-rose">
                      fifteen
                    </span>
                  </div>
                  <div className="text-xs text-ink-mute mt-0.5">
                    {bossHydrated && bossState.best
                      ? `best ${bossState.best.correct}/10 · ${(
                          bossState.best.durationMs / 1000
                        ).toFixed(0)}s`
                      : "rapid-fire across all chapters"}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-ink-dim">
                  runs{" "}
                  <span className="text-rose">
                    {bossHydrated ? bossState.runs.length : "—"}
                  </span>
                </span>
                <span className="text-rose group-hover:translate-x-0.5 transition">
                  fight →
                </span>
              </div>
            </Link>

            {progress.completed.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Reset all progress?")) reset();
                }}
                className="block w-full text-center text-xs font-mono text-ink-dim hover:text-rose transition py-2"
              >
                ↺ reset progress
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-bg-soft/40 border border-line/30 py-1.5">
      <div className="text-ink-dim">{label}</div>
      <div className="text-ink font-display text-sm normal-case mt-0.5">
        {value}
      </div>
    </div>
  );
}
