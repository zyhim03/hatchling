"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

/**
 * Sage — wise owl mentor. Tries the painted portrait at /art/char-sage.png
 * and falls back to the SVG armature if missing.
 */
export function Sage({ size = 64, glasses = true }: { size?: number; glasses?: boolean }) {
  const [errored, setErrored] = useState(false);

  if (!errored) {
    return (
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: size, height: size, position: "relative" }}
      >
        <Image
          src="/art/char-sage.png"
          alt="Sage, the wise owl mentor"
          fill
          sizes={`${size}px`}
          onError={() => setErrored(true)}
          style={{ objectFit: "contain" }}
        />
      </motion.div>
    );
  }

  return <SageSvg size={size} glasses={glasses} />;
}

function SageSvg({ size, glasses }: { size: number; glasses: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id="sageBody" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#d4b8a3" />
          <stop offset="60%" stopColor="#b08762" />
          <stop offset="100%" stopColor="#7e5b3a" />
        </radialGradient>
      </defs>

      {/* Wings (sides) */}
      <path d="M 16 50 Q 8 45 12 70 Q 18 78 28 70 Z" fill="#7e5b3a" stroke="#3e2812" strokeWidth="1" />
      <path d="M 84 50 Q 92 45 88 70 Q 82 78 72 70 Z" fill="#7e5b3a" stroke="#3e2812" strokeWidth="1" />

      {/* Body */}
      <ellipse cx="50" cy="56" rx="32" ry="34" fill="url(#sageBody)" stroke="#3e2812" strokeWidth="1.4" />

      {/* Belly */}
      <ellipse cx="50" cy="64" rx="20" ry="22" fill="#f4e1c4" />

      {/* Ear tufts */}
      <path d="M 24 28 L 30 18 L 34 32 Z" fill="#7e5b3a" stroke="#3e2812" strokeWidth="1" />
      <path d="M 76 28 L 70 18 L 66 32 Z" fill="#7e5b3a" stroke="#3e2812" strokeWidth="1" />

      {/* Eye discs (white) */}
      <circle cx="38" cy="48" r="12" fill="#fff8e8" stroke="#3e2812" strokeWidth="1.4" />
      <circle cx="62" cy="48" r="12" fill="#fff8e8" stroke="#3e2812" strokeWidth="1.4" />

      {/* Pupils */}
      <motion.g
        animate={{ x: [0, -1, 1, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <circle cx="38" cy="48" r="5" fill="#2a1f4a" />
        <circle cx="62" cy="48" r="5" fill="#2a1f4a" />
        <circle cx="40" cy="46" r="1.6" fill="#fff" />
        <circle cx="64" cy="46" r="1.6" fill="#fff" />
      </motion.g>

      {/* Glasses */}
      {glasses && (
        <g stroke="#2a1f4a" strokeWidth="1.4" fill="none">
          <circle cx="38" cy="48" r="13" />
          <circle cx="62" cy="48" r="13" />
          <line x1="51" y1="48" x2="49" y2="48" />
        </g>
      )}

      {/* Beak */}
      <path d="M 50 56 L 46 64 L 54 64 Z" fill="#f5b324" stroke="#a06f10" strokeWidth="1" />

      {/* Feet */}
      <path d="M 40 88 L 40 92 M 38 88 L 36 92 M 42 88 L 44 92" stroke="#a06f10" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 60 88 L 60 92 M 58 88 L 56 92 M 62 88 L 64 92" stroke="#a06f10" strokeWidth="1.6" strokeLinecap="round" />
    </motion.svg>
  );
}
