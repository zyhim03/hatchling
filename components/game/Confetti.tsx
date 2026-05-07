"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#ff8a3c", "#ffcd6b", "#a78bfa", "#7be3a4", "#6cd9f0", "#ff7aa6"];
const SHAPES = ["square", "circle", "triangle"] as const;

function shape(i: number) {
  return SHAPES[i % SHAPES.length];
}

type Piece = {
  i: number;
  x: number;
  rotate: number;
  delay: number;
  duration: number;
  color: string;
  sh: (typeof SHAPES)[number];
  size: number;
};

export function Confetti({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<Piece[] | null>(null);

  useEffect(() => {
    if (!show) {
      setPieces(null);
      return;
    }
    setPieces(
      Array.from({ length: 60 }).map((_, i) => ({
        i,
        x: Math.random() * 100,
        rotate: Math.random() * 720 - 360,
        delay: Math.random() * 0.2,
        duration: 1.6 + Math.random() * 1.4,
        color: COLORS[i % COLORS.length],
        sh: shape(i),
        size: 6 + Math.random() * 8,
      }))
    );
  }, [show]);

  return (
    <AnimatePresence>
      {show && pieces && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {pieces.map(({ i, x, rotate, delay, duration, color, sh, size }) => {
            return (
              <motion.div
                key={i}
                initial={{
                  x: `${x}vw`,
                  y: "40vh",
                  opacity: 1,
                  rotate: 0,
                  scale: 0,
                }}
                animate={{
                  y: "110vh",
                  rotate,
                  scale: 1,
                  opacity: [0, 1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration, delay, ease: "easeIn" }}
                style={{
                  position: "absolute",
                  width: size,
                  height: size,
                  background:
                    sh === "triangle" ? "transparent" : color,
                  clipPath:
                    sh === "triangle"
                      ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                      : undefined,
                  borderRadius: sh === "circle" ? "50%" : 2,
                  borderBottom:
                    sh === "triangle"
                      ? `${size}px solid ${color}`
                      : undefined,
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
