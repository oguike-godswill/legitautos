"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Car } from "@/types";
import { formatPrice, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/Badge";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useDeleteCar } from "@/hooks/useCars";
import { useState } from "react";

interface AdminCarTableProps {
  cars: Car[];
}

export function AdminCarTable({ cars }: AdminCarTableProps) {
  const deleteCar = useDeleteCar();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this car? This action cannot be undone.")) {
      setDeletingId(id);
      deleteCar.mutate(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  const getStatusBadge = (status: Car["status"]) => {
    const variants: Record<string, "success" | "warning" | "danger"> = {
      available: "success",
      reserved: "warning",
      sold: "danger",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-dark-500 uppercase tracking-wider px-4 py-3">
                Car
              </th>
              <th className="text-left text-xs font-semibold text-dark-500 uppercase tracking-wider px-4 py-3">
                Price
              </th>
              <th className="text-left text-xs font-semibold text-dark-500 uppercase tracking-wider px-4 py-3">
                Status
              </th>
              <th className="text-left text-xs font-semibold text-dark-500 uppercase tracking-wider px-4 py-3">
                Views
              </th>
              <th className="text-left text-xs font-semibold text-dark-500 uppercase tracking-wider px-4 py-3">
                Date
              </th>
              <th className="text-right text-xs font-semibold text-dark-500 uppercase tracking-wider px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cars.map((car, index) => (
              <motion.tr
                key={car._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={car.images[0] || "/images/placeholder-car.jpg"}
                        alt={car.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-dark-900 truncate">{car.title}</p>
                      <p className="text-xs text-dark-500">{car.year} &middot; {car.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-dark-900">
                    {formatPrice(car.price)}
                  </span>
                </td>
                <td className="px-4 py-3">{getStatusBadge(car.status)}</td>
                <td className="px-4 py-3">
                  <span className="text-sm text-dark-600">{car.views}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-dark-500">{formatDate(car.createdAt)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/cars/${car.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-gray-100 text-dark-400 hover:text-dark-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/cars/${car._id}/edit`}
                      className="p-2 rounded-lg hover:bg-gray-100 text-dark-400 hover:text-primary-600 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(car._id)}
                      disabled={deletingId === car._id}
                      className="p-2 rounded-lg hover:bg-rose-50 text-dark-400 hover:text-rose-600 transition-colors disabled:opacity-50"
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

      {cars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-dark-500">No cars found. Add your first car to get started.</p>
        </div>
      )}
    </div>
  );
}
