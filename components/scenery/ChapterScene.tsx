"use client";

import { motion } from "framer-motion";
import { Chapter } from "@/lib/chapters";
import { Beep } from "@/components/characters/Beep";
import { Art } from "./Art";

const CHAPTER_ART_SLUG = [
  "scene-00-egg",
  "scene-01-architecture",
  "scene-02-tokens",
  "scene-03-embeddings",
  "scene-04-position",
  "scene-05-attention",
  "scene-06-block",
  "scene-07-full-gpt",
  "scene-08-training",
  "scene-09-inference",
  "scene-10-soar",
];

/**
 * Painterly illustrated banner that sits above each chapter title.
 * Renders the painted PNG when present, otherwise the SVG fallback.
 */
export function ChapterScene({ chapter }: { chapter: Chapter }) {
  return (
    <div className="relative w-full h-32 md:h-44 rounded-card overflow-hidden border-2 border-line mb-6 sticker">
      <Art
        name={CHAPTER_ART_SLUG[chapter.id] ?? "scene-00-egg"}
        alt={`Illustrated banner for chapter ${chapter.id} — ${chapter.title}`}
        fallback={<SvgChapterFallback chapter={chapter} />}
      />

      {/* Always-on overlays */}
      <div className="pointer-events-none absolute inset-0">
        {/* Chapter number badge */}
        <div className="absolute top-3 left-4 flex items-baseline gap-2 z-10">
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/90 drop-shadow">
            chapter
          </span>
          <span className="font-display text-2xl text-white drop-shadow-md">
            {String(chapter.id).padStart(2, "0")}
          </span>
        </div>

        {/* Subtitle text on right */}
        <div className="absolute right-4 bottom-3 text-right">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/90 drop-shadow">
            stage
          </div>
          <div className="font-serif-wonky italic text-white text-base drop-shadow-md">
            {chapter.subtitle}
          </div>
        </div>

        {/* Beep crossing the scene */}
        <motion.div
          className="absolute"
          animate={{ x: [-50, 1200] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ top: "30%" }}
        >
          <Beep size={32} />
        </motion.div>
      </div>
    </div>
  );
}

function SvgChapterFallback({ chapter }: { chapter: Chapter }) {
  const { gradient, accent, doodles, ground } = SCENES[chapter.id] ?? SCENES[0];
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 80% 20%, rgba(255, 245, 200, 0.55), transparent 60%), radial-gradient(ellipse at 20% 80%, ${accent}33, transparent 60%)`,
        }}
      />
      <svg
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 w-full h-1/2 pointer-events-none"
      >
        <ellipse cx="120" cy="40" rx="40" ry="14" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="180" cy="50" rx="34" ry="12" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="780" cy="55" rx="38" ry="13" fill="rgba(255,255,255,0.7)" />
        <ellipse cx="860" cy="42" rx="32" ry="11" fill="rgba(255,255,255,0.7)" />
      </svg>
      <svg
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 w-full h-2/3 pointer-events-none"
      >
        <path
          d="M 0 120 Q 250 80 500 110 T 1000 120 L 1000 200 L 0 200 Z"
          fill={ground[0]}
        />
        <path
          d="M 0 150 Q 250 110 500 140 T 1000 150 L 1000 200 L 0 200 Z"
          fill={ground[1]}
        />
      </svg>
      <div className="absolute inset-0 pointer-events-none">
        {doodles.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
            className="absolute"
            style={{ left: `${d.x}%`, top: `${d.y}%`, fontSize: d.size ?? 32 }}
          >
            <motion.span
              animate={d.bob ? { y: [0, -3, 0] } : undefined}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{ display: "inline-block" }}
            >
              {d.emoji}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

type Scene = {
  gradient: [string, string];
  accent: string;
  ground: [string, string];
  doodles: { emoji: string; x: number; y: number; size?: number; bob?: boolean }[];
};

const GRASS_LIGHT: [string, string] = ["rgba(63, 122, 50, 0.55)", "rgba(45, 95, 36, 0.7)"];
const SAND_LIGHT: [string, string] = ["rgba(180, 119, 60, 0.55)", "rgba(122, 77, 40, 0.7)"];
const STONE_LIGHT: [string, string] = ["rgba(125, 91, 228, 0.45)", "rgba(80, 56, 168, 0.6)"];

const SCENES: Record<number, Scene> = {
  0: {
    gradient: ["#88cdee", "#ffd6cf"],
    accent: "#f5b324",
    ground: GRASS_LIGHT,
    doodles: [
      { emoji: "🥚", x: 28, y: 30, size: 56, bob: true },
      { emoji: "✨", x: 22, y: 18, size: 24 },
      { emoji: "✨", x: 38, y: 22, size: 18 },
      { emoji: "🌷", x: 56, y: 60, size: 30, bob: true },
    ],
  },
  1: {
    gradient: ["#b9b6f0", "#fffaec"],
    accent: "#7d5be4",
    ground: GRASS_LIGHT,
    doodles: [
      { emoji: "🧩", x: 24, y: 28, size: 42, bob: true },
      { emoji: "⚙️", x: 38, y: 38, size: 32, bob: true },
      { emoji: "🔧", x: 52, y: 26, size: 30 },
      { emoji: "📐", x: 64, y: 36, size: 28 },
    ],
  },
  2: {
    gradient: ["#ffd6cf", "#fffaec"],
    accent: "#f2682c",
    ground: SAND_LIGHT,
    doodles: [
      { emoji: "📜", x: 24, y: 32, size: 42, bob: true },
      { emoji: "✂️", x: 36, y: 28, size: 32 },
      { emoji: "🔢", x: 50, y: 34, size: 28 },
      { emoji: "📚", x: 62, y: 30, size: 36, bob: true },
    ],
  },
  3: {
    gradient: ["#88cdee", "#b9b6f0"],
    accent: "#2eb6d4",
    ground: GRASS_LIGHT,
    doodles: [
      { emoji: "🌌", x: 24, y: 30, size: 42, bob: true },
      { emoji: "💫", x: 36, y: 22, size: 28 },
      { emoji: "✨", x: 50, y: 30, size: 24 },
      { emoji: "🪐", x: 64, y: 26, size: 38, bob: true },
    ],
  },
  4: {
    gradient: ["#ffc1d6", "#88cdee"],
    accent: "#f5b324",
    ground: GRASS_LIGHT,
    doodles: [
      { emoji: "🧭", x: 24, y: 32, size: 42, bob: true },
      { emoji: "🗺️", x: 38, y: 28, size: 36 },
      { emoji: "📍", x: 54, y: 32, size: 28 },
      { emoji: "🌀", x: 66, y: 28, size: 36, bob: true },
    ],
  },
  5: {
    gradient: ["#b9b6f0", "#ffd6cf"],
    accent: "#f2682c",
    ground: STONE_LIGHT,
    doodles: [
      { emoji: "👁️", x: 24, y: 30, size: 42, bob: true },
      { emoji: "🔍", x: 38, y: 26, size: 32 },
      { emoji: "💡", x: 52, y: 32, size: 30, bob: true },
      { emoji: "🎯", x: 66, y: 28, size: 36 },
    ],
  },
  6: {
    gradient: ["#fffaec", "#b9b6f0"],
    accent: "#7d5be4",
    ground: STONE_LIGHT,
    doodles: [
      { emoji: "🧱", x: 24, y: 30, size: 36, bob: true },
      { emoji: "🏗️", x: 38, y: 26, size: 36 },
      { emoji: "🔨", x: 52, y: 32, size: 28 },
      { emoji: "📦", x: 66, y: 28, size: 32, bob: true },
    ],
  },
  7: {
    gradient: ["#88cdee", "#fffaec"],
    accent: "#43b878",
    ground: GRASS_LIGHT,
    doodles: [
      { emoji: "🐉", x: 24, y: 30, size: 50, bob: true },
      { emoji: "⚡", x: 40, y: 26, size: 30 },
      { emoji: "🌟", x: 54, y: 30, size: 28 },
      { emoji: "🔮", x: 68, y: 28, size: 36, bob: true },
    ],
  },
  8: {
    gradient: ["#ffc1d6", "#fffaec"],
    accent: "#e64f8f",
    ground: GRASS_LIGHT,
    doodles: [
      { emoji: "📉", x: 24, y: 30, size: 38, bob: true },
      { emoji: "🎓", x: 38, y: 26, size: 36 },
      { emoji: "💪", x: 52, y: 32, size: 30 },
      { emoji: "🔁", x: 66, y: 28, size: 32, bob: true },
    ],
  },
  9: {
    gradient: ["#b9b6f0", "#88cdee"],
    accent: "#2eb6d4",
    ground: GRASS_LIGHT,
    doodles: [
      { emoji: "🎲", x: 24, y: 30, size: 38, bob: true },
      { emoji: "🌡️", x: 38, y: 26, size: 32 },
      { emoji: "🎨", x: 52, y: 32, size: 32 },
      { emoji: "🔥", x: 66, y: 28, size: 32, bob: true },
    ],
  },
  10: {
    gradient: ["#88cdee", "#ffd6cf"],
    accent: "#f5b324",
    ground: GRASS_LIGHT,
    doodles: [
      { emoji: "🐉", x: 22, y: 24, size: 56, bob: true },
      { emoji: "☁️", x: 38, y: 30, size: 36 },
      { emoji: "✨", x: 52, y: 22, size: 24 },
      { emoji: "🌅", x: 64, y: 28, size: 40, bob: true },
    ],
  },
};
