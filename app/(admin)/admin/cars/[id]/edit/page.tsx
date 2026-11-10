export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { CarForm } from "@/app/components/admin/CarForm";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";

async function getCarForEdit(id: string) {
  try {
    await dbConnect();
    const decoded = decodeURIComponent(id).trim();
    let car = null;

    if (isValidObjectId(decoded)) {
      car = await Car.findById(decoded).lean();
    }
    if (!car) {
      car = await Car.findOne({ slug: decoded }).lean();
    }
    if (!car) return null;

    return JSON.parse(JSON.stringify({ ...car, _id: car._id.toString() }));
  } catch (error) {
    console.error("getCarForEdit error:", error);
    return null;
  }
}

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await getCarForEdit(id);

  if (!car) {
    notFound();
  }

  return (
    <AdminLayout>
      <CarForm car={car} mode="edit" />
    </AdminLayout>
  );
}
