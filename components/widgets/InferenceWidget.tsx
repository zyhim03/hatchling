"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";

const CANDIDATES = [
  { token: " soared", base: 4.2 },
  { token: " flew", base: 3.8 },
  { token: " breathed", base: 3.4 },
  { token: " roared", base: 3.0 },
  { token: " slept", base: 2.6 },
  { token: " curled", base: 2.4 },
  { token: " danced", base: 2.0 },
  { token: " coded", base: 1.6 },
  { token: " typed", base: 1.2 },
  { token: " blinked", base: 0.9 },
  { token: " tapped", base: 0.7 },
  { token: " yodeled", base: 0.4 },
];

export function InferenceWidget({ onComplete }: { onComplete: () => void }) {
  const [temp, setTemp] = useState(1.0);
  const [topK, setTopK] = useState(8);
  const [topP, setTopP] = useState(0.9);
  const [seed, setSeed] = useState(0);

  const probs = useMemo(() => {
    // Apply temperature
    const logits = CANDIDATES.map((c) => c.base / Math.max(temp, 0.05));
    const max = Math.max(...logits);
    const exps = logits.map((l) => Math.exp(l - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    const sm = exps.map((e) => e / sum);
    return CANDIDATES.map((c, i) => ({ ...c, p: sm[i] }));
  }, [temp]);

  const filtered = useMemo(() => {
    // Top-k mask
    const sorted = [...probs].sort((a, b) => b.p - a.p);
    const kAllowed = new Set(sorted.slice(0, topK).map((c) => c.token));
    // Top-p (nucleus) mask
    let cum = 0;
    const pAllowed = new Set<string>();
    for (const c of sorted) {
      pAllowed.add(c.token);
      cum += c.p;
      if (cum >= topP) break;
    }
    const allowed = probs
      .filter((p) => kAllowed.has(p.token) && pAllowed.has(p.token));
    const total = allowed.reduce((s, a) => s + a.p, 0) || 1;
    return allowed.map((a) => ({ ...a, p: a.p / total }));
  }, [probs, topK, topP]);

  const sampled = useMemo(() => {
    const r = pseudoRand(seed);
    let acc = 0;
    for (const c of filtered) {
      acc += c.p;
      if (r < acc) return c.token;
    }
    return filtered[0]?.token ?? "—";
  }, [filtered, seed]);

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="Move temperature up to get wilder. Top-k and top-p clip the long tail of bad guesses."
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-6">
        <div>
          <div className="rounded-card border border-line/60 bg-bg-soft/60 p-3 font-mono text-sm text-ink-mute mb-3 text-center">
            "Once upon a time, a small dragon"
            <span className="text-ember">{sampled}</span>
          </div>
          <Tag>distribution after temp · top-k · top-p</Tag>
          <div className="mt-3 space-y-1.5 max-h-72 overflow-auto pr-1">
            {[...probs]
              .sort((a, b) => b.p - a.p)
              .map((c) => {
                const allowed = filtered.find((f) => f.token === c.token);
                const w = allowed?.p ?? 0;
                return (
                  <div
                    key={c.token}
                    className="flex items-center gap-3 text-xs font-mono"
                  >
                    <div
                      className={`w-28 truncate ${
                        allowed ? "text-ink" : "text-ink-dim line-through"
                      }`}
                    >
                      {c.token}
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-bg-elev overflow-hidden">
                      <motion.div
                        animate={{
                          width: `${(allowed ? w : c.p) * 100}%`,
                        }}
                        className={`h-full ${
                          allowed ? "bg-ember" : "bg-ink-dim/30"
                        }`}
                      />
                    </div>
                    <div
                      className={`w-12 text-right ${
                        allowed ? "text-ember" : "text-ink-dim"
                      }`}
                    >
                      {((allowed ? w : c.p) * 100).toFixed(1)}%
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div>
          <Tag>sampling controls</Tag>
          <div className="mt-3 rounded-card border border-line/40 bg-bg-soft/40 p-4 space-y-5">
            <Slider
              label="Temperature"
              value={temp}
              setValue={setTemp}
              min={0.1}
              max={2}
              step={0.05}
              hint={
                temp < 0.4
                  ? "very deterministic"
                  : temp > 1.4
                  ? "very chaotic"
                  : "balanced"
              }
            />
            <Slider
              label="Top-k"
              value={topK}
              setValue={setTopK}
              min={1}
              max={CANDIDATES.length}
              step={1}
              hint={`keep top ${topK} tokens`}
            />
            <Slider
              label="Top-p"
              value={topP}
              setValue={setTopP}
              min={0.1}
              max={1}
              step={0.05}
              hint={`keep until ${(topP * 100).toFixed(0)}% mass`}
            />
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="w-full rounded-pill bg-ember text-bg px-3 py-2 text-sm font-medium hover:bg-ember-soft"
            >
              re-sample ↻
            </button>
            <div className="rounded-card bg-bg-elev/60 border border-ember/30 p-3 text-center">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim mb-1">
                next token
              </div>
              <div className="font-display text-2xl text-ember">{sampled}</div>
            </div>
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}

function Slider({
  label,
  value,
  setValue,
  min,
  max,
  step,
  hint,
}: {
  label: string;
  value: number;
  setValue: (n: number) => void;
  min: number;
  max: number;
  step: number;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs font-mono mb-1.5">
        <span className="text-ink-dim">{label}</span>
        <span className="text-ember">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="w-full accent-ember"
      />
      {hint && (
        <div className="text-[10px] font-mono text-ink-dim mt-1">{hint}</div>
      )}
    </div>
  );
}

function pseudoRand(seed: number) {
  // deterministic 0..1 from int seed
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}
