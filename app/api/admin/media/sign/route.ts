import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  CLOUDINARY_MEDIA_FOLDER,
  cloudinary,
  getCloudinaryConfig,
} from "@/lib/cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const UPLOAD_TRANSFORMATION = "c_limit,h_2400,w_2400/f_auto,q_auto";

function safeBaseName(value: string) {
  return (
    value
      .replace(/\.[^.]+$/, "")
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "image"
  );
}

async function getAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  return profile?.role === "admin" && profile.is_active ? user : null;
}

export async function POST(request: Request) {
  const user = await getAdmin();
  if (!user)
    return NextResponse.json({ error: "अनुमति नहीं है।" }, { status: 401 });

  let body: { fileName?: unknown; fileType?: unknown; fileSize?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "गलत अनुरोध है।" }, { status: 400 });
  }

  const fileName = typeof body.fileName === "string" ? body.fileName : "";
  const fileType = typeof body.fileType === "string" ? body.fileType : "";
  const fileSize = typeof body.fileSize === "number" ? body.fileSize : 0;

  if (
    !fileName ||
    !ALLOWED_TYPES.has(fileType) ||
    !Number.isFinite(fileSize) ||
    fileSize <= 0 ||
    fileSize > MAX_FILE_SIZE
  ) {
    return NextResponse.json(
      { error: "केवल JPG, PNG, WebP, GIF या AVIF (अधिकतम 10 MB) अपलोड करें।" },
      { status: 400 },
    );
  }

  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `${CLOUDINARY_MEDIA_FOLDER}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeBaseName(fileName)}`;
    // Only body parameters are signed. resource_type belongs in the URL.
    const signature = cloudinary.utils.api_sign_request(
      {
        folder: CLOUDINARY_MEDIA_FOLDER,
        public_id: publicId,
        timestamp,
        transformation: UPLOAD_TRANSFORMATION,
      },
      apiSecret,
    );

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder: CLOUDINARY_MEDIA_FOLDER,
      publicId,
      transformation: UPLOAD_TRANSFORMATION,
    });
  } catch {
    return NextResponse.json(
      { error: "Cloudinary configuration नहीं मिली।" },
      { status: 503 },
    );
  }
}
