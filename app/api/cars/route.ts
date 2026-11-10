import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import { Brand } from "@/app/models/Brand";
import { requireAdmin } from "@/app/lib/auth";
import { z } from "zod";
import slugify from "slugify";
import { isValidObjectId } from "mongoose";

const QuerySchema = z.object({
  search: z.string().optional(),
  brand: z.string().optional(),
  bodyType: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minYear: z.coerce.number().optional(),
  maxYear: z.coerce.number().optional(),
  maxMileage: z.coerce.number().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  condition: z.string().optional(),
  status: z.enum(["available", "sold", "reserved", "all"]).optional(),
  ids: z.string().optional(),
  sortBy: z.enum(["price-asc", "price-desc", "year-desc", "year-asc", "mileage-asc", "newest"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  featured: z.coerce.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams));

    const filter: Record<string, unknown> = {};

    // Support batch lookup by IDs or Slugs (for Compare & Saved Garage)
    if (query.ids) {
      const idList = query.ids.split(",").map((s) => s.trim()).filter(Boolean);
      const objectIds = idList.filter((id) => isValidObjectId(id));
      const slugs = idList.filter((id) => !isValidObjectId(id));
      const orClauses: Record<string, unknown>[] = [];
      if (objectIds.length > 0) orClauses.push({ _id: { $in: objectIds } });
      if (slugs.length > 0) orClauses.push({ slug: { $in: slugs } });
      if (orClauses.length > 0) {
        filter.$or = orClauses;
      } else {
        return NextResponse.json({
          cars: [],
          total: 0,
          page: 1,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      }
    } else {
      // Status filter: default to available + reserved so buyers see live stock
      if (query.status === "all") {
        // no status restriction
      } else if (query.status === "sold" || query.status === "reserved") {
        filter.status = query.status;
      } else {
        filter.status = { $in: ["available", "reserved"] };
      }
    }

    if (query.search) {
      const searchRegex = { $regex: query.search, $options: "i" };
      const searchOr = [
        { title: searchRegex },
        { brand: searchRegex },
        { model: searchRegex },
        { location: searchRegex },
        { color: searchRegex },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or as unknown[] }, { $or: searchOr }];
        delete filter.$or;
      } else {
        filter.$or = searchOr;
      }
    }

    if (query.brand) {
      const brands = query.brand.split(",").map((b) => new RegExp(`^${b.trim()}$`, "i"));
      filter.brand = { $in: brands };
    }

    if (query.bodyType) {
      const bodyTypes = query.bodyType.split(",").map((b) => b.trim().toLowerCase());
      filter.bodyType = { $in: bodyTypes };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) (filter.price as Record<string, number>).$gte = query.minPrice;
      if (query.maxPrice !== undefined) (filter.price as Record<string, number>).$lte = query.maxPrice;
    }

    if (query.minYear !== undefined || query.maxYear !== undefined) {
      filter.year = {};
      if (query.minYear !== undefined) (filter.year as Record<string, number>).$gte = query.minYear;
      if (query.maxYear !== undefined) (filter.year as Record<string, number>).$lte = query.maxYear;
    }

    if (query.maxMileage !== undefined) {
      filter.mileage = { $lte: query.maxMileage };
    }

    if (query.transmission) {
      const transmissions = query.transmission.split(",");
      filter.transmission = { $in: transmissions };
    }

    if (query.fuelType) {
      const fuelTypes = query.fuelType.split(",");
      filter.fuelType = { $in: fuelTypes };
    }

    if (query.condition) {
      const conditions = query.condition.split(",");
      // Map "foreign-used" and "used" smartly so legacy "used" records still match when appropriate
      filter.condition = { $in: conditions };
    }

    if (query.featured) {
      filter.featured = true;
    }

    // Sorting
    let sort: Record<string, 1 | -1> = { createdAt: -1 };
    switch (query.sortBy) {
      case "price-asc":
        sort = { price: 1 };
        break;
      case "price-desc":
        sort = { price: -1 };
        break;
      case "year-desc":
        sort = { year: -1 };
        break;
      case "year-asc":
        sort = { year: 1 };
        break;
      case "mileage-asc":
        sort = { mileage: 1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
    }

    const skip = (query.page - 1) * query.limit;

    const [cars, total] = await Promise.all([
      Car.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(query.limit)
        .lean(),
      Car.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return NextResponse.json({
      cars: cars.map((car) => ({ ...car, _id: car._id.toString() })),
      total,
      page: query.page,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPrevPage: query.page > 1,
    });
  } catch (error) {
    console.error("GET /api/cars error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

const CreateCarSchema = z.object({
  title: z.string().min(3).max(100),
  brand: z.string().min(1),
  model: z.string().min(1),
  trim: z.string().optional(),
  year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(100000),
  originalPrice: z.coerce.number().optional(),
  mileage: z.coerce.number().min(0),
  transmission: z.enum(["automatic", "manual", "cvt"]),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric"]),
  bodyType: z.enum(["suv", "sedan", "coupe", "pickup", "hatchback", "van", "convertible", "wagon"]).optional().or(z.literal("")),
  drivetrain: z.enum(["fwd", "rwd", "awd", "4wd"]).optional().or(z.literal("")),
  engineSize: z.string().optional(),
  color: z.string().min(1),
  interiorColor: z.string().optional(),
  condition: z.enum(["new", "used", "certified", "foreign-used", "nigerian-used"]),
  customsPaid: z.boolean().default(true),
  description: z.string().min(20),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  location: z.string().min(1),
  status: z.enum(["available", "sold", "reserved"]).default("available"),
  featured: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await dbConnect();

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = CreateCarSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.issues },
        { status: 400 }
      );
    }

    const data = result.data;
    const cleanedData = {
      ...data,
      bodyType: data.bodyType || undefined,
      drivetrain: data.drivetrain || undefined,
    };
    const slug = slugify(`${data.year}-${data.brand}-${data.model}-${Date.now().toString(36)}`, {
      lower: true,
      strict: true,
    });

    const car = await Car.create({
      ...cleanedData,
      slug,
    });

    // Update brand car count
    await Brand.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${data.brand}$`, "i") } },
      {
        $setOnInsert: {
          name: data.brand,
          slug: slugify(data.brand, { lower: true, strict: true }),
          country: "Global",
        },
        $inc: { carCount: 1 },
      },
      { upsert: true }
    );

    return NextResponse.json(
      { car: { ...car.toObject(), _id: car._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/cars error:", error);
    return NextResponse.json(
      { error: "Failed to create car" },
      { status: 500 }
    );
  }
}
