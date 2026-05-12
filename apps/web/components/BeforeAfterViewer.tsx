"use client";

import { apiAssetUrl } from "@/lib/config";
import type { RestorationResponse } from "@/types/restoration";

interface BeforeAfterViewerProps {
  result: RestorationResponse;
}

export function BeforeAfterViewer({ result }: BeforeAfterViewerProps) {
  const inputUrl = apiAssetUrl(result.input_url);
  const outputUrl = apiAssetUrl(result.output_url);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ImagePane label="Before" src={inputUrl} />
      <ImagePane label="Restored" src={outputUrl} />
    </div>
  );
}

function ImagePane({ label, src }: { label: string; src: string }) {
  return (
    <figure className="overflow-hidden rounded-[24px] border border-white/10 bg-heritage-black/34">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <figcaption className="text-sm font-semibold text-heritage-paper">{label}</figcaption>
      </div>
      <div className="grid aspect-[4/3] place-items-center">
        <img alt={`${label} ornament`} className="h-full w-full object-contain p-3" src={src} />
      </div>
    </figure>
  );
}
