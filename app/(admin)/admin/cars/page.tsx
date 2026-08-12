import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { AdminCarTable } from "@/app/components/admin/AdminCarTable";
import { Button } from "@/app/components/ui/Button";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getAllCars() {
  await dbConnect();
  const cars = await Car.find({}).sort({ createdAt: -1 }).lean();
  return cars.map((car) => ({ ...car, _id: car._id.toString() }));
}

export default async function AdminCarsPage() {
  const cars = await getAllCars();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-900">All Cars</h1>
            <p className="text-sm text-dark-500 mt-1">Manage your car listings</p>
          </div>
          <Link href="/admin/cars/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add New Car</Button>
          </Link>
        </div>

        <AdminCarTable cars={cars} />
      </div>
    </AdminLayout>
  );
}
