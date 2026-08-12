import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/dbConnect";
import { Car } from "@/app/models/Car";
import { Brand } from "@/app/models/Brand";
import { z } from "zod";
import slugify from "slugify";

const QuerySchema = z.object({
  search: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minYear: z.coerce.number().optional(),
  maxYear: z.coerce.number().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  condition: z.string().optional(),
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

    const filter: Record<string, unknown> = { status: "available" };

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: "i" } },
        { brand: { $regex: query.search, $options: "i" } },
        { model: { $regex: query.search, $options: "i" } },
      ];
    }

    if (query.brand) {
      const brands = query.brand.split(",");
      filter.brand = { $in: brands };
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
  year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(100000),
  originalPrice: z.coerce.number().optional(),
  mileage: z.coerce.number().min(0),
  transmission: z.enum(["automatic", "manual", "cvt"]),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric"]),
  engineSize: z.string().optional(),
  color: z.string().min(1),
  condition: z.enum(["new", "used", "certified"]),
  description: z.string().min(20),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  location: z.string().min(1),
  sellerName: z.string().min(1),
  sellerPhone: z.string().min(10),
  sellerWhatsapp: z.string().optional(),
  sellerEmail: z.string().email().optional().or(z.literal("")),
  status: z.enum(["available", "sold", "reserved"]).default("available"),
  featured: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
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
    const slug = slugify(`${data.brand}-${data.model}-${data.year}-${Date.now()}`, { lower: true });

    const car = await Car.create({
      ...data,
      slug,
      seller: {
        name: data.sellerName,
        phone: data.sellerPhone,
        whatsapp: data.sellerWhatsapp,
        email: data.sellerEmail,
      },
    });

    // Update brand car count
    await Brand.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${data.brand}$`, "i") } },
      { $inc: { carCount: 1 } },
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
