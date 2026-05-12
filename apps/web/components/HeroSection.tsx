"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <header className="relative">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-3 rounded-full border border-heritage-gold/24 bg-white/[0.06] px-4 py-2 text-sm text-heritage-paper/76 backdrop-blur-xl"
        initial={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.6 }}
      >
        <span className="h-2 w-2 rounded-full bg-heritage-gold" />
        Restoration for cultural originals
      </motion.div>

      <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 14 }} transition={{ delay: 0.08, duration: 0.7 }}>
        <p className="mt-8 text-sm uppercase tracking-[0.34em] text-heritage-gold/80">Ornava</p>
        <h1 className="mt-3 max-w-4xl font-display text-5xl font-semibold leading-[0.96] text-heritage-paper sm:text-7xl">
          Restoring Cultural Heritage with AI
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-heritage-paper/68 sm:text-lg">
          Ornava enhances historical and national ornament images with a preservation-first workflow. It clarifies the
          original image without inventing motifs, changing borders, or redesigning cultural details.
        </p>
      </motion.div>

      <div className="mt-8 grid max-w-2xl gap-3 text-sm text-heritage-paper/66 sm:grid-cols-3">
        <Badge label="No hallucinated motifs" />
        <Badge label="Geometry preserved" />
        <Badge label="Deterministic by default" />
      </div>
    </header>
  );
}

function Badge({ label }: { label: string }) {
  return <div className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-3 text-center">{label}</div>;
}
