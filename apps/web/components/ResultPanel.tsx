"use client";

import { useState } from "react";

import { apiAssetUrl } from "@/lib/config";
import type { Dictionary } from "@/i18n/types";
import type { RestorationResponse } from "@/types/restoration";

interface ResultPanelProps {
  result: RestorationResponse;
  copy: Dictionary;
}

export function ResultPanel({ result, copy }: ResultPanelProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const resultCopy = copy.result;
  const isFallback = result.fallback_used;
  const statusBadge = isFallback ? resultCopy.statusFallbackBadge : resultCopy.statusSuccessBadge;
  const statusMessage = isFallback ? resultCopy.fallbackMessage : resultCopy.readyMessage;
  const modeLabel = copy.controls.modes[result.mode]?.label ?? result.mode;

  async function handleDownload() {
    if (isDownloading) {
      return;
    }

    setDownloadError(null);
    setIsDownloading(true);

    try {
      const downloadUrl = apiAssetUrl(result.output_url);
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = buildDownloadFileName(result.id, result.output_url);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
    } catch {
      setDownloadError(resultCopy.downloadError);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <aside className="glass-panel rounded-lg p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">{resultCopy.recordEyebrow}</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--color-text)]">{resultCopy.recordTitle}</h2>
          <div
            className={
              isFallback
                ? "mt-4 inline-flex rounded-full bg-[color-mix(in_srgb,var(--color-gold)_18%,transparent)] px-3 py-1 text-xs font-semibold text-[var(--color-gold)]"
                : "mt-4 inline-flex rounded-full bg-[color-mix(in_srgb,#2f9d68_16%,transparent)] px-3 py-1 text-xs font-semibold text-[#2f9d68]"
            }
          >
            {statusBadge}
          </div>
        </div>
        <button
          className="inline-flex min-h-11 items-center rounded-full bg-[var(--color-text)] px-5 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
          disabled={isDownloading}
          onClick={handleDownload}
          type="button"
        >
          {isDownloading ? resultCopy.downloading : resultCopy.download}
        </button>
      </div>

      {downloadError && (
        <p
          className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--color-red)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-red)_10%,transparent)] p-3 text-sm leading-6 text-[var(--color-text)]"
          role="alert"
        >
          {downloadError}
        </p>
      )}

      <div className="mt-7 space-y-4">
        <p className="text-base leading-7 text-[var(--color-text)]">{statusMessage}</p>
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          {resultCopy.mode}: <span className="font-medium text-[var(--color-text)]">{modeLabel}</span>
        </p>
      </div>

    </aside>
  );
}

function buildDownloadFileName(id: string, outputUrl: string): string {
  const fallbackExtension = ".jpg";
  const path = getDownloadPath(outputUrl);
  const extensionMatch = path.match(/\.[a-z0-9]+$/i);
  const extension = extensionMatch?.[0] ?? fallbackExtension;
  const safeId = id.replace(/[^a-z0-9-]/gi, "");

  return `ornava-restored-${safeId || "image"}${extension}`;
}

function getDownloadPath(outputUrl: string): string {
  try {
    return new URL(outputUrl, "http://ornava.local").pathname;
  } catch {
    return outputUrl.split(/[?#]/)[0] ?? "";
  }
}
