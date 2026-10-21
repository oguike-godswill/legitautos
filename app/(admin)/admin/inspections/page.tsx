export const dynamic = "force-dynamic";

import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { AdminInspectionTable } from "@/app/components/admin/AdminInspectionTable";
import { Button } from "@/app/components/ui/Button";
import { dbConnect } from "@/app/lib/dbConnect";
import { Inspection } from "@/app/models/Inspection";

async function getAllInspections() {
  await dbConnect();
  // Admins see drafts as well as published media, unlike the public listing.
  const inspections = await Inspection.find({})
    .sort({ order: -1, createdAt: -1 })
    .lean();

  return inspections.map((item) => ({
    ...item,
    _id: item._id.toString(),
    car: item.car?.toString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));
}

export default async function AdminInspectionsPage() {
  const inspections = await getAllInspections();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-900">
              Inspection Media
            </h1>
            <p className="mt-1 text-sm text-dark-500">
              Walkaround videos and condition photos shown on the website
            </p>
          </div>
          <Link href="/admin/inspections/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add Media</Button>
          </Link>
        </div>

        <AdminInspectionTable inspections={inspections} />
      </div>
    </AdminLayout>
  );
}
