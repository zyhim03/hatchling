"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { QuizQuestion } from "@/lib/quizPool";

export type QuizResult = {
  correct: number;
  total: number;
  durationMs: number;
};

export function QuizCore({
  questions,
  timed = false,
  onFinish,
}: {
  questions: QuizQuestion[];
  timed?: boolean; // boss rush
  onFinish: (r: QuizResult) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const startTs = useRef(Date.now());
  const advancedRef = useRef(false);

  const q = questions[idx];

  // Reset advance flag on question change
  useEffect(() => {
    advancedRef.current = false;
  }, [idx]);

  // Timer (boss rush only)
  useEffect(() => {
    if (!timed) return;
    setTimeLeft(15);
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const left = Math.max(0, 15 - elapsed);
      setTimeLeft(left);
      if (left <= 0 && !advancedRef.current) {
        advancedRef.current = true;
        clearInterval(id);
        // Time out: count as wrong, advance
        nextQuestion(false);
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, timed]);

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correctIdx) setCorrect((c) => c + 1);
    if (timed) {
      // brief reveal then auto-advance
      setTimeout(() => {
        if (!advancedRef.current) {
          advancedRef.current = true;
          nextQuestion(true);
        }
      }, 800);
    }
  }

  function nextQuestion(_picked: boolean) {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      onFinish({
        correct,
        total: questions.length,
        durationMs: Date.now() - startTs.current,
      });
    }
  }

  function manualNext() {
    if (advancedRef.current) return;
    advancedRef.current = true;
    nextQuestion(picked !== null);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="text-xs font-mono text-ink-dim">
          {idx + 1} / {questions.length}
          <span className="ml-3 text-ember">{q.chapterTitle}</span>
        </div>
        {timed && (
          <div
            className={`text-xs font-mono ${
              timeLeft < 5 ? "text-rose" : "text-ember"
            }`}
          >
            {timeLeft.toFixed(1)}s
          </div>
        )}
      </div>

      {timed && (
        <div className="h-1 rounded-full bg-bg-elev overflow-hidden mb-6">
          <motion.div
            animate={{ width: `${(timeLeft / 15) * 100}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
            className={`h-full ${timeLeft < 5 ? "bg-rose" : "bg-ember"}`}
          />
        </div>
      )}

      <motion.div
        key={idx}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="font-display text-2xl tracking-tight mb-5 leading-snug">
          {q.prompt}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {q.options.map((opt, i) => {
            const isPicked = picked === i;
            const isCorrect = q.correctIdx === i;
            const showState = picked !== null;
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={`text-left rounded-card border-2 px-4 py-3 transition font-display text-base ${
                  showState && isCorrect
                    ? "border-mint bg-mint/10 text-mint"
                    : showState && isPicked
                    ? "border-rose bg-rose/10 text-rose"
                    : showState
                    ? "border-line/40 bg-bg-soft/40 text-ink-dim"
                    : "border-line/60 bg-bg-elev/60 text-ink hover:border-ember/60 hover:bg-ember/5"
                }`}
              >
                <span className="mr-2 font-mono text-xs opacity-60">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </motion.button>
            );
          })}
        </div>

        {picked !== null && !timed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-start justify-between gap-4"
          >
            <div className="text-sm text-ink-mute leading-relaxed flex-1">
              {picked === q.correctIdx ? (
                <span className="text-mint font-medium">Correct.</span>
              ) : (
                <span className="text-rose font-medium">Nope.</span>
              )}{" "}
              {q.rationale}
            </div>
            <button
              onClick={manualNext}
              className="rounded-pill bg-ember text-bg px-5 py-1.5 text-sm font-medium hover:bg-ember-soft flex-shrink-0"
            >
              {idx + 1 < questions.length ? "next →" : "see result →"}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
