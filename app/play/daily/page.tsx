"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TopBar } from "@/components/game/TopBar";
import { Embers } from "@/components/game/Embers";
import { Sparkle } from "@/components/game/Scribble";
import { Confetti } from "@/components/game/Confetti";
import { Button } from "@/components/ui/Button";
import { QuizCore, QuizResult } from "@/components/quiz/QuizCore";
import { useDaily } from "@/lib/sideProgress";
import { dailySeed, pickQuestions, todayKey } from "@/lib/quizPool";

export default function DailyPage() {
  const dateKey = todayKey();
  const seed = dailySeed();
  const questions = useMemo(() => pickQuestions(5, seed), [seed]);
  const { state, hydrated, recordDaily } = useDaily();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [confetti, setConfetti] = useState(false);

  const todayResult = state.history[dateKey];
  const alreadyDone = !!todayResult;

  function handleFinish(r: QuizResult) {
    setResult(r);
    if (!alreadyDone) {
      recordDaily(dateKey, r.correct, r.total);
    }
    if (r.correct === r.total) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2400);
    }
  }

  return (
    <main className="min-h-screen relative">
      <Embers density={10} />
      <TopBar />

      <div className="mx-auto max-w-3xl px-6 py-12 relative">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-dim mb-6">
          <Link href="/play" className="hover:text-ink">
            map
          </Link>
          <span>/</span>
          <span className="text-ember">daily</span>
        </div>

        <div className="text-xs font-mono uppercase tracking-[0.18em] text-ink-dim mb-3">
          ☀ daily challenge · {dateKey}
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] mb-3 relative">
          Today's{" "}
          <span className="font-serif-wonky italic text-ember scribble-underline">
            five
          </span>
          .
          <Sparkle className="absolute -top-3 -right-2" size={18} />
        </h1>
        <p className="text-lg text-ink-mute mb-8 leading-relaxed">
          Five questions, picked from across the chapters. Same five for
          everyone, today only. Get all five right, keep your daily streak
          alive.
        </p>

        {!started && !result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-card border-2 border-dashed border-ember/40 bg-gradient-to-br from-ember/5 to-violet/5 p-8 text-center"
          >
            <div className="text-5xl mb-2">☀️</div>
            <div className="font-display text-xl mb-1">
              {alreadyDone
                ? "You already cleared today's five."
                : "Ready when you are."}
            </div>
            <div className="text-sm text-ink-mute mb-5">
              {alreadyDone
                ? `You got ${todayResult.correct}/${todayResult.total} earlier today.`
                : "No timer. No going back. One shot per day."}
            </div>
            <button
              onClick={() => setStarted(true)}
              className="rounded-pill bg-ember text-bg px-6 py-2.5 font-medium hover:bg-ember-soft"
            >
              {alreadyDone ? "play again (no streak credit)" : "start today's five →"}
            </button>
          </motion.div>
        )}

        {started && !result && (
          <div className="rounded-card border-2 border-dashed border-ember/40 bg-gradient-to-br from-ember/5 to-violet/5 p-6">
            <QuizCore questions={questions} onFinish={handleFinish} />
          </div>
        )}

        {result && (
          <ResultCard
            result={result}
            alreadyDoneEarlier={alreadyDone && result === null}
          />
        )}

        {/* Streak panel */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <Stat label="Today" value={hydrated ? (todayResult ? `${todayResult.correct}/${todayResult.total}` : "—") : "—"} />
          <Stat
            label="Streak"
            value={hydrated ? (state.streak > 0 ? `🔥 ${state.streak}` : "—") : "—"}
          />
          <Stat
            label="Best"
            value={hydrated ? `${state.bestStreak}d` : "—"}
          />
        </div>
      </div>

      <Confetti show={confetti} />
    </main>
  );
}

function ResultCard({ result }: { result: QuizResult; alreadyDoneEarlier?: boolean }) {
  const perfect = result.correct === result.total;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-card border-2 p-6 ${
        perfect ? "border-mint/40 bg-mint/5" : "border-line/60 bg-bg-elev/60"
      }`}
    >
      <div className="text-4xl mb-2">{perfect ? "🐉" : "🥚"}</div>
      <div className="font-display text-2xl">
        {perfect ? "Five for five." : `${result.correct} of ${result.total}.`}
      </div>
      <div className="text-ink-mute mt-1">
        {perfect
          ? "Streak survived. Come back tomorrow."
          : "Streak resets. Try again tomorrow for a clean run."}
      </div>
      <div className="mt-5 flex gap-3">
        <Button href="/play" variant="secondary">
          Back to map
        </Button>
        <Button href="/play/boss-rush">Try boss rush →</Button>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line/40 bg-bg-soft/40 p-4 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
        {label}
      </div>
      <div className="font-display text-xl text-ink mt-1">{value}</div>
    </div>
  );
}
