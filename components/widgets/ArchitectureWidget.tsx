"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";
import { cn } from "@/lib/utils";

type Part = {
  id: string;
  name: string;
  short: string;
  detail: string;
  chapter: number;
};

const PARTS: Part[] = [
  {
    id: "tok",
    name: "Tokenizer",
    short: "Words → IDs",
    detail:
      "Splits raw text into sub-word chunks and maps each to an integer.",
    chapter: 2,
  },
  {
    id: "emb",
    name: "Embedding",
    short: "ID → vector",
    detail:
      "Looks up a learned vector for each token ID. Similar tokens land near each other.",
    chapter: 3,
  },
  {
    id: "pos",
    name: "Position",
    short: "Order info",
    detail:
      "Adds positional info via RoPE. Without this the model can't tell sequences apart.",
    chapter: 4,
  },
  {
    id: "att",
    name: "Attention",
    short: "Tokens talk",
    detail:
      "Each token routes information from earlier tokens that matter to it.",
    chapter: 5,
  },
  {
    id: "mlp",
    name: "MLP",
    short: "Tokens think",
    detail:
      "After routing, each token's vector is processed by a feed-forward block.",
    chapter: 6,
  },
  {
    id: "norm",
    name: "RMSNorm",
    short: "Stabilizer",
    detail:
      "Keeps the residual stream's scale healthy through deep stacks.",
    chapter: 6,
  },
  {
    id: "blk",
    name: "Block × N",
    short: "Stacked depth",
    detail:
      "Attention + MLP + residual, repeated. More blocks = more time to reason.",
    chapter: 6,
  },
  {
    id: "head",
    name: "Output head",
    short: "Vector → logits",
    detail:
      "Projects the final vector back into vocabulary space, giving a score per token.",
    chapter: 7,
  },
];

export function ArchitectureWidget({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [active, setActive] = useState<Part | null>(PARTS[0]);
  const [seen, setSeen] = useState<Set<string>>(new Set([PARTS[0].id]));

  function pick(p: Part) {
    setActive(p);
    setSeen((s) => new Set(s).add(p.id));
  }

  const allSeen = seen.size === PARTS.length;

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="Click each piece to see what it does. Inspect all eight to mark complete."
      unlocked={allSeen}
      cta={allSeen ? "Mark complete" : `Inspect ${PARTS.length - seen.size} more`}
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-8">
        {/* Architecture diagram */}
        <div>
          <Tag>the machine</Tag>
          <div className="mt-3 space-y-2">
            {PARTS.map((p) => {
              const isActive = active?.id === p.id;
              const isSeen = seen.has(p.id);
              return (
                <motion.button
                  key={p.id}
                  onClick={() => pick(p)}
                  whileHover={{ x: 2 }}
                  className={cn(
                    "w-full text-left rounded-card border px-4 py-3 transition flex items-center justify-between gap-3",
                    isActive
                      ? "border-ember bg-ember/10"
                      : isSeen
                      ? "border-line/60 bg-bg-elev/60"
                      : "border-line/30 bg-bg-soft/40 text-ink-mute"
                  )}
                >
                  <div>
                    <div className="font-display text-ink">{p.name}</div>
                    <div className="text-xs font-mono text-ink-dim">
                      {p.short}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-[10px] font-mono uppercase tracking-[0.18em]",
                      isSeen ? "text-mint" : "text-ink-dim"
                    )}
                  >
                    {isSeen ? "✓ seen" : "—"}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="rounded-card border border-line/60 bg-bg-soft/40 p-6">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Tag>chapter {String(active.chapter).padStart(2, "0")}</Tag>
              <h3 className="font-display text-2xl tracking-tight mt-3 mb-2">
                {active.name}
              </h3>
              <p className="text-ink-mute leading-relaxed">{active.detail}</p>

              <div className="mt-6 rounded-card bg-bg-elev/80 border border-line/40 p-4 font-mono text-xs text-ink-mute">
                # appears in chapter {active.chapter}
                <br />
                <span className="text-ember">{active.name.toLowerCase()}</span>(
                <span className="text-cyan">x</span>) →{" "}
                <span className="text-violet">vector</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-mono text-ink-mute">
        <div className="flex-1 h-1 rounded-full bg-bg-soft overflow-hidden">
          <motion.div
            className="h-full bg-ember"
            animate={{ width: `${(seen.size / PARTS.length) * 100}%` }}
          />
        </div>
        <span>
          {seen.size} / {PARTS.length} inspected
        </span>
      </div>
    </WidgetFrame>
  );
}
