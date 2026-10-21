"use client";

import { useCallback, useRef, useState } from "react";
import { Loader2, Film, ImageIcon } from "lucide-react";
import { uploadInspectionMedia } from "@/app/utils/api";
import {
  INSPECTION_VIDEO_BYTES_HINT,
  INSPECTION_IMAGE_BYTES_HINT,
  INSPECTION_ACCEPT,
} from "@/app/config/media";
import toast from "react-hot-toast";

export interface UploadedMedia {
  type: "video" | "image";
  url: string;
  publicId: string;
  thumbnailUrl?: string;
  duration?: number;
}

interface InspectionUploaderProps {
  /** Called for every file that uploads successfully. */
  onUploaded: (media: UploadedMedia) => void;
  disabled?: boolean;
}

/**
 * Uploads inspection media one file at a time so the admin gets per-file
 * progress and a usable error, rather than one opaque batch failure. Videos are
 * large, so a single bad file must not discard the ones that succeeded.
 */
export function InspectionUploader({
  onUploaded,
  disabled = false,
}: InspectionUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [currentName, setCurrentName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      setIsUploading(true);
      setProgress({ done: 0, total: files.length });

      let succeeded = 0;

      for (let i = 0; i < files.length; i++) {
        setCurrentName(files[i].name);
        try {
          const result = await uploadInspectionMedia(files[i]);
          onUploaded(result);
          succeeded += 1;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Upload failed";
          toast.error(`${files[i].name}: ${message}`);
        }
        setProgress({ done: i + 1, total: files.length });
      }

      setIsUploading(false);
      setCurrentName(null);
      setProgress({ done: 0, total: 0 });

      if (succeeded > 0) {
        toast.success(
          `${succeeded} ${succeeded === 1 ? "file" : "files"} uploaded`
        );
      }

      // Reset so re-selecting the same file still fires a change event.
      if (inputRef.current) inputRef.current.value = "";
    },
    [onUploaded]
  );

  const pct =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="space-y-3">
      <label
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all ${
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
            : "border-gray-300 cursor-pointer hover:border-primary-400 hover:bg-primary-50/50"
        }`}
      >
        <div className="flex flex-col items-center justify-center px-4 py-5 text-center">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <p className="text-sm text-dark-500">{pct}%</p>
              {currentName && (
                <p className="max-w-xs truncate text-xs text-dark-400">
                  {currentName}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-3">
                <Film className="w-7 h-7 text-dark-400" />
                <ImageIcon className="w-7 h-7 text-dark-400" />
              </div>
              <p className="text-sm text-dark-600">
                <span className="font-semibold text-primary-600">
                  Click to upload
                </span>{" "}
                inspection media
              </p>
              <p className="mt-1 text-xs text-dark-400">
                {INSPECTION_VIDEO_BYTES_HINT} &middot; {INSPECTION_IMAGE_BYTES_HINT}
              </p>
              <p className="mt-1 text-xs text-dark-400">
                Short walkaround clips work best — aim for under a minute.
              </p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={INSPECTION_ACCEPT}
          multiple
          onChange={handleFileChange}
          disabled={disabled || isUploading}
        />
      </label>
    </div>
  );
}
