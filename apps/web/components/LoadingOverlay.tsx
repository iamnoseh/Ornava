"use client";

import { motion } from "framer-motion";

import type { Dictionary } from "@/i18n/types";

interface LoadingOverlayProps {
  visible: boolean;
  progress: number;
  copy: Dictionary["loading"];
}

export function LoadingOverlay({ visible, progress, copy }: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-6 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="glass-panel w-full max-w-sm rounded-lg p-7 text-center shadow-glow">
        <motion.div
          animate={{ rotate: 360 }}
          className="mx-auto mb-6 h-14 w-14 rounded-full border border-[color-mix(in_srgb,var(--color-gold)_24%,transparent)] border-t-[var(--color-gold)]"
          transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
        />
        <p className="font-display text-2xl text-[var(--color-text)]">{copy.title}</p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{copy.description}</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            animate={{ width: `${Math.max(progress, 8)}%` }}
            className="h-full rounded-full bg-[var(--color-gold)]"
          />
        </div>
      </div>
    </motion.div>
  );
}
