"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChallengeShell, ResultBanner } from "./Shell";

type Round = { words: string[]; imposterIdx: number; theme: string };

export function ImposterRunner({
  title,
  tagline,
  rounds,
  onPass,
  onAttempt,
}: {
  title: string;
  tagline: string;
  rounds: Round[];
  onPass: (stars: number, perfect: boolean) => void;
  onAttempt: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);

  const r = rounds[idx];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i !== r.imposterIdx) setWrong((w) => w + 1);
  }

  function next() {
    if (idx + 1 < rounds.length) {
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
    setWrong(0);
    setDone(false);
  }

  const stars = wrong === 0 ? 3 : wrong === 1 ? 2 : 1;
  const perfect = wrong === 0;

  return (
    <ChallengeShell
      title={title}
      tagline={tagline}
      progressLabel={`round ${idx + 1} / ${rounds.length}`}
      stars={done ? stars : 0}
      done={done}
    >
      {!done ? (
        <div>
          <div className="text-sm text-ink-mute mb-4">
            One of these doesn't fit with the others. Spot the imposter.
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {r.words.map((w, i) => {
              const isPicked = picked === i;
              const isImposter = i === r.imposterIdx;
              const showState = picked !== null;
              return (
                <motion.button
                  key={`${idx}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: picked === null ? -3 : 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`aspect-square rounded-card border-2 flex items-center justify-center font-display text-xl tracking-tight transition ${
                    showState && isImposter
                      ? "border-mint bg-mint/10 text-mint"
                      : showState && isPicked
                      ? "border-rose bg-rose/10 text-rose line-through"
                      : showState
                      ? "border-line/40 bg-bg-soft/40 text-ink-dim"
                      : "border-line/60 bg-bg-elev/60 text-ink hover:border-ember/60"
                  }`}
                >
                  {w}
                </motion.button>
              );
            })}
          </div>
          {picked !== null && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center justify-between gap-4"
            >
              <div className="text-sm text-ink-mute">
                {picked === r.imposterIdx ? (
                  <>
                    <span className="text-mint font-medium">Caught it.</span>{" "}
                    The other three cluster around{" "}
                    <span className="text-ember">"{r.theme}"</span>.
                  </>
                ) : (
                  <>
                    <span className="text-rose font-medium">Nope.</span>{" "}
                    Imposter was{" "}
                    <span className="text-mint">"{r.words[r.imposterIdx]}"</span>
                    .
                  </>
                )}
              </div>
              <button
                onClick={next}
                className="rounded-pill bg-ember text-bg px-5 py-1.5 text-sm font-medium hover:bg-ember-soft"
              >
                {idx + 1 < rounds.length ? "next round →" : "see result →"}
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <ResultBanner
          perfect={perfect}
          stars={stars}
          rationale="Words that mean similar things land near each other in embedding space. The imposter lives somewhere else entirely."
          onRetry={retry}
          onContinue={() => onPass(stars, perfect)}
        />
      )}
    </ChallengeShell>
  );
}
