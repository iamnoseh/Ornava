"use client";

import { apiAssetUrl } from "@/lib/config";
import type { Dictionary } from "@/i18n/types";
import type { RestorationResponse } from "@/types/restoration";

interface BeforeAfterViewerProps {
  result: RestorationResponse;
  copy: Dictionary["result"];
}

export function BeforeAfterViewer({ result, copy }: BeforeAfterViewerProps) {
  const inputUrl = apiAssetUrl(result.input_url);
  const outputUrl = apiAssetUrl(result.output_url);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ImagePane label={copy.before} src={inputUrl} />
      <ImagePane label={copy.restored} src={outputUrl} />
    </div>
  );
}

function ImagePane({ label, src }: { label: string; src: string }) {
  return (
    <figure className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-soft)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <figcaption className="text-sm font-semibold text-[var(--color-text)]">{label}</figcaption>
      </div>
      <div className="grid aspect-[4/3] place-items-center">
        <img alt={`${label} ornament`} className="h-full w-full object-contain p-3" src={src} />
      </div>
    </figure>
  );
}
