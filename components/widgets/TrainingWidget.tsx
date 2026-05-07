"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";

type Pt = { step: number; loss: number };

export function TrainingWidget({ onComplete }: { onComplete: () => void }) {
  const [lr, setLr] = useState(3); // 1..10, mapped exponentially
  const [data, setData] = useState<Pt[]>([]);
  const [running, setRunning] = useState(false);
  const stepRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  function start() {
    setData([]);
    stepRef.current = 0;
    setRunning(true);
  }
  function stop() {
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  // Simulated training loop
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      stepRef.current += 1;
      const s = stepRef.current;
      const lrReal = Math.pow(10, lr / 3 - 4); // 1e-4 to 1e-1 ish
      const ideal = 0.0008;
      // Loss = baseline decay + noise + LR effect
      const decay = Math.exp(-s * 0.012 * (lrReal / ideal));
      let loss = 0.4 + 6.5 * decay + (Math.random() - 0.5) * 0.4;
      // Too high LR diverges
      if (lrReal > 0.02) loss += s * 0.02;
      if (lrReal < 0.00005) loss = 6.5 - s * 0.005;
      loss = Math.max(0.3, loss);

      setData((d) => [...d, { step: s, loss }].slice(-200));
      if (s < 200) rafRef.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, lr]);

  // Auto-stop on unmount
  useEffect(() => () => stop(), []);

  const lrReal = Math.pow(10, lr / 3 - 4);
  const lastLoss = data.at(-1)?.loss ?? null;
  const minLoss = data.length ? Math.min(...data.map((d) => d.loss)) : null;

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="Train a tiny model. Tweak the learning rate. Too high → diverge. Too low → never learn."
    >
      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        <div>
          <Tag>loss curve</Tag>
          <div className="mt-3 rounded-card border border-line/60 bg-bg-soft/40 p-4 h-64 relative">
            <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
              <line
                x1="0"
                y1="80"
                x2="200"
                y2="80"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.3"
              />
              <line
                x1="0"
                y1="20"
                x2="200"
                y2="20"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.3"
                strokeDasharray="1 2"
              />
              {data.length > 1 && (
                <polyline
                  points={data
                    .map(
                      (d) =>
                        `${(d.step / 200) * 200},${
                          100 - Math.min(95, (d.loss / 8) * 80)
                        }`
                    )
                    .join(" ")}
                  fill="none"
                  stroke="#ff8a3c"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {data.length === 0 && (
                <text
                  x="100"
                  y="50"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.3)"
                  fontSize="6"
                  fontFamily="monospace"
                >
                  press start to train
                </text>
              )}
            </svg>
            <div className="absolute top-2 right-3 text-[10px] font-mono text-ink-dim">
              step {stepRef.current} / 200
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-xs font-mono">
            <Stat label="Current loss" value={lastLoss?.toFixed(3) ?? "—"} />
            <Stat label="Best loss" value={minLoss?.toFixed(3) ?? "—"} />
            <Stat
              label="Verdict"
              value={
                lastLoss === null
                  ? "—"
                  : lastLoss > 5
                  ? "diverging"
                  : lastLoss > 2
                  ? "learning"
                  : "converged"
              }
              tone={
                lastLoss === null
                  ? undefined
                  : lastLoss > 5
                  ? "rose"
                  : lastLoss > 2
                  ? "yolk"
                  : "mint"
              }
            />
          </div>
        </div>

        <div>
          <Tag>controls</Tag>
          <div className="mt-3 rounded-card border border-line/40 bg-bg-soft/40 p-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-ink-dim">Learning rate</span>
                <span className="text-ember">{lrReal.toExponential(1)}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={lr}
                onChange={(e) => setLr(parseInt(e.target.value))}
                className="w-full accent-ember"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-dim mt-1">
                <span>too low</span>
                <span>good</span>
                <span>too high</span>
              </div>
            </div>

            <div className="flex gap-2">
              {!running ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={start}
                  className="flex-1 rounded-pill bg-ember text-bg px-3 py-2 text-sm font-medium hover:bg-ember-soft"
                >
                  start training
                </motion.button>
              ) : (
                <button
                  onClick={stop}
                  className="flex-1 rounded-pill border border-line bg-bg-elev text-ink px-3 py-2 text-sm font-medium hover:bg-bg-soft"
                >
                  stop
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-ink-mute mt-4 leading-relaxed">
            The model is just guessing the next token. Loss measures how
            surprised it was. Backprop nudges every weight to be a bit less
            surprised next time.
          </p>
        </div>
      </div>
    </WidgetFrame>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "mint" | "yolk" | "rose";
}) {
  const toneCls =
    tone === "mint"
      ? "text-mint"
      : tone === "yolk"
      ? "text-yolk"
      : tone === "rose"
      ? "text-rose"
      : "text-ink";
  return (
    <div className="rounded-card border border-line/40 bg-bg-soft/40 p-3">
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim">
        {label}
      </div>
      <div className={`font-display text-lg mt-1 ${toneCls}`}>{value}</div>
    </div>
  );
}
