export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { InspectionForm } from "@/app/components/admin/InspectionForm";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import { Inspection } from "@/app/models/Inspection";

async function getData(id: string) {
  await dbConnect();

  const [cars, inspection] = await Promise.all([
    Car.find({}).select("_id title").sort({ createdAt: -1 }).lean(),
    isValidObjectId(id) ? Inspection.findById(id).lean() : null,
  ]);

  if (!inspection) return null;

  return {
    cars: cars.map((car) => ({ _id: car._id.toString(), title: car.title })),
    inspection: {
      ...inspection,
      _id: inspection._id.toString(),
      car: inspection.car?.toString(),
      createdAt: inspection.createdAt.toISOString(),
      updatedAt: inspection.updatedAt.toISOString(),
    },
  };
}

export default async function EditInspectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getData(id);

  if (!data) notFound();

  return (
    <AdminLayout>
      <InspectionForm
        inspection={data.inspection}
        cars={data.cars}
        mode="edit"
      />
    </AdminLayout>
  );
}
