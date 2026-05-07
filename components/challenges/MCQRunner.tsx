"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MCQQuestion } from "@/lib/challenges";
import { ChallengeShell, ResultBanner } from "./Shell";
import { Glitch } from "@/components/characters/Glitch";

type Props = {
  title: string;
  tagline: string;
  questions: MCQQuestion[];
  onPass: (stars: number, perfect: boolean) => void;
  onAttempt: () => void;
};

export function MCQRunner({
  title,
  tagline,
  questions,
  onPass,
  onAttempt,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correctIdx) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongCount((w) => w + 1);
    }
  }

  function next() {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setPicked(null);
    } else {
      setDone(true);
      onAttempt();
    }
  }

  function retry() {
    setIdx(0);
    setPicked(null);
    setCorrectCount(0);
    setWrongCount(0);
    setDone(false);
  }

  const stars =
    wrongCount === 0 ? 3 : wrongCount === 1 ? 2 : 1;
  const perfect = wrongCount === 0;

  return (
    <ChallengeShell
      title={title}
      tagline={tagline}
      progressLabel={`${idx + 1} / ${questions.length}`}
      stars={done ? stars : 0}
      done={done}
    >
      {!done ? (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
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
                    whileHover={{ y: picked === null ? -2 : 0 }}
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

            {picked !== null && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex items-start justify-between gap-4"
              >
                <div className="text-sm text-ink-mute leading-relaxed flex-1 flex items-start gap-3">
                  <AnimatePresence>
                    {picked !== q.correctIdx && (
                      <motion.div
                        key="glitch"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="flex-shrink-0"
                      >
                        <Glitch size={48} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div>
                    {picked === q.correctIdx ? (
                      <span className="text-mint font-medium">Yep.</span>
                    ) : (
                      <span className="text-rose font-medium">Not quite.</span>
                    )}{" "}
                    {q.rationale}
                  </div>
                </div>
                <button
                  onClick={next}
                  className="rounded-pill bg-ember text-bg-elev px-5 py-1.5 text-sm font-medium hover:bg-ember-soft flex-shrink-0 sticker"
                >
                  {idx + 1 < questions.length ? "next →" : "see result →"}
                </button>
              </motion.div>
            )}
        </motion.div>
      ) : (
        <ResultBanner
          perfect={perfect}
          stars={stars}
          rationale={`${correctCount} of ${questions.length} correct.`}
          onRetry={retry}
          onContinue={() => onPass(stars, perfect)}
        />
      )}
    </ChallengeShell>
  );
}
