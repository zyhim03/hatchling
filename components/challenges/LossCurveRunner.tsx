"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChallengeShell, ResultBanner } from "./Shell";

type Round = {
  kind: "good" | "diverging" | "stuck" | "noisy";
  question: string;
  options: string[];
  correctIdx: number;
};

const N = 60;

function generateCurve(kind: Round["kind"]) {
  const pts: number[] = [];
  for (let i = 0; i < N; i++) {
    let v = 0;
    if (kind === "good") v = 6 * Math.exp(-i * 0.05) + 0.4 + (Math.random() - 0.5) * 0.2;
    if (kind === "diverging") v = 5 + i * 0.05 + Math.sin(i * 0.4) * 0.3;
    if (kind === "stuck") v = 5.8 + (Math.random() - 0.5) * 0.2;
    if (kind === "noisy") v = 4 + Math.sin(i * 0.3) * 1.2 + (Math.random() - 0.5) * 0.6;
    pts.push(v);
  }
  return pts;
}

export function LossCurveRunner({
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
  const [curves] = useState(() => rounds.map((r) => generateCurve(r.kind)));

  const r = rounds[idx];
  const curve = curves[idx];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i !== r.correctIdx) setWrong((w) => w + 1);
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
  const max = Math.max(...curve);
  const min = Math.min(...curve);

  return (
    <ChallengeShell
      title={title}
      tagline={tagline}
      progressLabel={`curve ${idx + 1} / ${rounds.length}`}
      stars={done ? stars : 0}
      done={done}
    >
      {!done ? (
        <div>
          <div className="rounded-card border border-line/60 bg-bg-soft/40 p-4 mb-4 h-44">
            <svg
              viewBox="0 0 200 100"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="80"
                x2="200"
                y2="80"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.3"
              />
              <motion.polyline
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                points={curve
                  .map((v, i) => {
                    const x = (i / (N - 1)) * 200;
                    const y = 100 - ((v - 0) / 8) * 80;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#ff8a3c"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="font-display text-lg tracking-tight mb-3">
            {r.question}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {r.options.map((opt, i) => {
              const isPicked = picked === i;
              const isCorrect = i === r.correctIdx;
              const showState = picked !== null;
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`rounded-card border-2 px-4 py-3 text-left font-display text-base transition ${
                    showState && isCorrect
                      ? "border-mint bg-mint/10 text-mint"
                      : showState && isPicked
                      ? "border-rose bg-rose/10 text-rose"
                      : showState
                      ? "border-line/40 bg-bg-soft/40 text-ink-dim"
                      : "border-line/60 bg-bg-elev/60 text-ink hover:border-ember/60"
                  }`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
          {picked !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-end"
            >
              <button
                onClick={next}
                className="rounded-pill bg-ember text-bg px-5 py-1.5 text-sm font-medium hover:bg-ember-soft"
              >
                {idx + 1 < rounds.length ? "next →" : "see result →"}
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <ResultBanner
          perfect={perfect}
          stars={stars}
          rationale="Reading the curve is half the job. The other half is knowing which knob to turn."
          onRetry={retry}
          onContinue={() => onPass(stars, perfect)}
        />
      )}
    </ChallengeShell>
  );
}
