"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { WidgetFrame, Tag } from "./shared";
import { range } from "@/lib/utils";

export function PositionalWidget({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [position, setPosition] = useState(3);
  const [dim, setDim] = useState(0);

  // RoPE-style angle: theta_i = pos / (10000^(2i/d))
  const angle = (pos: number, d: number) => {
    return pos / Math.pow(10000, (2 * d) / 64);
  };

  const SEQ_LEN = 8;
  const DIMS = 6;

  const cells = range(SEQ_LEN).flatMap((p) =>
    range(DIMS).map((d) => ({
      p,
      d,
      a: angle(p, d),
      sin: Math.sin(angle(p, d)),
    }))
  );

  return (
    <WidgetFrame
      onComplete={onComplete}
      caption="Position is encoded as rotation. Each token's vector spins by an angle that depends on its position."
    >
      <div className="grid md:grid-cols-[1fr_1fr] gap-8">
        {/* Vector visualizer */}
        <div>
          <Tag>token at position {position}, dim pair {dim}</Tag>
          <div className="mt-3 aspect-square rounded-card border border-line/60 bg-bg-soft/60 flex items-center justify-center relative grid-bg">
            <svg viewBox="-1.4 -1.4 2.8 2.8" className="w-full h-full">
              {/* Circle */}
              <circle
                cx="0"
                cy="0"
                r="1"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.01"
              />
              {/* Axes */}
              <line
                x1="-1.2"
                x2="1.2"
                y1="0"
                y2="0"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.005"
              />
              <line
                y1="-1.2"
                y2="1.2"
                x1="0"
                x2="0"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.005"
              />
              {/* Original vector */}
              <line
                x1="0"
                y1="0"
                x2="1"
                y2="0"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.02"
                strokeDasharray="0.04"
              />
              {/* Rotated vector */}
              <motion.line
                x1="0"
                y1="0"
                animate={{
                  x2: Math.cos(angle(position, dim)),
                  y2: -Math.sin(angle(position, dim)),
                }}
                stroke="#ff8a3c"
                strokeWidth="0.04"
                strokeLinecap="round"
              />
              <motion.circle
                animate={{
                  cx: Math.cos(angle(position, dim)),
                  cy: -Math.sin(angle(position, dim)),
                }}
                r="0.06"
                fill="#ff8a3c"
              />
            </svg>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono">
            <Slider
              label="Position"
              value={position}
              onChange={setPosition}
              min={0}
              max={32}
            />
            <Slider
              label="Dim pair"
              value={dim}
              onChange={setDim}
              min={0}
              max={31}
            />
          </div>
        </div>

        {/* Heatmap */}
        <div>
          <Tag>sin(angle) across positions × dimensions</Tag>
          <div className="mt-3 rounded-card border border-line/60 bg-bg-soft/60 p-4">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${DIMS}, 1fr)` }}
            >
              {cells.map((c) => {
                const v = (c.sin + 1) / 2; // 0..1
                const isSel = c.p === position && c.d === dim;
                return (
                  <button
                    key={`${c.p}-${c.d}`}
                    onClick={() => {
                      setPosition(c.p);
                      setDim(c.d);
                    }}
                    className={`aspect-square rounded transition border ${
                      isSel ? "border-ember" : "border-transparent"
                    }`}
                    style={{
                      background: `rgba(255,138,60,${v.toFixed(2)})`,
                    }}
                    title={`pos=${c.p}, dim=${c.d}, sin=${c.sin.toFixed(2)}`}
                  />
                );
              })}
            </div>
            <div className="mt-3 flex justify-between text-[10px] font-mono text-ink-dim">
              <span>pos 0</span>
              <span>pos {SEQ_LEN - 1}</span>
            </div>
          </div>
          <p className="text-sm text-ink-mute mt-4 leading-relaxed">
            High dim pairs rotate slowly, low ones spin fast. Together they
            give every position a unique fingerprint the model can learn to
            read.
          </p>
        </div>
      </div>
    </WidgetFrame>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="rounded-card border border-line/40 bg-bg-soft/40 p-3">
      <div className="flex justify-between text-ink-dim mb-2">
        <span>{label}</span>
        <span className="text-ember">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-ember"
      />
    </div>
  );
}
