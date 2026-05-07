"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

/**
 * Beep — bee companion. Painted portrait at /art/char-beep.png with SVG fallback.
 */
export function Beep({ size = 36 }: { size?: number }) {
  const [errored, setErrored] = useState(false);

  if (!errored) {
    return (
      <motion.div
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: size, height: size, position: "relative" }}
      >
        <Image
          src="/art/char-beep.png"
          alt="Beep, a friendly bee"
          fill
          sizes={`${size}px`}
          onError={() => setErrored(true)}
          style={{ objectFit: "contain" }}
        />
      </motion.div>
    );
  }

  return <BeepSvg size={size} />;
}

function BeepSvg({ size }: { size: number }) {
  return (
    <motion.svg
      viewBox="0 0 100 80"
      width={size}
      height={size * 0.8}
      animate={{ rotate: [-4, 4, -4] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Wings */}
      <motion.ellipse
        cx="32"
        cy="20"
        rx="14"
        ry="10"
        fill="rgba(140, 200, 230, 0.55)"
        stroke="rgba(42, 31, 74, 0.4)"
        strokeWidth="1"
        animate={{ scaleY: [1, 0.4, 1] }}
        transition={{
          duration: 0.18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "32px 30px" }}
      />
      <motion.ellipse
        cx="68"
        cy="20"
        rx="14"
        ry="10"
        fill="rgba(140, 200, 230, 0.55)"
        stroke="rgba(42, 31, 74, 0.4)"
        strokeWidth="1"
        animate={{ scaleY: [1, 0.4, 1] }}
        transition={{
          duration: 0.18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.04,
        }}
        style={{ transformOrigin: "68px 30px" }}
      />

      {/* Body */}
      <ellipse cx="50" cy="48" rx="24" ry="18" fill="#f5b324" stroke="#7a4d28" strokeWidth="1.6" />
      {/* Stripes */}
      <path d="M 36 36 L 42 60" stroke="#2a1f4a" strokeWidth="3" />
      <path d="M 50 32 L 56 64" stroke="#2a1f4a" strokeWidth="3.5" />
      <path d="M 64 36 L 60 60" stroke="#2a1f4a" strokeWidth="3" />

      {/* Stinger */}
      <path d="M 74 48 L 82 50 L 74 52 Z" fill="#2a1f4a" />

      {/* Face */}
      <circle cx="32" cy="44" r="5" fill="#fff8e8" stroke="#2a1f4a" strokeWidth="1" />
      <circle cx="32" cy="44" r="2.5" fill="#2a1f4a" />
      <circle cx="33" cy="43" r="0.8" fill="#fff" />

      {/* Smile */}
      <path d="M 27 52 Q 32 56 36 52" fill="none" stroke="#2a1f4a" strokeWidth="1.6" strokeLinecap="round" />

      {/* Antennae */}
      <path d="M 28 36 L 24 26" stroke="#2a1f4a" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="24" cy="26" r="2" fill="#f5b324" stroke="#2a1f4a" strokeWidth="1" />
    </motion.svg>
  );
}
