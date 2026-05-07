"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { CHAPTERS, Chapter } from "@/lib/chapters";
import { challengeFor } from "@/lib/challenges";
import { Mascot } from "./Mascot";
import { Stars } from "./Stars";
import { Beep } from "@/components/characters/Beep";
import { Sprout } from "@/components/characters/Sprout";
import { Sage } from "@/components/characters/Sage";
import { Art } from "@/components/scenery/Art";
import {
  Sky,
  Clouds,
  Stars2,
  Mountains,
  Trees,
  Tufts,
  MagicMotes,
  BigSun,
} from "@/components/scenery/Scenery";
import { cn } from "@/lib/utils";

const NODES: { x: number; y: number }[] = [
  { x: 50, y: 92 },
  { x: 70, y: 85 },
  { x: 30, y: 78 },
  { x: 56, y: 70 },
  { x: 22, y: 62 },
  { x: 50, y: 53 },
  { x: 75, y: 44 },
  { x: 32, y: 35 },
  { x: 60, y: 25 },
  { x: 28, y: 15 },
  { x: 52, y: 5 },
];

const ACCENT_BG: Record<Chapter["accent"], string> = {
  ember: "from-ember to-yolk",
  yolk: "from-yolk to-ember",
  cyan: "from-cyan to-violet",
  violet: "from-violet to-rose",
  mint: "from-mint to-cyan",
  rose: "from-rose to-violet",
};

export function WorldMap({
  isUnlocked,
  isComplete,
  starsByChapter,
  completedCount,
}: {
  isUnlocked: (id: number) => boolean;
  isComplete: (id: number) => boolean;
  starsByChapter: Record<number, number>;
  completedCount: number;
}) {
  const currentIdx = Math.min(completedCount, NODES.length - 1);
  const currentNode = NODES[currentIdx];

  const pathD = useMemo(() => buildPath(NODES), []);

  return (
    <div className="relative w-full overflow-hidden rounded-card border-2 border-line shadow-card">
      <div className="relative w-full" style={{ aspectRatio: "5 / 9" }}>
        {/* Painted journey landscape — falls back to SVG scene if PNG missing */}
        <Art
          name="world-map"
          alt="A vertical illustrated journey from a nest at the bottom up through pastel mountains and into the daytime sky."
          fallback={
            <div className="absolute inset-0">
              <Sky />
              <Stars2 />
              <Clouds />
              <Mountains />
              <BigSun size={120} style={{ left: "76%", top: "2%" }} />
              <Trees
                positions={[
                  { x: 6, y: 96, size: 22, kind: "round" },
                  { x: 14, y: 95, size: 18, kind: "pine" },
                  { x: 88, y: 96, size: 22, kind: "pine" },
                  { x: 95, y: 94, size: 16, kind: "round" },
                  { x: 78, y: 90, size: 14, kind: "round" },
                  { x: 12, y: 88, size: 14, kind: "pine" },
                  { x: 92, y: 84, size: 13, kind: "round" },
                  { x: 5, y: 80, size: 12, kind: "pine" },
                  { x: 84, y: 74, size: 12, kind: "round" },
                ]}
              />
              <Tufts
                positions={[
                  { x: 45, y: 96 },
                  { x: 60, y: 90 },
                  { x: 25, y: 86 },
                  { x: 75, y: 82 },
                  { x: 40, y: 75 },
                  { x: 65, y: 65 },
                  { x: 18, y: 55 },
                ]}
              />
              <div
                className="absolute"
                style={{ left: "6%", top: "48%", width: 56, height: 56 }}
              >
                <Sage size={48} />
              </div>
            </div>
          }
        />

        {/* Always-on overlay: pixie dust sparkles regardless of art mode */}
        <MagicMotes count={26} />

        {/* Glowing dotted path */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="pathGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#f2682c" />
              <stop offset="50%" stopColor="#e64f8f" />
              <stop offset="100%" stopColor="#7d5be4" />
            </linearGradient>
            <filter id="pathGlow">
              <feGaussianBlur stdDeviation="0.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Path shadow / soft halo */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(125, 91, 228, 0.18)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#pathGrad)"
            strokeWidth="0.8"
            strokeDasharray="0.9 1.1"
            strokeLinecap="round"
            filter="url(#pathGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
          />
        </svg>

        {/* Beep — flies along the path between current node and the next */}
        <BeepFlyer currentIdx={currentIdx} />

        {/* Chapter checkpoints */}
        {NODES.map((n, i) => (
          <Checkpoint
            key={i}
            node={n}
            chapter={CHAPTERS[i]}
            isCurrent={i === currentIdx && !isComplete(i)}
            unlocked={isUnlocked(i)}
            done={isComplete(i)}
            stars={starsByChapter[i] ?? 0}
            delay={i * 0.08 + 0.6}
          />
        ))}

        {/* Hatchling — sits on the current node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: 1,
            scale: 1,
            left: `${currentNode.x}%`,
            top: `${currentNode.y}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 18,
            delay: 1.4,
          }}
          className="absolute pointer-events-none"
          style={{ transform: "translate(-50%, -100%)" }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <Mascot
              stage={
                completedCount >= 10
                  ? "soar"
                  : completedCount >= 8
                  ? "fledge"
                  : completedCount >= 6
                  ? "wing"
                  : completedCount >= 4
                  ? "hatch"
                  : completedCount >= 2
                  ? "crack"
                  : "egg"
              }
              size={68}
              glow
            />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono text-ember uppercase tracking-[0.18em] bg-bg-elev rounded-pill px-2 py-0.5 border-2 border-ember whitespace-nowrap sticker">
              you · here
            </div>
          </motion.div>
        </motion.div>

        {/* Sky and nest labels */}
        <div className="absolute top-3 left-4 text-[10px] font-mono uppercase tracking-[0.22em] text-violet bg-bg-elev/80 rounded-pill px-2 py-0.5 border border-line backdrop-blur-sm">
          ☁ the sky
        </div>
        <div className="absolute bottom-3 right-4 text-[10px] font-mono uppercase tracking-[0.22em] text-ember bg-bg-elev/80 rounded-pill px-2 py-0.5 border border-line backdrop-blur-sm">
          🪺 the nest
        </div>
      </div>
    </div>
  );
}

function BeepFlyer({ currentIdx }: { currentIdx: number }) {
  // Beep flits between the current node and the previous one in a small loop.
  const node = NODES[currentIdx] ?? NODES[0];
  const next = NODES[Math.max(0, currentIdx - 1)] ?? node;

  return (
    <motion.div
      className="absolute pointer-events-none z-20"
      animate={{
        left: [`${node.x}%`, `${(node.x + next.x) / 2}%`, `${node.x}%`],
        top: [`${node.y - 4}%`, `${(node.y + next.y) / 2 - 6}%`, `${node.y - 4}%`],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <Beep size={36} />
    </motion.div>
  );
}

function Checkpoint({
  node,
  chapter,
  isCurrent,
  unlocked,
  done,
  stars,
  delay,
}: {
  node: { x: number; y: number };
  chapter: Chapter;
  isCurrent: boolean;
  unlocked: boolean;
  done: boolean;
  stars: number;
  delay: number;
}) {
  const ch = challengeFor(chapter.id);
  const grad = ACCENT_BG[chapter.accent];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 14, delay }}
      className="absolute"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Sprout sidekick at completed checkpoints */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
          className="absolute pointer-events-none"
          style={{ left: -28, top: 6 }}
        >
          <Sprout size={26} />
        </motion.div>
      )}

      {unlocked ? (
        <Link href={`/play/${chapter.slug}`} className="group block">
          <NodeBubble
            chapter={chapter}
            done={done}
            isCurrent={isCurrent}
            stars={stars}
            grad={grad}
          />
          <NodeLabel chapter={chapter} ch={ch} />
        </Link>
      ) : (
        <div className="cursor-not-allowed opacity-70">
          <NodeBubble
            chapter={chapter}
            done={false}
            isCurrent={false}
            stars={0}
            grad={grad}
            locked
          />
        </div>
      )}
    </motion.div>
  );
}

function NodeBubble({
  chapter,
  done,
  isCurrent,
  stars,
  grad,
  locked,
}: {
  chapter: Chapter;
  done: boolean;
  isCurrent: boolean;
  stars: number;
  grad: string;
  locked?: boolean;
}) {
  return (
    <div className="relative">
      {isCurrent && (
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-yolk"
        />
      )}
      <motion.div
        whileHover={{ scale: locked ? 1 : 1.12, y: locked ? 0 : -3 }}
        whileTap={{ scale: locked ? 1 : 0.95 }}
        className={cn(
          "relative w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-base border-[3px]",
          done
            ? `bg-gradient-to-br ${grad} border-white text-white`
            : isCurrent
            ? "bg-yolk border-white text-ink"
            : locked
            ? "bg-bg-soft border-line text-ink-dim"
            : "bg-bg-elev border-ember text-ember"
        )}
        style={{
          boxShadow: done
            ? "0 6px 18px -4px rgba(125, 91, 228, 0.45), inset 0 -3px 0 rgba(42, 31, 74, 0.18)"
            : isCurrent
            ? "0 8px 22px -4px rgba(245, 179, 36, 0.6), inset 0 -3px 0 rgba(42, 31, 74, 0.18)"
            : "0 4px 12px -2px rgba(125, 91, 228, 0.18), inset 0 -3px 0 rgba(42, 31, 74, 0.1)",
        }}
      >
        {locked ? (
          <LockIcon />
        ) : done ? (
          "✓"
        ) : (
          String(chapter.id).padStart(2, "0")
        )}
      </motion.div>
      {done && stars > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            delay: 0.3,
          }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-bg-elev rounded-pill px-1.5 py-0.5 border-2 border-yolk sticker"
        >
          <Stars count={stars} size={9} />
        </motion.div>
      )}
    </div>
  );
}

function NodeLabel({
  chapter,
  ch,
}: {
  chapter: Chapter;
  ch: ReturnType<typeof challengeFor>;
}) {
  const KIND: Record<string, string> = {
    build: "build",
    order: "drag",
    split: "slice",
    imposter: "spot",
    "position-puzzle": "phase",
    "attention-target": "click",
    "find-gap": "plug",
    "loss-curve": "curve",
    "temp-match": "match",
    gauntlet: "boss",
  };
  return (
    <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
      <div className="font-display text-xs text-ink font-medium leading-tight bg-bg-elev rounded-md px-2 py-0.5 border border-line sticker">
        {chapter.title}
      </div>
      {ch && (
        <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-ember mt-1">
          ⚡ {KIND[ch.kind] ?? ch.kind}
        </div>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8V7a5 5 0 0 0-10 0v1H5v13h14V8h-2zm-8-1a3 3 0 0 1 6 0v1H9V7zm10 12H5V10h14v9z" />
    </svg>
  );
}

function buildPath(nodes: { x: number; y: number }[]): string {
  if (nodes.length === 0) return "";
  let d = `M ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i - 1];
    const curr = nodes[i];
    const c1x = prev.x;
    const c1y = (prev.y + curr.y) / 2;
    const c2x = curr.x;
    const c2y = (prev.y + curr.y) / 2;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${curr.x} ${curr.y}`;
  }
  return d;
}
