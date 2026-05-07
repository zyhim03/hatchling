"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Lazy floating embers in the background. Pure decorative. Client-only to avoid SSR hydration mismatch. */
export function Embers({
  density = 18,
  className,
}: {
  density?: number;
  className?: string;
}) {
  const [dots, setDots] = useState<
    | {
        i: number;
        x: number;
        delay: number;
        duration: number;
        size: number;
        drift: number;
        hue: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    setDots(
      Array.from({ length: density }).map((_, i) => ({
        i,
        x: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 8,
        size: 1 + Math.random() * 3,
        drift: (Math.random() - 0.5) * 30,
        hue: Math.random() > 0.7 ? "#ffcd6b" : "#ff8a3c",
      }))
    );
  }, [density]);

  if (!dots) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        className ?? ""
      }`}
    >
      {dots.map((d) => (
        <motion.div
          key={d.i}
          initial={{ y: "110%", x: `${d.x}%`, opacity: 0 }}
          animate={{
            y: "-10%",
            x: [`${d.x}%`, `${d.x + d.drift}%`, `${d.x}%`],
            opacity: [0, 0.8, 0.6, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: d.size,
            height: d.size,
            background: d.hue,
            borderRadius: "50%",
            boxShadow: `0 0 ${d.size * 3}px ${d.hue}`,
          }}
        />
      ))}
    </div>
  );
}
