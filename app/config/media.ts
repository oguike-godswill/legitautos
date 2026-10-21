/**
 * Inspection media limits.
 *
 * Kept in one place because three consumers have to agree on them: the public
 * API, the admin upload route, and the admin uploader UI. Cloudinary's free
 * tier is a real constraint here — video consumes bandwidth far faster than
 * images — so these caps are deliberately modest.
 */

/** Max size for a single uploaded inspection video. */
export const MAX_INSPECTION_VIDEO_BYTES = 40 * 1024 * 1024; // 40 MB

/** Max size for a single uploaded inspection photo. */
export const MAX_INSPECTION_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

/** Formats accepted for inspection videos. */
export const INSPECTION_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
] as const;

/** Formats accepted for inspection photos. */
export const INSPECTION_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/** Human-readable guidance shown in the admin uploader. */
export const INSPECTION_VIDEO_GUIDANCE = "MP4, MOV or WebM up to 40MB";
export const INSPECTION_IMAGE_GUIDANCE = "JPG, PNG or WebP up to 5MB";

/** Accept attribute for the admin file input, derived from the lists above. */
export const INSPECTION_ACCEPT = [
  ...INSPECTION_VIDEO_TYPES,
  ...INSPECTION_IMAGE_TYPES,
].join(",");

/** e.g. "40 MB" — used in the uploader copy. */
export function formatBytes(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))} MB`;
}

/**
 * Shown in the uploader hint. Derived from the enforced caps rather than
 * written out, so the copy cannot drift from what the API actually allows.
 */
export const INSPECTION_VIDEO_BYTES_HINT = `${formatBytes(
  MAX_INSPECTION_VIDEO_BYTES
)} max`;
export const INSPECTION_IMAGE_BYTES_HINT = `${formatBytes(
  MAX_INSPECTION_IMAGE_BYTES
)} max`;


/**
 * If a car is attached to some media, a video should be present. Photos alone
 * describe a car but do not let a remote buyer watch it being walked around.
 *
 * This is surfaced as a warning rather than a save-time error: an admin may
 * legitimately want to publish an opening batch of static condition shots
 * before the walkaround clip is ready.
 */
export const INSPECTION_VIDEO_RECOMMENDED_NOTE =
  "Attached cars usually include at least one walkaround video. Photos alone won't show a buyer how the car runs.";
