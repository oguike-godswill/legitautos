import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const envKeys = Object.keys(process.env).filter(key => 
    key.includes("CLOUDINARY") || 
    key.includes("NEXT_PUBLIC") || 
    key.includes("MONGO")
  );
  console.log("Cloudinary Config Check:", {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY ? "PRESENT" : "MISSING",
    apiSecret: process.env.CLOUDINARY_API_SECRET ? "PRESENT" : "MISSING",
    matchingEnvKeys: envKeys,
  });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files allowed" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: "car-marketplace",
      transformation: [
        { width: 1200, height: 800, crop: "fill", quality: "auto" },
      ],
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
