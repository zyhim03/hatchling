"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Stars } from "@/components/game/Stars";
import { Sparkle } from "@/components/game/Scribble";

export function ChallengeShell({
  title,
  tagline,
  progressLabel,
  stars,
  done,
  children,
}: {
  title: string;
  tagline: string;
  progressLabel?: string;
  stars: number;
  done: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rounded-card border-2 border-dashed border-ember/40 bg-gradient-to-br from-ember/5 to-violet/5 overflow-hidden relative">
      <Sparkle className="absolute top-3 right-3 z-10" size={14} />
      <Sparkle
        className="absolute bottom-4 left-4 z-10"
        size={10}
        color="#a78bfa"
      />

      <div className="px-6 py-4 border-b border-dashed border-ember/30 flex items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ember mb-0.5">
            ⚡ challenge
          </div>
          <div className="font-display text-xl tracking-tight text-ink">
            {title}
          </div>
          <div className="text-sm text-ink-mute mt-0.5">{tagline}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {progressLabel && (
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
              {progressLabel}
            </div>
          )}
          <Stars count={stars} animate={done} />
        </div>
      </div>

      <motion.div className="p-6">{children}</motion.div>
    </div>
  );
}

export function ResultBanner({
  perfect,
  stars,
  rationale,
  onRetry,
  onContinue,
}: {
  perfect: boolean;
  stars: number;
  rationale?: string;
  onRetry?: () => void;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 rounded-card border-2 border-mint/40 bg-mint/5 p-5"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-2xl">{perfect ? "🐉" : stars >= 2 ? "🔥" : "🥚"}</div>
        <div>
          <div className="font-display text-lg tracking-tight">
            {perfect
              ? "Perfect run."
              : stars >= 2
              ? "Solid."
              : "You got there."}
          </div>
          <div className="text-sm text-ink-mute">
            {perfect
              ? "Streak +1, full XP, three stars."
              : stars >= 2
              ? "Two stars. The hatchling approves."
              : "One star earned. Try again for a better grade."}
          </div>
        </div>
      </div>
      {rationale && (
        <div className="text-sm text-ink-mute mt-3 border-t border-mint/20 pt-3 leading-relaxed">
          <span className="text-mint font-mono uppercase tracking-[0.12em] text-[10px]">
            why
          </span>
          <span className="ml-2">{rationale}</span>
        </div>
      )}
      <div className="mt-4 flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-pill border border-line text-ink-mute hover:text-ink hover:border-line/50 px-4 py-1.5 text-sm"
          >
            try again
          </button>
        )}
        <button
          onClick={onContinue}
          className="rounded-pill bg-ember text-bg px-5 py-1.5 text-sm font-medium hover:bg-ember-soft"
        >
          claim reward →
        </button>
      </div>
    </motion.div>
  );
}
