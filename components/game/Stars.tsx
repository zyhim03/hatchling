"use client";

import { motion } from "framer-motion";
import { range } from "@/lib/utils";

export function Stars({
  count,
  total = 3,
  size = 18,
  animate = false,
}: {
  count: number;
  total?: number;
  size?: number;
  animate?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {range(total).map((i) => {
        const filled = i < count;
        return (
          <motion.svg
            key={i}
            initial={animate ? { scale: 0, rotate: -30 } : undefined}
            animate={animate ? { scale: 1, rotate: 0 } : undefined}
            transition={{
              delay: i * 0.18,
              type: "spring",
              stiffness: 280,
              damping: 14,
            }}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "#ffcd6b" : "none"}
            stroke={filled ? "#ffcd6b" : "rgba(255,255,255,0.18)"}
            strokeWidth="1.5"
            strokeLinejoin="round"
          >
            <polygon points="12,2 15,9 22,9.5 16.5,14.5 18.5,22 12,18 5.5,22 7.5,14.5 2,9.5 9,9" />
          </motion.svg>
        );
      })}
    </div>
  );
}
