"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";

const STAGES = [
  { id: "tok", label: "Tokenize", detail: "→ [27, 891, 4, 1019]" },
  { id: "emb", label: "Embed", detail: "→ vectors" },
  { id: "pos", label: "+ Position", detail: "→ rotated vectors" },
  { id: "blk", label: "Blocks ×12", detail: "→ refined stream" },
  { id: "norm", label: "Final norm", detail: "→ stable scale" },
  { id: "head", label: "Output head", detail: "→ logits" },
  { id: "smax", label: "Softmax", detail: "→ probabilities" },
];

export function FullModelWidget({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (step >= STAGES.length) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep(step + 1), 600);
    return () => clearTimeout(t);
  }, [step, running]);

  function run() {
    setStep(0);
    setRunning(true);
  }

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="One forward pass. Watch your token traverse every component you've unlocked."
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <Tag>input</Tag>
          <button
            onClick={run}
            disabled={running}
            className="rounded-pill bg-ember text-bg px-4 py-1.5 text-sm font-medium hover:bg-ember-soft disabled:opacity-50"
          >
            {running ? "running…" : "run forward pass ↓"}
          </button>
        </div>

        <div className="rounded-card border border-line/60 bg-bg-soft/60 p-3 font-mono text-sm text-ink mb-2 text-center">
          "Once upon a time, a small dragon"
        </div>

        <div className="space-y-2">
          {STAGES.map((s, i) => {
            const passed = step > i;
            const active = step === i;
            return (
              <motion.div
                key={s.id}
                initial={false}
                animate={{
                  borderColor: active
                    ? "rgba(255,138,60,1)"
                    : passed
                    ? "rgba(123,227,164,0.4)"
                    : "rgba(255,255,255,0.08)",
                  backgroundColor: active
                    ? "rgba(255,138,60,0.08)"
                    : passed
                    ? "rgba(123,227,164,0.04)"
                    : "rgba(255,255,255,0.02)",
                }}
                className="rounded-card border px-4 py-3 flex items-center gap-4"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono ${
                    passed
                      ? "bg-mint/20 text-mint"
                      : active
                      ? "bg-ember text-bg"
                      : "bg-bg-elev text-ink-dim"
                  }`}
                >
                  {passed ? "✓" : i + 1}
                </div>
                <div className="font-display text-ink flex-1">{s.label}</div>
                <div className="font-mono text-xs text-ink-mute">
                  {s.detail}
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {step >= STAGES.length && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-card border border-ember/40 bg-ember/5 p-5"
            >
              <Tag>predicted next token</Tag>
              <div className="mt-2 font-display text-3xl text-ember">
                "swooped"
              </div>
              <div className="text-xs font-mono text-ink-dim mt-1">
                p = 0.34 · token id 47192
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </WidgetFrame>
  );
}
