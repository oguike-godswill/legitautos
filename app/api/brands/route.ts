import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Brand } from "@/app/models/Brand";
import { Car } from "@/app/models/Car";
import slugify from "slugify";

export async function GET() {
  try {
    await dbConnect();

    const [brands, liveCounts] = await Promise.all([
      Brand.find({}).lean(),
      Car.aggregate<{ _id: string; count: number }>([
        { $match: { status: { $in: ["available", "reserved"] } } },
        {
          $group: {
            _id: { $toLower: "$brand" },
            originalName: { $first: "$brand" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const countMap = new Map<string, { count: number; originalName: string }>();
    for (const row of liveCounts as unknown as {
      _id: string;
      originalName: string;
      count: number;
    }[]) {
      if (row._id) {
        countMap.set(row._id, { count: row.count, originalName: row.originalName });
      }
    }

    const seen = new Set<string>();
    const enriched = brands.map((b) => {
      const key = b.name.toLowerCase();
      seen.add(key);
      const live = countMap.get(key);
      return {
        ...b,
        _id: b._id.toString(),
        carCount: live ? live.count : 0,
      };
    });

    // Include any brand present in Car documents that wasn't in the Brand collection yet
    for (const [key, val] of countMap.entries()) {
      if (!seen.has(key)) {
        enriched.push({
          _id: key,
          name: val.originalName,
          slug: slugify(val.originalName, { lower: true, strict: true }),
          country: "Global",
          carCount: val.count,
        } as unknown as (typeof enriched)[number]);
      }
    }

    enriched.sort((a, b) => (b.carCount || 0) - (a.carCount || 0) || a.name.localeCompare(b.name));

    return NextResponse.json({
      brands: enriched,
    });
  } catch (error) {
    console.error("GET /api/brands error:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}
