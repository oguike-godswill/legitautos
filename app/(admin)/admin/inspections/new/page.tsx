export const dynamic = "force-dynamic";

import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { InspectionForm } from "@/app/components/admin/InspectionForm";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";

async function getCarOptions() {
  await dbConnect();
  const cars = await Car.find({})
    .select("_id title")
    .sort({ createdAt: -1 })
    .lean();

  return cars.map((car) => ({ _id: car._id.toString(), title: car.title }));
}

export default async function NewInspectionPage() {
  const cars = await getCarOptions();

  return (
    <AdminLayout>
      <InspectionForm cars={cars} mode="create" />
    </AdminLayout>
  );
}
