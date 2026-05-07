"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

/**
 * Sprout — tiny seedling buddy. Painted portrait at /art/char-sprout.png with SVG fallback.
 */
export function Sprout({ size = 32, hue = "#7ec55a" }: { size?: number; hue?: string }) {
  const [errored, setErrored] = useState(false);

  if (!errored) {
    return (
      <motion.div
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: size, height: size * 1.3, position: "relative" }}
      >
        <Image
          src="/art/char-sprout.png"
          alt="Sprout, a tiny seedling"
          fill
          sizes={`${size}px`}
          onError={() => setErrored(true)}
          style={{ objectFit: "contain" }}
        />
      </motion.div>
    );
  }

  return <SproutSvg size={size} hue={hue} />;
}

function SproutSvg({ size, hue }: { size: number; hue: string }) {
  return (
    <motion.svg
      viewBox="0 0 60 80"
      width={size}
      height={size * 1.3}
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Pot/seed */}
      <path
        d="M 18 60 L 14 76 L 46 76 L 42 60 Z"
        fill="#a8744a"
        stroke="#5a3819"
        strokeWidth="1.4"
      />
      <line x1="14" y1="64" x2="46" y2="64" stroke="#5a3819" strokeWidth="1" />

      {/* Stem */}
      <path
        d="M 30 60 L 30 38"
        stroke="#3e7a32"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Two leaves */}
      <motion.ellipse
        cx="22"
        cy="44"
        rx="9"
        ry="5"
        fill={hue}
        stroke="#3e7a32"
        strokeWidth="1.2"
        animate={{ rotate: [-8, -2, -8] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "30px 44px" }}
      />
      <motion.ellipse
        cx="38"
        cy="40"
        rx="9"
        ry="5"
        fill={hue}
        stroke="#3e7a32"
        strokeWidth="1.2"
        animate={{ rotate: [8, 2, 8] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "30px 40px" }}
      />

      {/* Tiny face on the bud */}
      <circle cx="28" cy="32" r="1.4" fill="#2a1f4a" />
      <circle cx="34" cy="32" r="1.4" fill="#2a1f4a" />
      <path
        d="M 28 36 Q 31 38 34 36"
        fill="none"
        stroke="#2a1f4a"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <ellipse cx="26" cy="34" rx="1.2" ry="0.8" fill="rgba(230, 79, 143, 0.5)" />
      <ellipse cx="36" cy="34" rx="1.2" ry="0.8" fill="rgba(230, 79, 143, 0.5)" />
    </motion.svg>
  );
}
