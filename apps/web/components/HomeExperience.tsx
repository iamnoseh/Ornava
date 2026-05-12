"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { BeforeAfterViewer } from "@/components/BeforeAfterViewer";
import { HeroSection } from "@/components/HeroSection";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { RestorationControls } from "@/components/RestorationControls";
import { RestorationResultCard } from "@/components/RestorationResultCard";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { getRestorationErrorMessage, restoreImage } from "@/lib/api";
import type { RestorationMode, RestorationResponse } from "@/types/restoration";

export function HomeExperience() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<RestorationMode>("conservative");
  const [useAi, setUseAi] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RestorationResponse | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [progress, setProgress] = useState(0);

  const canRestore = useMemo(() => Boolean(file) && !isRestoring, [file, isRestoring]);

  async function handleRestore() {
    if (!file) {
      setError("Choose an ornament image before restoring.");
      return;
    }

    setError(null);
    setResult(null);
    setProgress(6);
    setIsRestoring(true);

    try {
      const response = await restoreImage({
        file,
        mode,
        useAi,
        onUploadProgress: setProgress,
      });
      setProgress(100);
      setResult(response);
    } catch (nextError) {
      setError(getRestorationErrorMessage(nextError));
    } finally {
      setIsRestoring(false);
    }
  }

  return (
    <main className="heritage-scrollbar relative min-h-screen overflow-hidden">
      <div className="ornament-grid pointer-events-none absolute inset-0 opacity-60" />
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-[-20rem] top-[-12rem] w-[70rem] max-w-none opacity-30 blur-[1px]"
        src="/ornament-field.svg"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-heritage-gold/10 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <nav className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-heritage-gold/[0.35] bg-heritage-gold/[0.12] font-display text-xl text-heritage-gold">
              O
            </div>
            <div>
              <p className="font-display text-2xl text-heritage-paper">Ornava</p>
              <p className="text-xs text-heritage-paper/[0.46]">Heritage restoration</p>
            </div>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-heritage-paper/[0.62] sm:block">
            Preserve first. Enhance second.
          </div>
        </nav>

        <section className="grid flex-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <HeroSection />

          <Panel className="p-4 sm:p-5">
            <UploadDropzone
              disabled={isRestoring}
              error={error}
              file={file}
              onFileChange={(nextFile, nextError = null) => {
                setFile(nextFile);
                setError(nextError);
                setResult(null);
              }}
            />
            <div className="mt-5">
              <RestorationControls
                disabled={isRestoring}
                mode={mode}
                onModeChange={setMode}
                onUseAiChange={setUseAi}
                useAi={useAi}
              />
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button className="w-full sm:w-auto" disabled={!canRestore} onClick={handleRestore}>
                Restore Image
              </Button>
              <p className="text-sm leading-6 text-heritage-paper/[0.52]">
                The backend returns deterministic fallback metadata when AI is unavailable.
              </p>
            </div>
          </Panel>
        </section>

        {result && (
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 grid gap-5 xl:grid-cols-[1fr_360px]"
            initial={{ opacity: 0, y: 18 }}
          >
            <BeforeAfterViewer result={result} />
            <RestorationResultCard result={result} />
          </motion.section>
        )}
      </div>

      <AnimatePresence>
        <LoadingOverlay progress={progress} visible={isRestoring} />
      </AnimatePresence>
    </main>
  );
}
