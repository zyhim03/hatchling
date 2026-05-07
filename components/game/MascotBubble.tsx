"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Stage } from "@/lib/chapters";
import { Mascot } from "./Mascot";

export function MascotBubble({
  stage,
  message,
  show,
}: {
  stage: Stage;
  message: string;
  show: boolean;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, x: 30 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 30, x: 30 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className="fixed bottom-6 right-6 z-40 flex items-end gap-3 max-w-xs"
        >
          <div className="relative rounded-2xl rounded-br-sm bg-bg-elev border border-ember/40 px-4 py-3 text-sm text-ink shadow-glow">
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 bg-bg-elev border-r border-b border-ember/40" />
            {message}
          </div>
          <motion.div
            animate={{ rotate: [0, -6, 6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex-shrink-0"
          >
            <Mascot stage={stage} size={64} glow={false} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
