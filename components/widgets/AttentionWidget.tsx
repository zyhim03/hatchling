"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";

const SAMPLE = "The dragon ate the egg because it was hungry";

// Hand-crafted attention weights so coreference reads convincingly.
const PRESET: Record<string, number[]> = {
  it: [0.02, 0.45, 0.05, 0.02, 0.04, 0.02, 0.0, 0.0, 0.0],
  was: [0.01, 0.06, 0.05, 0.0, 0.0, 0.5, 0.38, 0.0, 0.0],
  hungry: [0.02, 0.4, 0.04, 0.02, 0.05, 0.02, 0.05, 0.4, 0.0],
  ate: [0.05, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  egg: [0.03, 0.05, 0.4, 0.05, 0.47, 0.0, 0.0, 0.0, 0.0],
};

function fakeAttn(tokens: string[], focusIdx: number): number[] {
  const focus = tokens[focusIdx].toLowerCase().replace(/[^a-z]/g, "");
  const preset = PRESET[focus];
  if (preset) {
    // Truncate / pad to length and re-mask future positions.
    const w = tokens.map((_, j) =>
      j > focusIdx ? 0 : preset[j] ?? 1 / (focusIdx + 1)
    );
    return normalize(w);
  }
  // Default: bias toward nearby + start of sentence.
  const w = tokens.map((_, j) => {
    if (j > focusIdx) return 0;
    const dist = Math.abs(j - focusIdx);
    return Math.exp(-dist * 0.4) + (j === 0 ? 0.2 : 0);
  });
  return normalize(w);
}

function normalize(w: number[]): number[] {
  const s = w.reduce((a, b) => a + b, 0) || 1;
  return w.map((v) => v / s);
}

export function AttentionWidget({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState(SAMPLE);
  const tokens = useMemo(() => text.trim().split(/\s+/), [text]);
  const [focus, setFocus] = useState(7); // "it"

  const weights = useMemo(() => fakeAttn(tokens, Math.min(focus, tokens.length - 1)), [
    tokens,
    focus,
  ]);

  const safeFocus = Math.min(focus, tokens.length - 1);

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="Click any token to see what it's looking at. Brighter = more attention. Try clicking 'it'."
    >
      <div className="space-y-6">
        <div>
          <Tag>your sentence</Tag>
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setFocus(0);
            }}
            className="mt-2 w-full rounded-card bg-bg-soft/80 border border-line/60 p-3 text-ink font-sans text-sm focus:border-ember/60 outline-none"
          />
        </div>

        {/* Tokens with attention overlay */}
        <div className="rounded-card border border-line/60 bg-bg-soft/40 p-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {tokens.map((t, i) => {
              const isFocus = i === safeFocus;
              const w = weights[i] ?? 0;
              const after = i > safeFocus;
              return (
                <motion.button
                  key={`${i}-${t}`}
                  onClick={() => setFocus(i)}
                  whileHover={{ y: -2 }}
                  className={`relative rounded-md border px-3 py-2 font-mono text-sm transition ${
                    isFocus
                      ? "border-ember bg-ember/15 text-ember"
                      : after
                      ? "border-line/30 bg-bg-soft/40 text-ink-dim"
                      : "border-line/40 bg-bg-elev/60 text-ink"
                  }`}
                  style={{
                    boxShadow: !isFocus && !after && w > 0.05
                      ? `0 0 0 1px rgba(255,138,60,${w.toFixed(2)}), 0 0 ${(w * 24).toFixed(0)}px rgba(255,138,60,${(w * 0.7).toFixed(2)})`
                      : undefined,
                  }}
                >
                  {t}
                  {!isFocus && !after && (
                    <span className="absolute -top-2 -right-2 text-[9px] font-mono bg-ember text-bg rounded-full px-1.5 py-0.5 opacity-90">
                      {(w * 100).toFixed(0)}
                    </span>
                  )}
                  {isFocus && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-ember">
                      ↑ focus
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Heatmap */}
        <div>
          <Tag>attention matrix</Tag>
          <div className="mt-3 rounded-card border border-line/60 bg-bg-soft/40 p-4 overflow-x-auto">
            <div className="inline-block">
              <table className="border-separate border-spacing-0.5">
                <tbody>
                  {tokens.map((rowTok, i) => {
                    const rowW = fakeAttn(tokens, i);
                    return (
                      <tr key={i}>
                        <td className="text-[10px] font-mono text-ink-dim pr-2 align-middle text-right whitespace-nowrap">
                          {rowTok}
                        </td>
                        {tokens.map((_, j) => {
                          const v = j > i ? 0 : rowW[j];
                          const isCellFocus = i === safeFocus;
                          return (
                            <td
                              key={j}
                              className={`w-7 h-7 rounded ${
                                isCellFocus ? "ring-1 ring-ember" : ""
                              }`}
                              style={{
                                background:
                                  j > i
                                    ? "rgba(255,255,255,0.02)"
                                    : `rgba(255,138,60,${(v * 1.5).toFixed(2)})`,
                              }}
                              title={`${rowTok} → ${tokens[j]}: ${v.toFixed(
                                2
                              )}`}
                            />
                          );
                        })}
                      </tr>
                    );
                  })}
                  <tr>
                    <td />
                    {tokens.map((t, j) => (
                      <td
                        key={j}
                        className="text-[9px] font-mono text-ink-dim pt-1 text-center"
                      >
                        {t.slice(0, 3)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-sm text-ink-mute mt-3 leading-relaxed">
            Each row is one token asking the question "who should I listen
            to?". The triangular shape comes from causal masking — a token
            can't attend to the future.
          </p>
        </div>
      </div>
    </WidgetFrame>
  );
}
