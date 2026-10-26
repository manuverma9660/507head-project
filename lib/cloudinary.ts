import "server-only";

import { v2 as cloudinary } from "cloudinary";

const cloudinaryUrl = process.env.CLOUDINARY_URL;

if (cloudinaryUrl) {
  cloudinary.config({ cloudinary_url: cloudinaryUrl, secure: true });
}

export const CLOUDINARY_MEDIA_FOLDER = "507head/media";

export function getCloudinaryConfig() {
  const config = cloudinary.config();

  if (!config.cloud_name || !config.api_key || !config.api_secret) {
    throw new Error(
      "Cloudinary credentials are missing. Add CLOUDINARY_URL to .env.local.",
    );
  }

  return {
    cloudName: config.cloud_name,
    apiKey: config.api_key,
    apiSecret: config.api_secret,
  };
}

export { cloudinary };
