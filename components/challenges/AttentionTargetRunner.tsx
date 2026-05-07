"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChallengeShell, ResultBanner } from "./Shell";

type Round = { sentence: string; pronounIdx: number; targetIdx: number };

export function AttentionTargetRunner({
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
  const tokens = r.sentence.split(/\s+/);

  function pick(i: number) {
    if (picked !== null) return;
    if (i >= r.pronounIdx) return; // can't attend forward
    setPicked(i);
    if (i !== r.targetIdx) setWrong((w) => w + 1);
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
            The bold token wants to find what it refers to. Click the earlier
            word it should attend to most.
          </div>
          <div className="rounded-card border border-line/60 bg-bg-soft/40 p-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {tokens.map((t, i) => {
                const isPronoun = i === r.pronounIdx;
                const isPicked = picked === i;
                const isCorrect = picked !== null && i === r.targetIdx;
                const after = i > r.pronounIdx;
                const showState = picked !== null;
                return (
                  <motion.button
                    key={`${idx}-${i}`}
                    onClick={() => pick(i)}
                    disabled={isPronoun || after || picked !== null}
                    whileHover={{
                      y: picked === null && !isPronoun && !after ? -2 : 0,
                    }}
                    className={`rounded-md border-2 px-3 py-2 font-mono text-sm transition ${
                      isPronoun
                        ? "border-ember bg-ember/15 text-ember font-bold"
                        : showState && isCorrect
                        ? "border-mint bg-mint/15 text-mint"
                        : showState && isPicked
                        ? "border-rose bg-rose/15 text-rose"
                        : after
                        ? "border-line/30 bg-bg-soft/30 text-ink-dim"
                        : "border-line/40 bg-bg-elev/60 text-ink hover:border-ember/60"
                    }`}
                  >
                    {t}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {picked !== null && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center justify-between gap-4"
            >
              <div className="text-sm text-ink-mute">
                {picked === r.targetIdx ? (
                  <span className="text-mint font-medium">Exactly.</span>
                ) : (
                  <span className="text-rose font-medium">
                    Closer is{" "}
                    <span className="text-mint">{tokens[r.targetIdx]}</span>.
                  </span>
                )}{" "}
                That's coreference resolution — attention's bread and butter.
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
          rationale="In real models, attention heads specialize. Some are dedicated coreference detectors — they learn this exact game during training."
          onRetry={retry}
          onContinue={() => onPass(stars, perfect)}
        />
      )}
    </ChallengeShell>
  );
}
