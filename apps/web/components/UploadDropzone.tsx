"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { ACCEPTED_IMAGE_INPUT, validateImageFile } from "@/lib/file-validation";
import { cx } from "@/lib/ui";

interface UploadDropzoneProps {
  file: File | null;
  disabled: boolean;
  error: string | null;
  onFileChange: (file: File | null, error?: string | null) => void;
}

export function UploadDropzone({ file, disabled, error, onFileChange }: UploadDropzoneProps) {
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
      onFileChange(validationError ? null : nextFile, validationError);
    },
    [onFileChange],
  );

  return (
    <div>
      <motion.button
        className={cx(
          "group relative flex min-h-[280px] w-full overflow-hidden rounded-[24px] border border-dashed p-4 text-left transition",
          isDragging ? "border-heritage-gold bg-heritage-gold/12" : "border-heritage-gold/32 bg-heritage-black/24",
          disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:border-heritage-gold/70",
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
            alt="Selected ornament preview"
            className="absolute inset-0 h-full w-full object-contain p-5"
            src={previewUrl}
          />
        ) : (
          <div className="m-auto max-w-md text-center">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-heritage-gold/30 bg-heritage-gold/10 text-2xl text-heritage-gold">
              +
            </div>
            <p className="font-display text-3xl text-heritage-paper">Place an ornament image</p>
            <p className="mt-3 text-sm leading-6 text-heritage-paper/62">
              Drop a damaged historical pattern or choose a file. JPG, PNG, and WEBP are supported.
            </p>
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
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-heritage-paper/58">
          <span className="truncate">{file.name}</span>
          <button
            className="text-heritage-gold transition hover:text-[#dfbd4a]"
            disabled={disabled}
            onClick={() => onFileChange(null, null)}
            type="button"
          >
            Remove
          </button>
        </div>
      )}

      {error && <p className="mt-3 rounded-2xl border border-heritage-red/40 bg-heritage-red/16 px-4 py-3 text-sm text-[#f2c6bc]">{error}</p>}
    </div>
  );
}
