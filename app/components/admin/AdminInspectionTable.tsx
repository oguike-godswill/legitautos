"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Pencil, Trash2, Film, ImageIcon, Play } from "lucide-react";
import { Inspection } from "@/app/types";
import { useDeleteInspection } from "@/app/hooks/useInspections";
import { getInspectionPoster } from "@/app/config/media";

interface AdminInspectionTableProps {
  inspections: Inspection[];
}

type InspectionFilter = "all" | "published" | "draft";

function formatDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AdminInspectionTable({
  inspections,
}: AdminInspectionTableProps) {
  const deleteInspection = useDeleteInspection();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [tab, setTab] = useState<InspectionFilter>("all");

  const counts = useMemo(
    () => ({
      all: inspections.length,
      published: inspections.filter((i) => i.published).length,
      draft: inspections.filter((i) => !i.published).length,
    }),
    [inspections]
  );

  const visibleInspections = useMemo(() => {
    if (tab === "all") return inspections;
    if (tab === "published") return inspections.filter((i) => i.published);
    return inspections.filter((i) => !i.published);
  }, [inspections, tab]);

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Delete this inspection media? The file is removed from storage too. This cannot be undone."
      )
    ) {
      setDeletingId(id);
      deleteInspection.mutate(id, { onSettled: () => setDeletingId(null) });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { key: "all", label: "All", count: counts.all },
            { key: "published", label: "Published", count: counts.published },
            { key: "draft", label: "Drafts", count: counts.draft },
          ] as const
        ).map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                active
                  ? "border-dark-900 bg-dark-900 text-white"
                  : "border-gray-200 bg-white text-dark-600 hover:bg-gray-50"
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[0.65rem] ${
                  active
                    ? "bg-white/20 text-white"
                    : item.key === "draft" && item.count > 0
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-dark-500"
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-500">
                Media
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-500">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-500">
                Car
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-dark-500">
                Order
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-dark-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visibleInspections.map((item, index) => {
              const poster = getInspectionPoster(item);
              const duration = formatDuration(item.duration);

              return (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {poster ? (
                          <Image
                            src={poster}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center">
                            <Play className="h-4 w-4 text-dark-300" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-dark-900">
                          {item.title}
                        </p>
                        {duration && (
                          <p className="text-xs text-dark-500">{duration}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-dark-600">
                      {item.type === "video" ? (
                        <>
                          <Film className="h-3.5 w-3.5" /> Video
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-3.5 w-3.5" /> Photo
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-dark-600">
                      {item.carTitle || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-[0.65rem] font-semibold ${
                        item.published
                          ? "bg-success-soft text-success"
                          : "bg-gray-100 text-dark-500"
                      }`}
                    >
                      {item.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-dark-600">{item.order}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/inspections/${item._id}/edit`}
                        className="rounded-lg p-2 text-dark-400 transition-colors hover:bg-gray-100 hover:text-primary-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                        className="rounded-lg p-2 text-dark-400 transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {visibleInspections.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-dark-500">
            {tab === "draft"
              ? "No draft inspection clips saved yet."
              : "No inspection media yet. Upload your first clip or photo to build the homepage inspection section."}
          </p>
        </div>
      )}
    </div>
    </div>
  );
}
