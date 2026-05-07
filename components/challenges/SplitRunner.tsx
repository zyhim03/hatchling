"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChallengeShell, ResultBanner } from "./Shell";

export function SplitRunner({
  title,
  tagline,
  prompt,
  sentence,
  correctSplits,
  tolerance = 1,
  rationale,
  onPass,
  onAttempt,
}: {
  title: string;
  tagline: string;
  prompt: string;
  sentence: string;
  correctSplits: number[];
  tolerance?: number;
  rationale: string;
  onPass: (stars: number, perfect: boolean) => void;
  onAttempt: () => void;
}) {
  const [splits, setSplits] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [tries, setTries] = useState(0);

  function toggle(i: number) {
    if (done) return;
    setSplits((s) =>
      s.includes(i) ? s.filter((x) => x !== i) : [...s, i].sort((a, b) => a - b)
    );
  }

  function check() {
    setTries((t) => t + 1);
    const correctCount = splits.filter((s) =>
      correctSplits.some((cs) => Math.abs(cs - s) <= tolerance)
    ).length;
    const wrongCount = splits.length - correctCount;
    const missedCount = correctSplits.length - correctCount;

    onAttempt();
    if (correctCount >= correctSplits.length - 1 && wrongCount <= 1) {
      setDone(true);
    } else if (tries === 0) {
      // first wrong attempt: still mark not done so they can try again
    } else {
      setDone(true); // after 2 attempts auto-pass with reduced stars
    }
  }

  function retry() {
    setSplits([]);
    setTries(0);
    setDone(false);
  }

  const correctCount = splits.filter((s) =>
    correctSplits.some((cs) => Math.abs(cs - s) <= tolerance)
  ).length;
  const accuracy =
    correctSplits.length === 0
      ? 0
      : correctCount / correctSplits.length;
  const perfect = tries <= 1 && accuracy >= 0.9;
  const stars = perfect ? 3 : accuracy >= 0.7 ? 2 : 1;

  return (
    <ChallengeShell
      title={title}
      tagline={tagline}
      progressLabel={`splits: ${splits.length}`}
      stars={done ? stars : 0}
      done={done}
    >
      {!done ? (
        <div>
          <div className="text-sm text-ink-mute mb-4">{prompt}</div>
          <div className="rounded-card border border-line/60 bg-bg-soft/40 p-6 mb-4">
            <div className="font-mono text-2xl flex flex-wrap items-center justify-center gap-0">
              {sentence.split("").map((ch, i) => {
                const isSplit = splits.includes(i);
                return (
                  <span key={i} className="flex items-center">
                    <span className="text-ink">{ch === " " ? "·" : ch}</span>
                    {i < sentence.length - 1 && (
                      <button
                        onClick={() => toggle(i + 1)}
                        className="group h-9 w-1 mx-0.5 relative"
                      >
                        <motion.div
                          animate={{
                            scaleY: isSplit ? 1 : 0,
                            opacity: isSplit ? 1 : 0,
                          }}
                          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-ember rounded-full"
                        />
                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-ink-dim/0 group-hover:bg-ember/40 rounded-full transition" />
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
            <div className="text-center text-[10px] font-mono text-ink-dim mt-3">
              click between letters to add or remove a split
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-mono text-ink-dim">
              {tries > 0 && `attempt ${tries}`}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={check}
              className="rounded-pill bg-ember text-bg px-5 py-2 text-sm font-medium hover:bg-ember-soft"
            >
              check splits →
            </motion.button>
          </div>

          {tries > 0 && !done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-rose"
            >
              {correctCount} / {correctSplits.length} correct cuts. Try again.
            </motion.div>
          )}
        </div>
      ) : (
        <ResultBanner
          perfect={perfect}
          stars={stars}
          rationale={rationale}
          onRetry={retry}
          onContinue={() => onPass(stars, perfect)}
        />
      )}
    </ChallengeShell>
  );
}
