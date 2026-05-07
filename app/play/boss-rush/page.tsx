"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TopBar } from "@/components/game/TopBar";
import { Embers } from "@/components/game/Embers";
import { Sparkle } from "@/components/game/Scribble";
import { Confetti } from "@/components/game/Confetti";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/game/Mascot";
import { QuizCore, QuizResult } from "@/components/quiz/QuizCore";
import { useBoss } from "@/lib/sideProgress";
import { pickQuestions } from "@/lib/quizPool";

const N = 10;

export default function BossRushPage() {
  const [seed, setSeed] = useState(() => Date.now());
  const questions = useMemo(() => pickQuestions(N, seed), [seed]);
  const { state, hydrated, recordRun } = useBoss();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [confetti, setConfetti] = useState(false);

  function handleFinish(r: QuizResult) {
    setResult(r);
    recordRun({
      ts: Date.now(),
      correct: r.correct,
      total: r.total,
      durationMs: r.durationMs,
    });
    if (r.correct >= 8) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2400);
    }
  }

  function restart() {
    setSeed(Date.now());
    setResult(null);
    setStarted(false);
  }

  return (
    <main className="min-h-screen relative">
      <Embers density={14} />
      <TopBar />

      <div className="mx-auto max-w-3xl px-6 py-12 relative">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-dim mb-6">
          <Link href="/play" className="hover:text-ink">
            map
          </Link>
          <span>/</span>
          <span className="text-ember">boss rush</span>
        </div>

        <div className="text-xs font-mono uppercase tracking-[0.18em] text-rose mb-3">
          ⚔ boss rush · all chapters
        </div>
        <h1 className="font-display text-4xl md:text-5xl tracking-[-0.02em] leading-[1.05] mb-3 relative">
          Ten questions.{" "}
          <span className="font-serif-wonky italic text-rose">
            Fifteen seconds each.
          </span>
          <Sparkle className="absolute -top-3 -right-2" size={18} color="#ff7aa6" />
        </h1>
        <p className="text-lg text-ink-mute mb-8 leading-relaxed">
          Random questions from across the eleven chapters. Click fast, click
          right, beat your best.
        </p>

        {!started && !result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-card border-2 border-dashed border-rose/40 bg-gradient-to-br from-rose/5 to-ember/5 p-8 text-center"
          >
            <div className="flex justify-center mb-3">
              <Mascot stage="soar" size={120} />
            </div>
            <div className="font-display text-xl mb-1">
              Boss rush is{" "}
              <span className="font-serif-wonky italic text-rose">unforgiving</span>
              .
            </div>
            <div className="text-sm text-ink-mute mb-5 max-w-md mx-auto">
              No rationale. No retries. The clock starts the second you click
              start. Wrong or too slow both count as a miss.
            </div>
            <button
              onClick={() => setStarted(true)}
              className="rounded-pill bg-rose text-bg px-6 py-2.5 font-medium hover:bg-rose/80"
            >
              start the rush ↯
            </button>
          </motion.div>
        )}

        {started && !result && (
          <div className="rounded-card border-2 border-rose/40 bg-bg-elev/60 p-6">
            <QuizCore questions={questions} timed onFinish={handleFinish} />
          </div>
        )}

        {result && <ResultCard result={result} onRetry={restart} />}

        {/* Best & history */}
        {hydrated && state.best && (
          <div className="mt-8 rounded-card border border-line/60 bg-bg-soft/40 p-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim mb-3">
              your best
            </div>
            <div className="flex items-baseline gap-6">
              <div>
                <div className="font-display text-3xl text-ember">
                  {state.best.correct}
                  <span className="text-base text-ink-mute"> / {state.best.total}</span>
                </div>
                <div className="text-xs font-mono text-ink-dim">accuracy</div>
              </div>
              <div>
                <div className="font-display text-3xl text-yolk">
                  {(state.best.durationMs / 1000).toFixed(1)}s
                </div>
                <div className="text-xs font-mono text-ink-dim">total time</div>
              </div>
            </div>
            {state.runs.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {state.runs.slice(0, 5).map((r, i) => (
                  <div
                    key={i}
                    className="rounded-card border border-line/40 bg-bg-soft/40 px-2 py-1.5 text-center"
                  >
                    <div className="font-mono text-sm text-ember">
                      {r.correct}/{r.total}
                    </div>
                    <div className="text-[9px] font-mono text-ink-dim">
                      {(r.durationMs / 1000).toFixed(0)}s
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Confetti show={confetti} />
    </main>
  );
}

function ResultCard({
  result,
  onRetry,
}: {
  result: QuizResult;
  onRetry: () => void;
}) {
  const tier =
    result.correct === result.total
      ? "perfect"
      : result.correct >= 8
      ? "great"
      : result.correct >= 5
      ? "ok"
      : "rough";
  const copy = {
    perfect: { emoji: "🐉", title: "Flawless rush.", body: "Fastest hatchling in the cave." },
    great: { emoji: "🔥", title: "Strong run.", body: "A dropped one or two — still impressive." },
    ok: { emoji: "🥚", title: "Half hatched.", body: "Better than not running it. Try again." },
    rough: { emoji: "💨", title: "Tougher than expected?", body: "Practice the chapters and come back." },
  }[tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-card border-2 border-rose/40 bg-rose/5 p-6"
    >
      <div className="text-4xl mb-2">{copy.emoji}</div>
      <div className="font-display text-2xl">{copy.title}</div>
      <div className="text-ink-mute mt-1 mb-5">{copy.body}</div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Stat label="Correct" value={`${result.correct}/${result.total}`} />
        <Stat label="Time" value={`${(result.durationMs / 1000).toFixed(1)}s`} />
        <Stat
          label="Avg"
          value={`${(result.durationMs / 1000 / result.total).toFixed(1)}s`}
        />
      </div>
      <div className="flex gap-3">
        <Button onClick={onRetry}>Run it again ↯</Button>
        <Button href="/play" variant="secondary">
          Back to map
        </Button>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line/40 bg-bg-soft/40 p-3 text-center">
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
        {label}
      </div>
      <div className="font-display text-lg text-ink mt-1">{value}</div>
    </div>
  );
}
