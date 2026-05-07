"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChallengeShell, ResultBanner } from "./Shell";
import { Sparkle } from "@/components/game/Scribble";

type Round = {
  missingIdx: number;
  options: string[];
  correctIdx: number;
  explanation: string;
};

export function FindGapRunner({
  title,
  tagline,
  pieces,
  rounds,
  onPass,
  onAttempt,
}: {
  title: string;
  tagline: string;
  pieces: string[];
  rounds: Round[];
  onPass: (stars: number, perfect: boolean) => void;
  onAttempt: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);

  const r = rounds[idx];
  const correctName = r.options[r.correctIdx];

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

  return (
    <ChallengeShell
      title={title}
      tagline={tagline}
      progressLabel={`gap ${idx + 1} / ${rounds.length}`}
      stars={done ? stars : 0}
      done={done}
    >
      {!done ? (
        <div>
          {/* Architecture diagram */}
          <div className="rounded-card border border-line/60 bg-bg-soft/40 p-5 mb-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim mb-3 text-center">
              ↑ output
            </div>
            <div className="space-y-2">
              {[...pieces].reverse().map((p, displayI) => {
                const i = pieces.length - 1 - displayI;
                const isMissing = i === r.missingIdx;
                const filled =
                  picked !== null &&
                  picked === r.correctIdx &&
                  isMissing;
                return (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      borderColor: isMissing
                        ? filled
                          ? "rgba(123,227,164,0.7)"
                          : "rgba(255,138,60,0.8)"
                        : "rgba(255,255,255,0.08)",
                      backgroundColor: isMissing
                        ? filled
                          ? "rgba(123,227,164,0.1)"
                          : "rgba(255,138,60,0.07)"
                        : "rgba(255,255,255,0.03)",
                    }}
                    className={`rounded-card border-2 px-4 py-3 flex items-center gap-3 relative ${
                      isMissing && !filled ? "border-dashed" : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] ${
                        isMissing
                          ? filled
                            ? "bg-mint/20 text-mint"
                            : "bg-ember text-bg"
                          : "bg-bg-elev text-ink-dim"
                      }`}
                    >
                      {i}
                    </div>
                    <div
                      className={`font-display text-base flex-1 ${
                        isMissing && !filled
                          ? "text-ember italic"
                          : "text-ink"
                      }`}
                    >
                      {isMissing
                        ? filled
                          ? correctName
                          : "??? · missing piece ???"
                        : p}
                    </div>
                    {isMissing && !filled && (
                      <Sparkle size={14} className="opacity-80" />
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim mt-3 text-center">
              ↓ input
            </div>
          </div>

          {/* Options */}
          <div className="text-sm text-ink-mute mb-3">
            <span className="font-serif-wonky italic text-ember">which one</span>{" "}
            fills the slot?
          </div>
          <div className="grid grid-cols-2 gap-3">
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
                  className={`rounded-card border-2 px-4 py-3 text-left transition font-display ${
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
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-start justify-between gap-4"
            >
              <div className="text-sm text-ink-mute leading-relaxed flex-1">
                {picked === r.correctIdx ? (
                  <span className="text-mint font-medium">Plugged.</span>
                ) : (
                  <span className="text-rose font-medium">
                    Was{" "}
                    <span className="text-mint">{correctName}</span>.
                  </span>
                )}{" "}
                {r.explanation}
              </div>
              <button
                onClick={next}
                className="rounded-pill bg-ember text-bg px-5 py-1.5 text-sm font-medium hover:bg-ember-soft flex-shrink-0"
              >
                {idx + 1 < rounds.length ? "next gap →" : "see result →"}
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <ResultBanner
          perfect={perfect}
          stars={stars}
          rationale="Knowing what each piece does makes the architecture concrete instead of intimidating."
          onRetry={retry}
          onContinue={() => onPass(stars, perfect)}
        />
      )}
    </ChallengeShell>
  );
}
