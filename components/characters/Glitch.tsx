"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

/**
 * Glitch — confused purple blob. Painted portrait at /art/char-glitch.png with SVG fallback.
 */
export function Glitch({ size = 56 }: { size?: number }) {
  const [errored, setErrored] = useState(false);

  if (!errored) {
    return (
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{
          scale: [0, 1.1, 1, 1, 1],
          rotate: [-20, 4, -2, 2, 0],
          x: [0, -3, 3, -2, 0],
        }}
        transition={{ duration: 0.6 }}
        style={{ width: size, height: size, position: "relative" }}
      >
        <Image
          src="/art/char-glitch.png"
          alt="Glitch, a confused purple creature"
          fill
          sizes={`${size}px`}
          onError={() => setErrored(true)}
          style={{ objectFit: "contain" }}
        />
      </motion.div>
    );
  }

  return <GlitchSvg size={size} />;
}

function GlitchSvg({ size }: { size: number }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      initial={{ scale: 0, rotate: -20 }}
      animate={{
        scale: [0, 1.1, 1, 1, 1],
        rotate: [-20, 4, -2, 2, 0],
        x: [0, -3, 3, -2, 0],
      }}
      transition={{ duration: 0.6 }}
    >
      {/* Body — wobbly blob */}
      <motion.path
        d="M 22 60 Q 18 42 30 32 Q 42 22 56 30 Q 72 24 82 40 Q 88 56 78 70 Q 66 82 50 80 Q 32 82 22 60 Z"
        fill="#7d5be4"
        stroke="#3e1f9b"
        strokeWidth="2"
        animate={{
          d: [
            "M 22 60 Q 18 42 30 32 Q 42 22 56 30 Q 72 24 82 40 Q 88 56 78 70 Q 66 82 50 80 Q 32 82 22 60 Z",
            "M 24 62 Q 16 44 28 30 Q 44 22 56 32 Q 70 22 84 42 Q 86 60 76 72 Q 64 80 48 80 Q 30 80 24 62 Z",
            "M 22 60 Q 18 42 30 32 Q 42 22 56 30 Q 72 24 82 40 Q 88 56 78 70 Q 66 82 50 80 Q 32 82 22 60 Z",
          ],
        }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />

      {/* Glitch slashes (mid body) */}
      <rect x="36" y="46" width="28" height="3" fill="rgba(255,255,255,0.6)" />
      <rect x="32" y="56" width="14" height="2" fill="rgba(255,255,255,0.5)" />
      <rect x="56" y="62" width="10" height="2" fill="rgba(255,255,255,0.5)" />

      {/* Eyes — confused */}
      <g>
        <line x1="34" y1="40" x2="44" y2="48" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <line x1="44" y1="40" x2="34" y2="48" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <line x1="56" y1="40" x2="66" y2="48" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <line x1="66" y1="40" x2="56" y2="48" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Wavy mouth */}
      <path d="M 42 64 Q 46 60 50 64 Q 54 68 58 64" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />

      {/* Sweat drop */}
      <motion.path
        d="M 78 26 L 76 22 L 80 22 Z"
        fill="#88cdee"
        stroke="#2a6e8e"
        strokeWidth="1"
        animate={{ y: [0, 6, 0], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </motion.svg>
  );
}
