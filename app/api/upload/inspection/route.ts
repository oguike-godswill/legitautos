import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/app/lib/auth";
import { rateLimit } from "@/app/lib/rateLimit";
import {
  MAX_INSPECTION_VIDEO_BYTES,
  MAX_INSPECTION_IMAGE_BYTES,
} from "@/app/config/media";

export const dynamic = "force-dynamic";

/**
 * Uploads one inspection video or photo to Cloudinary and returns the URLs the
 * inspection record should store.
 *
 * This is deliberately separate from /api/upload. That route serves inventory
 * photos and crops them to 3:2 for the card grid — the wrong treatment for a
 * walkaround clip. Here the media is stored as-is: cropping a video would cut
 * off whatever the camera was pointed at.
 *
 * Cloudinary's free tier bills video bandwidth heavily, so both the byte cap
 * and Cloudinary's own recommended quality ceiling are enforced.
 */
const IMAGE_SIGNATURES: Array<{ mime: string; bytes: number[] }> = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
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

/** Reads the `ftyp` brand from an ISO base media file (MP4 / MOV / M4V). */
function detectMp4Brand(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  if (buffer.subarray(4, 8).toString("ascii") !== "ftyp") return null;
  return buffer.subarray(8, 12).toString("ascii");
}

/**
 * Sniffs a video container from its leading bytes.
 *
 * MP4 and MOV share the ISO base media container: the brand says which is
 * which, but both upload to Cloudinary as resource_type "video".
 */
function detectVideoMime(buffer: Buffer): string | null {
  const brand = detectMp4Brand(buffer);
  if (brand) {
    // QuickTime brand is "qt  " (with two trailing spaces).
    return brand.startsWith("qt") ? "video/quicktime" : "video/mp4";
  }

  // WebM/Matroska: EBML header 1A 45 DF A3.
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  ) {
    return "video/webm";
  }

  return null;
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  // Video uploads are heavy, so this is tighter than the image uploader.
  const limited = rateLimit(request, {
    name: "inspection-upload",
    limit: 20,
    windowMs: 15 * 60 * 1000,
  });
  if (limited) return limited;

  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { error: "Media storage is not configured" },
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

    const buffer = Buffer.from(await file.arrayBuffer());

    // Trust the bytes, not the client-supplied content type or extension.
    const imageMime = detectImageMime(buffer);
    const videoMime = imageMime ? null : detectVideoMime(buffer);

    if (!imageMime && !videoMime) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP images or MP4, MOV, WebM videos are allowed" },
        { status: 400 }
      );
    }

    const isVideo = Boolean(videoMime);
    const maxBytes = isVideo
      ? MAX_INSPECTION_VIDEO_BYTES
      : MAX_INSPECTION_IMAGE_BYTES;

    if (buffer.length > maxBytes) {
      const limitMb = Math.round(maxBytes / (1024 * 1024));
      return NextResponse.json(
        { error: `${isVideo ? "Video" : "Image"} too large (max ${limitMb}MB)` },
        { status: 400 }
      );
    }

    const mime = (videoMime || imageMime) as string;
    const dataURI = `data:${mime};base64,${buffer.toString("base64")}`;

    if (isVideo) {
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "legitautos/inspections",
        resource_type: "video",
        // A 720p ceiling keeps file size and bandwidth predictable without
        // making a walkaround clip hard to judge.
        eager: [{ width: 1280, height: 720, crop: "limit", quality: "auto" }],
      });

      const poster =
        result.eager?.[0]?.secure_url ||
        // Cloudinary derives a jpg poster from any video frame with this
        // suffix pattern. Drop the extension and ask for a .jpg instead.
        result.secure_url.replace(/\.[a-z0-9]+$/i, ".jpg");

      return NextResponse.json({
        type: "video" as const,
        url: result.secure_url,
        publicId: result.public_id,
        thumbnailUrl: poster,
        duration: typeof result.duration === "number" ? Math.round(result.duration) : undefined,
      });
    }

    // Photos keep their own ratio. Neither the card grid nor the gallery is
    // involved here, so there is nothing to normalise for.
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "legitautos/inspections",
      resource_type: "image",
      transformation: [{ width: 1600, crop: "limit", quality: "auto" }],
    });

    return NextResponse.json({
      type: "image" as const,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error(
      "POST /api/upload/inspection error:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
