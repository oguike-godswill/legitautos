import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/app/lib/auth";
import { rateLimit } from "@/app/lib/rateLimit";

export const dynamic = "force-dynamic";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

/** Magic-byte prefixes for the image formats we accept. */
const IMAGE_SIGNATURES: Array<{ mime: string; bytes: number[] }> = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/gif", bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF....WEBP
];

/** Sniffs the real file type from its leading bytes. */
function detectImageMime(buffer: Buffer): string | null {
  for (const signature of IMAGE_SIGNATURES) {
    if (buffer.length < signature.bytes.length) continue;
    const matches = signature.bytes.every((byte, i) => buffer[i] === byte);
    if (!matches) continue;
    if (signature.mime === "image/webp") {
      const isWebp =
        buffer.length >= 12 && buffer.subarray(8, 12).toString("ascii") === "WEBP";
      if (!isWebp) continue;
    }
    return signature.mime;
  }
  return null;
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const limited = rateLimit(request, {
    name: "upload",
    limit: 60,
    windowMs: 10 * 60 * 1000,
  });
  if (limited) return limited;

  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Image storage is not configured" },
      { status: 503 }
    );
  }

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 5MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Trust the file's own bytes, not the client-supplied content type.
    const mime = detectImageMime(buffer);
    if (!mime) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, GIF or WebP images are allowed" },
        { status: 400 }
      );
    }

    const dataURI = `data:${mime};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: "legitautos/inventory",
      resource_type: "image",
      transformation: [
        { width: 1600, height: 1200, crop: "limit", quality: "auto" },
      ],
    });

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error(
      "POST /api/upload error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
