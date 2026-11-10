import { Metadata } from "next";
import Link from "next/link";
import { dbConnect } from "@/app/lib/dbConnect";
import { Inspection } from "@/app/models/Inspection";
import { InspectionGrid } from "@/app/components/inspections/InspectionGrid";
import { dealership, dealershipWhatsApp } from "@/app/config/dealership";
import { ArrowRight, MessageCircle, Video } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Video Inspections & Showroom Walkarounds",
  description:
    "Watch unedited walkaround videos and condition photos recorded on the LegitAutos Lagos lot before you visit.",
  openGraph: {
    title: "Video Inspections | LegitAutos",
    description:
      "Walkaround videos and condition photos of the cars on the LegitAutos lot.",
    url: `${dealership.siteUrl}/inspections`,
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: `${dealership.siteUrl}/inspections`,
  },
};

async function getInspections() {
  try {
    await dbConnect();
    const inspections = await Inspection.find({ published: true })
      .sort({ order: -1, createdAt: -1 })
      .limit(48)
      .lean();

    return inspections.map((item) => {
      let thumbnailUrl = item.thumbnailUrl;
      if (item.type === "video") {
        const candidate = thumbnailUrl || item.url;
        if (candidate && /\.(mp4|mov|webm|m4v|m3u8)(\?.*)?$/i.test(candidate)) {
          thumbnailUrl = candidate.replace(/\.(mp4|mov|webm|m4v|m3u8)(\?.*)?$/i, ".jpg$2");
        }
      }
      return {
        ...item,
        _id: item._id.toString(),
        car: item.car?.toString(),
        thumbnailUrl,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      };
    });
  } catch {
    return [];
  }
}

export default async function InspectionsPage() {
  const inspections = await getInspections();

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      {/* Dark Architectural Hero */}
      <div className="bg-[#0C0C0E] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D9381E]/40 bg-[#D9381E]/15 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-[#D9381E] mb-4">
              <Video className="w-3.5 h-3.5" />
              Unedited Showroom Media
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-[1.1] tracking-tight text-white">
              See &amp; Hear the Car{" "}
              <span className="t-editorial text-[#D9381E]">Before You Visit.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-white/75">
              We record real engine cold-starts, interior walkarounds, and body condition footage of our stock in {dealership.address.city} so you can evaluate with complete clarity before scheduling a showroom visit.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-12 pb-24 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        {inspections.length > 0 ? (
          <InspectionGrid inspections={inspections} />
        ) : (
          <div className="rounded-3xl border border-dark-200/80 bg-white p-10 text-center max-w-2xl mx-auto shadow-xs">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D9381E]/10 text-[#D9381E]">
              <Video className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-extrabold text-dark-900">
              Request a Live WhatsApp Video Walkaround
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-dark-600">
              Want to see any vehicle in our showroom right now? Message our
              sales team on WhatsApp and we will record or live-stream a custom
              walkaround of the exact car for you.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0C0C0E] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#D9381E]"
              >
                Browse Showroom Stock
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={dealershipWhatsApp(
                  `Hello ${dealership.name}, I'd like to request a video walkaround of a car in your showroom.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D9381E] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#B82B14]"
              >
                <MessageCircle className="h-4 w-4" />
                Request Video on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
