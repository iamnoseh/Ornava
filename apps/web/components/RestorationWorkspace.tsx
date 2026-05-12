"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { BeforeAfterViewer } from "@/components/BeforeAfterViewer";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { RestorationControls } from "@/components/RestorationControls";
import { ResultPanel } from "@/components/ResultPanel";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import type { Dictionary } from "@/i18n/types";
import { getRestorationErrorMessage, restoreImage } from "@/lib/api";
import type { RestorationMode, RestorationResponse } from "@/types/restoration";

interface RestorationWorkspaceProps {
  copy: Dictionary;
}

export function RestorationWorkspace({ copy }: RestorationWorkspaceProps) {
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
      setError(copy.workspace.noFileError);
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

      if (response.provider_error_code === "gemini_quota_exceeded") {
        setError(copy.errors.quotaExceeded);
      } else if (response.fallback_used && response.provider_error_code) {
        setError(copy.errors.fallback);
      }
    } catch (nextError) {
      setError(getRestorationErrorMessage(nextError, copy.errors));
    } finally {
      setIsRestoring(false);
    }
  }

  return (
    <section className="section-shell py-20" id="restoration">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="self-start lg:sticky lg:top-28">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">{copy.workspace.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">{copy.workspace.title}</h2>
          <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">{copy.workspace.description}</p>
        </div>

        <Panel className="p-4 sm:p-5">
          <UploadDropzone
            copy={copy.upload}
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
              copy={copy.controls}
              disabled={isRestoring}
              mode={mode}
              onModeChange={setMode}
              onUseAiChange={setUseAi}
              useAi={useAi}
            />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button className="w-full sm:w-auto" disabled={!canRestore} onClick={handleRestore}>
              {copy.workspace.restoreButton}
            </Button>
            <p className="text-sm leading-6 text-[var(--color-muted)]">{copy.workspace.helper}</p>
          </div>
        </Panel>
      </div>

      {result && (
        <motion.div animate={{ opacity: 1, y: 0 }} className="mt-10 grid gap-5 xl:grid-cols-[1fr_360px]" initial={{ opacity: 0, y: 18 }}>
          <BeforeAfterViewer copy={copy.result} result={result} />
          <ResultPanel copy={copy} result={result} />
        </motion.div>
      )}

      <LoadingOverlay copy={copy.loading} progress={progress} visible={isRestoring} />
    </section>
  );
}
