import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { StatsCards } from "@/app/components/admin/StatsCards";
import { AdminCarTable } from "@/app/components/admin/AdminCarTable";
import { Button } from "@/app/components/ui/Button";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import Link from "next/link";
import { Plus } from "lucide-react";

async function getStats() {
  await dbConnect();
  const [totalCars, totalViews, availableCars, soldCars] = await Promise.all([
    Car.countDocuments(),
    Car.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]).then((r) => r[0]?.total || 0),
    Car.countDocuments({ status: "available" }),
    Car.countDocuments({ status: "sold" }),
  ]);
  return { totalCars, totalViews, availableCars, soldCars };
}

async function getRecentCars() {
  await dbConnect();
  const cars = await Car.find({}).sort({ createdAt: -1 }).limit(10).lean();
  return cars.map((car) => ({ ...car, _id: car._id.toString() }));
}

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const recentCars = await getRecentCars();

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-900">Dashboard</h1>
            <p className="text-sm text-dark-500 mt-1">Overview of your car marketplace</p>
          </div>
          <Link href="/admin/cars/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Add New Car</Button>
          </Link>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Recent Cars */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-900">Recent Listings</h2>
            <Link
              href="/admin/cars"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          </div>
          <AdminCarTable cars={recentCars} />
        </div>
      </div>
    </AdminLayout>
  );
}
