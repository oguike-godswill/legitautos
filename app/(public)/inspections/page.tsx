import { Metadata } from "next";
import Link from "next/link";
import { dbConnect } from "@/app/lib/dbConnect";
import { Inspection } from "@/app/models/Inspection";
import { InspectionGrid } from "@/app/components/inspections/InspectionGrid";
import { dealership } from "@/app/config/dealership";
import { ArrowRight, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Car Inspections",
  description:
    "Walkaround videos and condition photos of the cars on the LegitAutos lot. See the actual car before you visit.",
  openGraph: {
    title: "Car Inspections | LegitAutos",
    description:
      "Walkaround videos and condition photos of the cars on the LegitAutos lot.",
    url: `${dealership.siteUrl}/inspections`,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: `${dealership.siteUrl}/inspections`,
  },
};

/**
 * Reads published inspection media directly from the database, matching how the
 * other server-rendered pages in this app fetch their data.
 */
async function getInspections() {
  await dbConnect();
  const inspections = await Inspection.find({ published: true })
    .sort({ order: -1, createdAt: -1 })
    .limit(48)
    .lean();

  return inspections.map((item) => ({
    ...item,
    _id: item._id.toString(),
    car: item.car?.toString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }));
}

export default async function InspectionsPage() {
  const inspections = await getInspections();

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-28 pb-12 px-2 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-3xl">
          <span className="t-mono text-[0.5rem] text-dark-400 block mb-4">
            Inspection Media
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-[0.95] tracking-tight text-dark-900">
            See It Before
            <br />
            <span className="text-dark-400">You Visit.</span>
          </h1>
          <p className="mt-5 max-w-xl text-xs leading-relaxed text-dark-500 sm:text-sm">
            We record walkaround clips and condition photos of our own stock, so
            you can see the actual car on our lot before making the trip.
          </p>
        </div>
      </div>

      <div className="px-2 pb-20 sm:px-8 lg:px-12 max-w-[1400px] mx-auto">
        {inspections.length > 0 ? (
          <InspectionGrid inspections={inspections} />
        ) : (
          <div className="rounded-xl border border-gray-200/80 bg-gray-50 p-8 text-center">
            <p className="text-sm font-semibold text-dark-800">
              No inspection media published yet.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-dark-500">
              Our team is still recording footage of the current stock. In the
              meantime, ask us about any car and we will send you a clip
              directly.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 rounded-lg bg-teal px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-700"
              >
                Browse cars
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-dark-600 transition-colors hover:border-gray-300 hover:text-dark-800"
              >
                <MessageCircle className="h-4 w-4" />
                Ask us directly
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
