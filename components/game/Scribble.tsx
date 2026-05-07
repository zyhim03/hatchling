"use client";

import { motion } from "framer-motion";

/** Hand-drawn underline scribble used to emphasize words. */
export function Scribble({
  className,
  color = "#ff8a3c",
  delay = 0.4,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 24"
      className={className}
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay, ease: "easeOut" }}
        d="M 4 14 C 30 4, 60 22, 100 12 S 170 4, 196 14"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Tiny doodle decorations that can sit at the edge of a card. */
export function Sparkle({
  className,
  size = 16,
  color = "#ffcd6b",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <motion.svg
      animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill={color}
    >
      <path d="M12 2 L13.5 9 L20 11 L13.5 13 L12 20 L10.5 13 L4 11 L10.5 9 Z" />
    </motion.svg>
  );
}

/** A wonky arrow doodle for "go this way". */
export function Arrow({
  className,
  color = "#ffcd6b",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 80 60"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 10 20 C 30 10, 40 30, 70 30" strokeDasharray="0" />
      <path d="M 60 22 L 70 30 L 60 40" />
    </svg>
  );
}
