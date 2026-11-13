"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Car } from "@/app/types";
import { formatPrice, formatDate, formatConditionLabel } from "@/app/utils/format";
import { Pencil, Trash2, Eye, Star, FileEdit } from "lucide-react";
import { useDeleteCar, useUpdateCar } from "@/app/hooks/useCars";
import { useMemo, useState } from "react";

interface AdminCarTableProps {
  cars: Car[];
}

type CarTableFilter = "all" | "live" | "draft" | "sold";

export function AdminCarTable({ cars }: AdminCarTableProps) {
  const deleteCar = useDeleteCar();
  const updateCar = useUpdateCar();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [tab, setTab] = useState<CarTableFilter>("all");

  const counts = useMemo(
    () => ({
      all: cars.length,
      live: cars.filter((c) => c.status === "available" || c.status === "reserved").length,
      draft: cars.filter((c) => c.status === "draft").length,
      sold: cars.filter((c) => c.status === "sold").length,
    }),
    [cars]
  );

  const visibleCars = useMemo(() => {
    if (tab === "all") return cars;
    if (tab === "live") return cars.filter((c) => c.status === "available" || c.status === "reserved");
    return cars.filter((c) => c.status === tab);
  }, [cars, tab]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this car? This action cannot be undone.")) {
      setDeletingId(id);
      deleteCar.mutate(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  const handleStatusChange = (carId: string, newStatus: Car["status"]) => {
    updateCar.mutate({ id: carId, data: { status: newStatus } });
  };

  const handleToggleFeatured = (car: Car) => {
    updateCar.mutate({ id: car._id, data: { featured: !car.featured } });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { key: "all", label: "All", count: counts.all },
            { key: "live", label: "Live", count: counts.live },
            { key: "draft", label: "Drafts", count: counts.draft },
            { key: "sold", label: "Sold", count: counts.sold },
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

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-left text-xs font-bold text-dark-500 uppercase tracking-wider px-4 py-3.5">
                  Vehicle
                </th>
                <th className="text-left text-xs font-bold text-dark-500 uppercase tracking-wider px-4 py-3.5">
                  Origin
                </th>
                <th className="text-left text-xs font-bold text-dark-500 uppercase tracking-wider px-4 py-3.5">
                  Price
                </th>
                <th className="text-left text-xs font-bold text-dark-500 uppercase tracking-wider px-4 py-3.5">
                  Status
                </th>
                <th className="text-center text-xs font-bold text-dark-500 uppercase tracking-wider px-4 py-3.5">
                  Spotlight
                </th>
                <th className="text-left text-xs font-bold text-dark-500 uppercase tracking-wider px-4 py-3.5">
                  Views
                </th>
                <th className="text-left text-xs font-bold text-dark-500 uppercase tracking-wider px-4 py-3.5">
                  Listed
                </th>
                <th className="text-right text-xs font-bold text-dark-500 uppercase tracking-wider px-4 py-3.5">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleCars.map((car, index) => (
                <motion.tr
                  key={car._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={car.images[0] || "/images/placeholder-car.jpg"}
                          alt={car.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-dark-900 truncate max-w-[200px]">
                            {car.title || "Untitled Vehicle Draft"}
                          </p>
                          {car.status === "draft" && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase text-amber-800">
                              <FileEdit className="w-2.5 h-2.5" />
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-dark-500">
                          {car.year} &middot; {car.location || "Lagos, Nigeria"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold text-dark-700 bg-gray-100 px-2.5 py-1 rounded-md">
                      {formatConditionLabel(car.condition)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="t-mono text-sm font-bold text-dark-900">
                      {car.price > 0 ? formatPrice(car.price) : <span className="text-xs font-medium text-dark-400">Price TBD</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      value={car.status}
                      onChange={(e) => handleStatusChange(car._id, e.target.value as Car["status"])}
                      aria-label={`Change status for ${car.title}`}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                        car.status === "available"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : car.status === "reserved"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : car.status === "draft"
                          ? "bg-slate-100 text-slate-700 border-slate-300"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                      <option value="draft">Draft</option>
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(car)}
                      title={car.featured ? "Remove from Featured" : "Mark as Featured"}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        car.featured
                          ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                          : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${car.featured ? "fill-amber-400" : ""}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="t-mono text-xs font-semibold text-dark-600">{car.views}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-dark-500">{formatDate(car.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {car.status !== "draft" && (
                        <Link
                          href={`/cars/${car.slug || car._id}`}
                          target="_blank"
                          title="View Public Listing"
                          className="p-2 rounded-lg hover:bg-gray-100 text-dark-400 hover:text-dark-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/cars/${car._id}/edit`}
                        title={car.status === "draft" ? "Complete Draft" : "Edit Listing"}
                        className="p-2 rounded-lg hover:bg-gray-100 text-dark-400 hover:text-teal transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(car._id)}
                        disabled={deletingId === car._id}
                        title="Delete Listing"
                        className="p-2 rounded-lg hover:bg-danger-soft text-dark-400 hover:text-danger transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {visibleCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-500 text-sm">
              {tab === "draft"
                ? "No draft vehicles saved yet."
                : "No vehicles found. Add your first vehicle to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
