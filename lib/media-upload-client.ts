"use client";

export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export type UploadedMediaAsset = {
  id: string;
  public_id: string;
  url: string;
  width: number | null;
  height: number | null;
  bytes: number | null;
  format: string | null;
  original_filename: string | null;
  alt_text: string | null;
  created_at: string;
};

export function imageUploadError(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.has(file.type))
    return "केवल JPG, PNG, WebP, GIF या AVIF image चुनें।";
  if (file.size <= 0 || file.size > MAX_IMAGE_UPLOAD_BYTES)
    return "Image का size अधिकतम 10 MB हो सकता है।";
  return null;
}

export async function uploadCloudinaryImage(file: File) {
  const validationError = imageUploadError(file);
  if (validationError) throw new Error(validationError);

  const signatureResponse = await fetch("/api/admin/media/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  });
  const signature = await signatureResponse.json();
  if (!signatureResponse.ok) throw new Error(signature.error || "Upload शुरू नहीं हुआ।");

  const uploadData = new FormData();
  uploadData.set("file", file);
  uploadData.set("api_key", signature.apiKey);
  uploadData.set("timestamp", String(signature.timestamp));
  uploadData.set("signature", signature.signature);
  uploadData.set("folder", signature.folder);
  uploadData.set("public_id", signature.publicId);
  uploadData.set("transformation", signature.transformation);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: "POST", body: uploadData },
  );
  const uploaded = await uploadResponse.json().catch(() => null);
  if (!uploadResponse.ok)
    throw new Error(uploaded?.error?.message || "Cloudinary upload failed.");

  const completeResponse = await fetch("/api/admin/media/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId: uploaded?.public_id }),
  });
  const complete = await completeResponse.json();
  if (!completeResponse.ok) throw new Error(complete.error || "Media save नहीं हुई।");
  return complete.asset as UploadedMediaAsset;
}
