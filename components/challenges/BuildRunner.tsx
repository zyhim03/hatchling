"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChallengeShell, ResultBanner } from "./Shell";

type Round = {
  prompt: string;
  options: { token: string; agreement: number }[];
};

export function BuildRunner({
  title,
  tagline,
  starter,
  rounds,
  reveal,
  onPass,
  onAttempt,
}: {
  title: string;
  tagline: string;
  starter: string;
  rounds: Round[];
  reveal: string;
  onPass: (stars: number, perfect: boolean) => void;
  onAttempt: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<
    { token: string; agreement: number }[]
  >([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const round = rounds[idx];

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
  }

  function next() {
    if (picked === null) return;
    const chosen = round.options[picked];
    const newPicks = [...picks, chosen];
    setPicks(newPicks);
    setPicked(null);
    if (idx + 1 < rounds.length) {
      setIdx(idx + 1);
    } else {
      setDone(true);
      onAttempt();
    }
  }

  function retry() {
    setIdx(0);
    setPicks([]);
    setPicked(null);
    setDone(false);
  }

  const avgAgreement =
    picks.length === 0
      ? 0
      : picks.reduce((s, p) => s + p.agreement, 0) / picks.length;
  const stars = avgAgreement >= 0.7 ? 3 : avgAgreement >= 0.45 ? 2 : 1;
  const perfect = avgAgreement >= 0.8;

  const builtText = starter + picks.map((p) => p.token).join("");
  const previewText =
    picked !== null
      ? builtText + round.options[picked].token
      : builtText;

  return (
    <ChallengeShell
      title={title}
      tagline={tagline}
      progressLabel={`token ${idx + 1} / ${rounds.length}`}
      stars={done ? stars : 0}
      done={done}
    >
      {!done ? (
        <div>
          {/* Built sentence so far */}
          <div className="rounded-card border border-line/60 bg-bg-soft/40 p-4 mb-5 font-serif-display text-xl leading-relaxed">
            <span className="text-ink-mute">{starter}</span>
            <AnimatePresence>
              {picks.map((p, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-ember"
                >
                  {p.token}
                </motion.span>
              ))}
            </AnimatePresence>
            {picked !== null && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                className="text-yolk italic"
              >
                {round.options[picked].token}
              </motion.span>
            )}
            <span className="inline-block w-1.5 h-5 align-middle bg-ember/40 animate-pulse ml-0.5" />
          </div>

          {/* Round prompt */}
          <div className="text-sm text-ink-mute mb-3">
            <span className="font-serif-wonky italic text-ember">
              your turn:
            </span>{" "}
            {round.prompt}
          </div>

          {/* Token options */}
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
          >
            {round.options.map((opt, i) => {
              const isPicked = picked === i;
              const showState = picked !== null;
              return (
                <motion.button
                  key={i}
                  whileHover={{ y: picked === null ? -3 : 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={`rounded-card border-2 px-4 py-4 text-center transition ${
                    showState && isPicked
                      ? "border-ember bg-ember/15"
                      : showState
                      ? "border-line/40 bg-bg-soft/40 opacity-60"
                      : "border-line/60 bg-bg-elev/60 hover:border-ember/60 hover:bg-ember/5"
                  }`}
                >
                  <div className="font-mono text-base text-ink">
                    {opt.token.trim() || opt.token}
                  </div>
                  {showState && isPicked && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-mono text-ember mt-1"
                    >
                      model agreement {(opt.agreement * 100).toFixed(0)}%
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {picked !== null && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 flex items-center justify-between gap-4"
            >
              <div className="text-sm text-ink-mute">
                {round.options[picked].agreement >= 0.7 ? (
                  <span className="text-mint font-medium">
                    The model would have picked this one too.
                  </span>
                ) : round.options[picked].agreement >= 0.4 ? (
                  <span className="text-yolk font-medium">
                    Plausible. The model would consider this.
                  </span>
                ) : (
                  <span className="text-rose font-medium">
                    Unusual. The model would rarely pick this.
                  </span>
                )}{" "}
                That's the score it would have given itself.
              </div>
              <button
                onClick={next}
                className="rounded-pill bg-ember text-bg px-5 py-1.5 text-sm font-medium hover:bg-ember-soft flex-shrink-0"
              >
                {idx + 1 < rounds.length ? "next token →" : "see your story →"}
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <div>
          <div className="rounded-card border border-mint/40 bg-mint/5 p-5 mb-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-mint mb-2">
              your story
            </div>
            <div className="font-serif-display text-xl leading-relaxed">
              {builtText}
              <span className="text-ink-dim">.</span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs font-mono">
              <span className="text-ink-dim">avg model agreement</span>
              <span className="text-ember text-base">
                {(avgAgreement * 100).toFixed(0)}%
              </span>
            </div>
          </div>
          <ResultBanner
            perfect={perfect}
            stars={stars}
            rationale={reveal}
            onRetry={retry}
            onContinue={() => onPass(stars, perfect)}
          />
        </div>
      )}
    </ChallengeShell>
  );
}
