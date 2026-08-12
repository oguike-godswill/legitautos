"use client";

import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CarForm } from "@/components/admin/CarForm";
import { useCar } from "@/hooks/useCars";
import { CarDetailSkeleton } from "@/components/ui/Skeleton";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function EditCarPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, isError, refetch } = useCar(id);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-3xl">
          <CarDetailSkeleton />
        </div>
      </AdminLayout>
    );
  }

  if (isError || !data?.car) {
    return (
      <AdminLayout>
        <ErrorMessage message="Car not found" onRetry={refetch} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <CarForm car={data.car} mode="edit" />
    </AdminLayout>
  );
}
