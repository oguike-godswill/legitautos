"use client";

import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { CarForm } from "@/app/components/admin/CarForm";

export default function NewCarPage() {
  return (
    <AdminLayout>
      <CarForm mode="create" />
    </AdminLayout>
  );
}
