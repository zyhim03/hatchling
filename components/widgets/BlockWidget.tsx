"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";
import { range } from "@/lib/utils";

export function BlockWidget({ onComplete }: { onComplete: () => void }) {
  const [layers, setLayers] = useState(4);
  const [tick, setTick] = useState(0);

  function pulse() {
    setTick((t) => t + 1);
  }

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="Stack blocks. Each one routes (attention) and refines (MLP). Add layers, hit pulse, watch info flow up the residual stream."
    >
      <div className="grid md:grid-cols-[1.5fr_1fr] gap-6">
        <div className="rounded-card border border-line/60 bg-bg-soft/40 p-6">
          <div className="flex flex-col items-center gap-2">
            {/* Output (logits) */}
            <Pill label="logits" tone="ember" />
            <Arrow />

            {range(layers).map((i) => (
              <div key={`${tick}-${i}`} className="w-full max-w-md">
                <BlockCard index={layers - i - 1} delay={i * 0.25} />
                {i < layers - 1 && <Arrow />}
              </div>
            ))}

            <Arrow />
            <Pill label="embeddings" tone="cyan" />
          </div>
          <div className="mt-4 flex items-center gap-3 text-xs font-mono text-ink-mute">
            <button
              onClick={pulse}
              className="rounded-pill bg-ember text-bg px-3 py-1 font-medium hover:bg-ember-soft"
            >
              pulse forward ↑
            </button>
            <span className="text-ink-dim">layers</span>
            <input
              type="range"
              min={1}
              max={8}
              value={layers}
              onChange={(e) => setLayers(parseInt(e.target.value))}
              className="accent-ember"
            />
            <span className="text-ember">{layers}</span>
          </div>
        </div>

        <div>
          <Tag>what's inside one block</Tag>
          <ol className="mt-3 space-y-3">
            <Step
              n="1"
              title="RMSNorm"
              body="Normalize the residual stream so things stay numerically tame."
            />
            <Step
              n="2"
              title="Self-attention"
              body="Each token pulls info from earlier tokens that matter."
            />
            <Step
              n="3"
              title="Add residual"
              body="Glue the routed info back onto the original stream."
            />
            <Step
              n="4"
              title="RMSNorm"
              body="Normalize again before thinking."
            />
            <Step
              n="5"
              title="MLP (SwiGLU)"
              body="Each token thinks privately about what it just heard."
            />
            <Step
              n="6"
              title="Add residual"
              body="Glue thoughts back. Pass to next block."
            />
          </ol>
          <p className="text-sm text-ink-mute mt-5 leading-relaxed">
            Same six steps, repeated N times. That repetition is where the
            depth and intelligence come from.
          </p>
        </div>
      </div>
    </WidgetFrame>
  );
}

function BlockCard({ index, delay }: { index: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0.4, y: 0 }}
      animate={{ opacity: [0.4, 1, 0.5], y: [0, -3, 0] }}
      transition={{ duration: 1.2, delay }}
      className="rounded-card border border-line/60 bg-bg-elev/80 p-3 relative"
    >
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-ink-dim mb-2">
        <span>block {String(index).padStart(2, "0")}</span>
        <span className="text-ember">resid +=</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="rounded border border-violet/40 bg-violet/10 text-violet text-center py-1.5">
          attention
        </div>
        <div className="rounded border border-cyan/40 bg-cyan/10 text-cyan text-center py-1.5">
          MLP
        </div>
      </div>
    </motion.div>
  );
}

function Pill({
  label,
  tone,
}: {
  label: string;
  tone: "ember" | "cyan";
}) {
  const cls =
    tone === "ember"
      ? "border-ember/60 bg-ember/10 text-ember"
      : "border-cyan/60 bg-cyan/10 text-cyan";
  return (
    <div
      className={`rounded-pill border px-4 py-1.5 font-mono text-xs ${cls}`}
    >
      {label}
    </div>
  );
}

function Arrow() {
  return (
    <svg width="12" height="22" viewBox="0 0 12 22" className="text-ink-dim">
      <line x1="6" y1="2" x2="6" y2="18" stroke="currentColor" strokeWidth="1" />
      <polygon points="6,22 2,16 10,16" fill="currentColor" />
    </svg>
  );
}

function Step({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-full border border-ember/40 bg-ember/10 text-ember font-mono text-xs flex items-center justify-center">
        {n}
      </div>
      <div>
        <div className="font-display text-ink">{title}</div>
        <div className="text-sm text-ink-mute">{body}</div>
      </div>
    </li>
  );
}
