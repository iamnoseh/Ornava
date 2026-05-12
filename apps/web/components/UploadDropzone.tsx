"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import type { Dictionary } from "@/i18n/types";
import { ACCEPTED_IMAGE_INPUT, validateImageFile } from "@/lib/file-validation";
import { cx } from "@/lib/ui";

interface UploadDropzoneProps {
  file: File | null;
  disabled: boolean;
  error: string | null;
  copy: Dictionary["upload"];
  onFileChange: (file: File | null, error?: string | null) => void;
}

export function UploadDropzone({ file, disabled, error, copy, onFileChange }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  const acceptFile = useCallback(
    (nextFile: File | undefined) => {
      if (!nextFile) {
        return;
      }

      const validationError = validateImageFile(nextFile);
      onFileChange(validationError ? null : nextFile, validationError ? copy.invalidFile : null);
    },
    [copy.invalidFile, onFileChange],
  );

  return (
    <div>
      <motion.button
        className={cx(
          "group relative flex min-h-[300px] w-full overflow-hidden rounded-lg border border-dashed p-4 text-left transition",
          isDragging
            ? "border-[var(--color-gold)] bg-[color-mix(in_srgb,var(--color-gold)_14%,transparent)]"
            : "border-[color-mix(in_srgb,var(--color-gold)_38%,transparent)] bg-[var(--color-soft)]",
          disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:border-[var(--color-gold)]",
        )}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          acceptFile(event.dataTransfer.files[0]);
        }}
        type="button"
        whileHover={disabled ? undefined : { y: -2 }}
      >
        {previewUrl ? (
          <img
            alt={copy.previewAlt}
            className="absolute inset-0 h-full w-full object-contain p-5"
            src={previewUrl}
          />
        ) : (
          <div className="m-auto max-w-md text-center">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-[color-mix(in_srgb,var(--color-gold)_34%,transparent)] bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)] text-2xl text-[var(--color-gold)]">
              +
            </div>
            <p className="font-display text-3xl text-[var(--color-text)]">{copy.title}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{copy.description}</p>
          </div>
        )}

        <input
          accept={ACCEPTED_IMAGE_INPUT}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => acceptFile(event.target.files?.[0])}
          ref={inputRef}
          type="file"
        />
      </motion.button>

      {file && (
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
          <span className="truncate">{file.name}</span>
          <button
            className="text-[var(--color-gold)] transition hover:brightness-110"
            disabled={disabled}
            onClick={() => onFileChange(null, null)}
            type="button"
          >
            {copy.remove}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--color-red)_42%,transparent)] bg-[color-mix(in_srgb,var(--color-red)_14%,transparent)] px-4 py-3 text-sm text-[var(--color-text)]">
          {error}
        </p>
      )}
    </div>
  );
}
