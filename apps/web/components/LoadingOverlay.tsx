"use client";

import { motion } from "framer-motion";

interface LoadingOverlayProps {
  visible: boolean;
  progress: number;
}

export function LoadingOverlay({ visible, progress }: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-heritage-black/72 px-6 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-full max-w-sm rounded-[28px] border border-heritage-gold/20 bg-[#17120f]/90 p-7 text-center shadow-glow">
        <motion.div
          animate={{ rotate: 360 }}
          className="mx-auto mb-6 h-14 w-14 rounded-full border border-heritage-gold/20 border-t-heritage-gold"
          transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
        />
        <p className="font-display text-2xl text-heritage-paper">Restoring with restraint</p>
        <p className="mt-2 text-sm leading-6 text-heritage-paper/66">
          Preserving composition, borders, motifs, and original geometry.
        </p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            animate={{ width: `${Math.max(progress, 8)}%` }}
            className="h-full rounded-full bg-heritage-gold"
          />
        </div>
      </div>
    </motion.div>
  );
}
