"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";

type Pt = { word: string; x: number; y: number; cluster: string };

// Hand-tuned 2D embedding so semantic neighbors land near each other.
const POINTS: Pt[] = [
  // animals
  { word: "dragon", x: 0.18, y: 0.22, cluster: "creature" },
  { word: "wyvern", x: 0.22, y: 0.18, cluster: "creature" },
  { word: "phoenix", x: 0.14, y: 0.28, cluster: "creature" },
  { word: "bird", x: 0.26, y: 0.34, cluster: "creature" },
  { word: "egg", x: 0.32, y: 0.22, cluster: "creature" },
  // royalty
  { word: "king", x: 0.74, y: 0.2, cluster: "royal" },
  { word: "queen", x: 0.78, y: 0.26, cluster: "royal" },
  { word: "prince", x: 0.7, y: 0.28, cluster: "royal" },
  { word: "princess", x: 0.74, y: 0.34, cluster: "royal" },
  { word: "throne", x: 0.82, y: 0.18, cluster: "royal" },
  // tech
  { word: "model", x: 0.46, y: 0.7, cluster: "ml" },
  { word: "neural", x: 0.4, y: 0.74, cluster: "ml" },
  { word: "tensor", x: 0.5, y: 0.78, cluster: "ml" },
  { word: "token", x: 0.54, y: 0.7, cluster: "ml" },
  { word: "gradient", x: 0.46, y: 0.82, cluster: "ml" },
  // weather
  { word: "fire", x: 0.18, y: 0.7, cluster: "elem" },
  { word: "flame", x: 0.14, y: 0.74, cluster: "elem" },
  { word: "smoke", x: 0.22, y: 0.78, cluster: "elem" },
  { word: "ash", x: 0.18, y: 0.82, cluster: "elem" },
  // far apart
  { word: "table", x: 0.86, y: 0.78, cluster: "object" },
  { word: "chair", x: 0.82, y: 0.74, cluster: "object" },
];

const CLUSTER_COLOR: Record<string, string> = {
  creature: "fill-ember stroke-ember",
  royal: "fill-violet stroke-violet",
  ml: "fill-cyan stroke-cyan",
  elem: "fill-yolk stroke-yolk",
  object: "fill-mint stroke-mint",
};

export function EmbeddingsWidget({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<Pt | null>(POINTS[0]);

  const neighbors = useMemo(() => {
    if (!selected) return [];
    const others = POINTS.filter((p) => p.word !== selected.word);
    return others
      .map((p) => ({
        ...p,
        d: Math.hypot(p.x - selected.x, p.y - selected.y),
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 4);
  }, [selected]);

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="Click a word. Watch which words live near it. Closeness = similarity in meaning."
    >
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
        <div className="relative aspect-square rounded-card border border-line/60 bg-bg-soft/60 overflow-hidden grid-bg">
          {/* Axis labels */}
          <div className="absolute left-3 bottom-3 text-[10px] font-mono text-ink-dim">
            ← creatures · royalty →
          </div>
          <div className="absolute left-3 top-3 text-[10px] font-mono text-ink-dim">
            ↑ abstract · physical ↓
          </div>

          <svg viewBox="0 0 1 1" className="absolute inset-0 w-full h-full">
            {/* Lines from selected to neighbors */}
            {selected &&
              neighbors.map((n) => (
                <motion.line
                  key={n.word}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  x1={selected.x}
                  y1={selected.y}
                  x2={n.x}
                  y2={n.y}
                  stroke="#ff8a3c"
                  strokeWidth="0.002"
                  strokeDasharray="0.005"
                />
              ))}

            {/* Points */}
            {POINTS.map((p) => {
              const isSel = selected?.word === p.word;
              return (
                <g
                  key={p.word}
                  onClick={() => setSelected(p)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSel ? 0.018 : 0.011}
                    className={`${CLUSTER_COLOR[p.cluster]} transition-all`}
                    fillOpacity={isSel ? 1 : 0.7}
                    strokeWidth="0.003"
                  />
                  <text
                    x={p.x + 0.018}
                    y={p.y + 0.005}
                    fontSize="0.018"
                    className={`font-mono ${
                      isSel ? "fill-ink" : "fill-ink-mute"
                    }`}
                  >
                    {p.word}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div>
          <Tag>nearest neighbors of</Tag>
          {selected && (
            <motion.div
              key={selected.word}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-display text-3xl tracking-tight mt-2 mb-4 text-ember">
                {selected.word}
              </h3>
              <div className="space-y-2">
                {neighbors.map((n, i) => (
                  <motion.div
                    key={n.word}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3 rounded-card border border-line/40 bg-bg-soft/60 px-3 py-2"
                  >
                    <span className="font-mono text-xs text-ink-dim w-4">
                      {i + 1}
                    </span>
                    <span className="font-display text-ink flex-1">
                      {n.word}
                    </span>
                    <span className="font-mono text-xs text-ember">
                      d = {n.d.toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-ink-mute mt-5 leading-relaxed">
                In a real model these vectors live in 768+ dimensions. Same
                idea: similar tokens cluster, distance ≈ semantic similarity.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </WidgetFrame>
  );
}
