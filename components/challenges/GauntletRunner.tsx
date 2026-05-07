"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChallengeShell, ResultBanner } from "./Shell";
import { GauntletStage } from "@/lib/challenges";

export function GauntletRunner({
  title,
  tagline,
  stages,
  onPass,
  onAttempt,
}: {
  title: string;
  tagline: string;
  stages: GauntletStage[];
  onPass: (stars: number, perfect: boolean) => void;
  onAttempt: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const [stagePassed, setStagePassed] = useState<boolean | null>(null);

  function handleStageResult(passed: boolean) {
    setStagePassed(passed);
    if (passed) setCorrect((c) => c + 1);
  }

  function nextStage() {
    setStagePassed(null);
    if (idx + 1 < stages.length) {
      setIdx(idx + 1);
    } else {
      setDone(true);
      onAttempt();
    }
  }

  function retry() {
    setIdx(0);
    setCorrect(0);
    setStagePassed(null);
    setDone(false);
  }

  const stars = correct === stages.length ? 3 : correct >= stages.length - 1 ? 2 : 1;
  const perfect = correct === stages.length;
  const stage = stages[idx];

  return (
    <ChallengeShell
      title={title}
      tagline={tagline}
      progressLabel={`stage ${idx + 1} / ${stages.length} · ${correct} cleared`}
      stars={done ? stars : 0}
      done={done}
    >
      {/* Stage progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {stages.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i < idx
                ? "w-10 bg-mint"
                : i === idx
                ? "w-14 bg-ember"
                : "w-6 bg-line"
            }`}
          />
        ))}
      </div>

      {!done ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ember mb-3">
              trial {idx + 1} · {STAGE_NAME[stage.kind]}
            </div>
            <StagePlayer
              key={`${idx}-${stage.kind}`}
              stage={stage}
              done={stagePassed !== null}
              onResult={handleStageResult}
            />
            {stagePassed !== null && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex items-center justify-between gap-4"
              >
                <div className="text-sm">
                  {stagePassed ? (
                    <span className="text-mint font-medium">Trial cleared.</span>
                  ) : (
                    <span className="text-rose font-medium">Trial dropped.</span>
                  )}
                </div>
                <button
                  onClick={nextStage}
                  className="rounded-pill bg-ember text-bg px-5 py-1.5 text-sm font-medium hover:bg-ember-soft"
                >
                  {idx + 1 < stages.length ? "next trial →" : "see verdict →"}
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <ResultBanner
          perfect={perfect}
          stars={stars}
          rationale={`You cleared ${correct} of ${stages.length} trials. Every concept you've built shows up here — that's why this is the boss.`}
          onRetry={retry}
          onContinue={() => onPass(stars, perfect)}
        />
      )}
    </ChallengeShell>
  );
}

const STAGE_NAME: Record<GauntletStage["kind"], string> = {
  split: "tokenize",
  imposter: "embed",
  attention: "attend",
  loss: "diagnose",
};

function StagePlayer({
  stage,
  done,
  onResult,
}: {
  stage: GauntletStage;
  done: boolean;
  onResult: (passed: boolean) => void;
}) {
  if (stage.kind === "split") return <SplitStage stage={stage} done={done} onResult={onResult} />;
  if (stage.kind === "imposter") return <ImposterStage stage={stage} done={done} onResult={onResult} />;
  if (stage.kind === "attention") return <AttentionStage stage={stage} done={done} onResult={onResult} />;
  return <LossStage stage={stage} done={done} onResult={onResult} />;
}

/* ─── Mini stages (compact versions of the chapter mechanics) ─── */

function SplitStage({
  stage,
  done,
  onResult,
}: {
  stage: Extract<GauntletStage, { kind: "split" }>;
  done: boolean;
  onResult: (passed: boolean) => void;
}) {
  const [splits, setSplits] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function toggle(i: number) {
    if (submitted) return;
    setSplits((s) =>
      s.includes(i) ? s.filter((x) => x !== i) : [...s, i].sort((a, b) => a - b)
    );
  }

  function submit() {
    setSubmitted(true);
    const correctCount = splits.filter((s) =>
      stage.correctSplits.some((cs) => Math.abs(cs - s) <= 1)
    ).length;
    onResult(correctCount >= stage.correctSplits.length - 1 && splits.length <= stage.correctSplits.length + 1);
  }

  return (
    <div>
      <div className="font-display text-lg mb-3">
        Click between letters where the tokenizer splits.
      </div>
      <div className="rounded-card border border-line/60 bg-bg-soft/40 p-5 mb-3">
        <div className="font-mono text-xl flex flex-wrap items-center justify-center gap-0">
          {stage.sentence.split("").map((ch, i) => (
            <span key={i} className="flex items-center">
              <span className="text-ink">{ch === " " ? "·" : ch}</span>
              {i < stage.sentence.length - 1 && (
                <button
                  onClick={() => toggle(i + 1)}
                  className="group h-7 w-1 mx-0.5 relative"
                >
                  <div
                    className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 rounded-full transition ${
                      splits.includes(i + 1)
                        ? "bg-ember"
                        : "bg-ink-dim/0 group-hover:bg-ember/40"
                    }`}
                  />
                </button>
              )}
            </span>
          ))}
        </div>
      </div>
      {!submitted && (
        <button
          onClick={submit}
          className="rounded-pill bg-ember text-bg px-5 py-1.5 text-sm font-medium"
        >
          submit splits
        </button>
      )}
    </div>
  );
}

function ImposterStage({
  stage,
  done: _done,
  onResult,
}: {
  stage: Extract<GauntletStage, { kind: "imposter" }>;
  done: boolean;
  onResult: (passed: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    onResult(i === stage.imposterIdx);
  }
  return (
    <div>
      <div className="font-display text-lg mb-3">
        Spot the embedding outlier.
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stage.words.map((w, i) => {
          const isPicked = picked === i;
          const isImp = i === stage.imposterIdx;
          const showState = picked !== null;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={`aspect-square rounded-card border-2 flex items-center justify-center font-display ${
                showState && isImp
                  ? "border-mint bg-mint/10 text-mint"
                  : showState && isPicked
                  ? "border-rose bg-rose/10 text-rose line-through"
                  : showState
                  ? "border-line/40 bg-bg-soft/40 text-ink-dim"
                  : "border-line/60 bg-bg-elev/60 text-ink hover:border-ember/60"
              }`}
            >
              {w}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AttentionStage({
  stage,
  done: _done,
  onResult,
}: {
  stage: Extract<GauntletStage, { kind: "attention" }>;
  done: boolean;
  onResult: (passed: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const tokens = stage.sentence.split(/\s+/);
  function pick(i: number) {
    if (picked !== null) return;
    if (i >= stage.pronounIdx) return;
    setPicked(i);
    onResult(i === stage.targetIdx);
  }
  return (
    <div>
      <div className="font-display text-lg mb-3">
        Click what the bold word is referring to.
      </div>
      <div className="rounded-card border border-line/60 bg-bg-soft/40 p-5">
        <div className="flex flex-wrap gap-2 justify-center">
          {tokens.map((t, i) => {
            const isPronoun = i === stage.pronounIdx;
            const isPicked = picked === i;
            const isTarget = picked !== null && i === stage.targetIdx;
            const after = i > stage.pronounIdx;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={isPronoun || after || picked !== null}
                className={`rounded-md border-2 px-3 py-1.5 font-mono text-sm transition ${
                  isPronoun
                    ? "border-ember bg-ember/15 text-ember font-bold"
                    : isTarget
                    ? "border-mint bg-mint/15 text-mint"
                    : isPicked
                    ? "border-rose bg-rose/15 text-rose"
                    : after
                    ? "border-line/30 text-ink-dim"
                    : "border-line/40 bg-bg-elev/60 text-ink hover:border-ember/60"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LossStage({
  stage,
  done: _done,
  onResult,
}: {
  stage: Extract<GauntletStage, { kind: "loss" }>;
  done: boolean;
  onResult: (passed: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  // Build a quick simulated curve based on stage.curve
  const N = 50;
  const pts = Array.from({ length: N }, (_, i) => {
    if (stage.curve === "good") return 6 * Math.exp(-i * 0.06) + 0.4;
    if (stage.curve === "diverging") return 4 + i * 0.07 + Math.sin(i * 0.4) * 0.2;
    if (stage.curve === "stuck") return 5.8 + (Math.sin(i) * 0.08);
    return 4 + Math.sin(i * 0.3) * 1.0;
  });

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    onResult(i === stage.correctIdx);
  }

  return (
    <div>
      <div className="rounded-card border border-line/60 bg-bg-soft/40 p-3 mb-4 h-32">
        <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="w-full h-full">
          <polyline
            points={pts
              .map((v, i) => {
                const x = (i / (N - 1)) * 200;
                const y = 100 - (v / 8) * 80;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="#ff8a3c"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="font-display text-lg mb-3">{stage.question}</div>
      <div className="grid sm:grid-cols-2 gap-3">
        {stage.options.map((opt, i) => {
          const isPicked = picked === i;
          const isCorrect = i === stage.correctIdx;
          const showState = picked !== null;
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={picked !== null}
              className={`rounded-card border-2 px-4 py-3 text-left font-display ${
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
