"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Trash2, Play, AlertTriangle } from "lucide-react";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { Select } from "@/app/components/ui/Select";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { Button } from "@/app/components/ui/Button";
import { InspectionUploader, UploadedMedia } from "./InspectionUploader";
import {
  useCreateInspection,
  useUpdateInspection,
} from "@/app/hooks/useInspections";
import { Inspection } from "@/app/types";
import { INSPECTION_VIDEO_RECOMMENDED_NOTE } from "@/app/config/media";

interface CarOption {
  _id: string;
  title: string;
}

interface InspectionFormProps {
  /** Existing record when editing; omitted when creating. */
  inspection?: Inspection;
  cars: CarOption[];
  mode?: "create" | "edit";
}

interface Draft {
  title: string;
  description: string;
  type: "video" | "image";
  url: string;
  publicId: string;
  thumbnailUrl: string;
  duration?: number;
  car: string;
  order: number;
  published: boolean;
}

const emptyDraft: Draft = {
  title: "",
  description: "",
  type: "video",
  url: "",
  publicId: "",
  thumbnailUrl: "",
  car: "",
  order: 0,
  published: true,
};

/**
 * Create/edit form for one piece of inspection media.
 *
 * An upload is required before saving: a record without a file would render as
 * a broken tile on the homepage, which is worse than having no inspection
 * section at all.
 */
export function InspectionForm({
  inspection,
  cars,
  mode = "create",
}: InspectionFormProps) {
  const router = useRouter();
  const createInspection = useCreateInspection();
  const updateInspection = useUpdateInspection();

  const [draft, setDraft] = useState<Draft>(
    inspection
      ? {
          title: inspection.title,
          description: inspection.description || "",
          type: inspection.type,
          url: inspection.url,
          publicId: inspection.publicId || "",
          thumbnailUrl: inspection.thumbnailUrl || "",
          duration: inspection.duration,
          car: inspection.car || "",
          order: inspection.order,
          published: inspection.published,
        }
      : emptyDraft
  );

  const [error, setError] = useState<string | null>(null);
  const isSaving = createInspection.isPending || updateInspection.isPending;

  // A car-linked entry with no video still saves, but the admin is told why
  // that weakens the page it will appear on.
  const photoOnlyForCar =
    Boolean(draft.car) && !draft.thumbnailUrl && draft.type === "image";

  const handleUploaded = (media: UploadedMedia) => {
    setDraft((prev) => ({
      ...prev,
      type: media.type,
      url: media.url,
      publicId: media.publicId,
      thumbnailUrl: media.thumbnailUrl || "",
      duration: media.duration,
      // Seed a title from the file so a one-file upload can be saved quickly.
      title: prev.title,
    }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!draft.url) {
      setError("Upload a video or photo before saving.");
      return;
    }
    if (draft.title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }

    const payload = {
      title: draft.title.trim(),
      description: draft.description.trim() || undefined,
      type: draft.type,
      url: draft.url,
      publicId: draft.publicId || undefined,
      thumbnailUrl: draft.thumbnailUrl || undefined,
      duration: draft.duration,
      car: draft.car || undefined,
      order: draft.order,
      published: draft.published,
    };

    if (mode === "edit" && inspection) {
      updateInspection.mutate(
        { id: inspection._id, data: payload },
        { onSuccess: () => router.push("/admin/inspections") }
      );
    } else {
      createInspection.mutate(payload, {
        onSuccess: () => router.push("/admin/inspections"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between text-black">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/inspections"
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-dark-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-dark-900">
              {mode === "edit" ? "Edit Inspection Media" : "Add Inspection Media"}
            </h1>
            <p className="text-sm text-dark-500">
              {mode === "edit"
                ? "Update the clip, photo or its details"
                : "Upload a walkaround video or condition photo"}
            </p>
          </div>
        </div>
        <Button
          type="submit"
          isLoading={isSaving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {mode === "edit" ? "Update" : "Save"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger-soft p-3 text-sm text-danger">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Media */}
          <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-dark-900">Media</h2>

            {draft.url && (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                {draft.type === "video" ? (
                  <video
                    src={draft.url}
                    poster={draft.thumbnailUrl || undefined}
                    controls
                    playsInline
                    className="w-full bg-black"
                  />
                ) : (
                  <div className="relative aspect-[3/2] bg-gray-100">
                    <Image
                      src={draft.url}
                      alt="Uploaded inspection photo"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 border-t border-gray-100 p-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-dark-500">
                    {draft.type === "video" ? (
                      <>
                        <Play className="h-3 w-3" /> Video
                      </>
                    ) : (
                      "Photo"
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((prev) => ({
                        ...prev,
                        url: "",
                        publicId: "",
                        thumbnailUrl: "",
                        duration: undefined,
                      }))
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger-soft"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove file
                  </button>
                </div>
              </div>
            )}

            <InspectionUploader onUploaded={handleUploaded} disabled={isSaving} />

            {draft.url && (
              <p className="text-xs text-dark-400">
                Uploading a new file replaces the current one after you save.
              </p>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-dark-900">Details</h2>
            <Input
              label="Title"
              placeholder="e.g., 2019 Toyota Camry — full walkaround"
              value={draft.title}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, title: e.target.value }))
              }
              helperText="Shown under the thumbnail on the homepage and car page."
            />
            <Textarea
              label="Description (optional)"
              placeholder="What the clip shows — exterior, interior, engine start, known faults..."
              rows={4}
              value={draft.description}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-dark-900">Car</h2>
            <Select
              label="Attach to a car"
              value={draft.car}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, car: e.target.value }))
              }
              options={[
                { value: "", label: "Not attached (general lot media)" },
                ...cars.map((car) => ({ value: car._id, label: car.title })),
              ]}
              helperText="Attached media appears on that car's page."
            />

            {photoOnlyForCar && (
              <p className="flex gap-2 rounded-lg bg-warning-soft p-3 text-xs leading-relaxed text-warning">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {INSPECTION_VIDEO_RECOMMENDED_NOTE}
              </p>
            )}
          </div>

          <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-dark-900">Publishing</h2>
            <Input
              label="Display order"
              type="number"
              value={draft.order}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  order: Number(e.target.value) || 0,
                }))
              }
              helperText="Higher numbers appear first."
            />
            <Checkbox
              label="Published"
              checked={draft.published}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, published: e.target.checked }))
              }
            />
            <p className="text-xs text-dark-400">
              Unpublished media is hidden from the website.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
