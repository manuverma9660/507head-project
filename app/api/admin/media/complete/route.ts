import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CLOUDINARY_MEDIA_FOLDER, cloudinary } from "@/lib/cloudinary";

async function getAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null };
  const { data: profile } = await supabase.from("staff_profiles").select("role, is_active").eq("user_id", user.id).maybeSingle();
  return { supabase, user: profile?.role === "admin" && profile.is_active ? user : null };
}

export async function POST(request: Request) {
  const { supabase, user } = await getAdmin();
  if (!user) return NextResponse.json({ error: "अनुमति नहीं है।" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const publicId = typeof body.publicId === "string" ? body.publicId : "";
  if (!publicId.startsWith(`${CLOUDINARY_MEDIA_FOLDER}/`)) return NextResponse.json({ error: "अमान्य मीडिया फ़ाइल।" }, { status: 400 });

  try {
    const asset = await cloudinary.api.resource(publicId, { image_metadata: true });
    const payload = {
      provider: "cloudinary",
      public_id: asset.public_id,
      // Compatible with the existing media_assets schema already in Supabase.
      cloudinary_public_id: asset.public_id,
      resource_type: asset.resource_type,
      url: asset.secure_url,
      secure_url: asset.secure_url,
      width: asset.width,
      height: asset.height,
      bytes: asset.bytes,
      format: asset.format,
      original_filename: asset.original_filename ?? null,
      folder: CLOUDINARY_MEDIA_FOLDER,
      created_by: user.id,
      updated_at: new Date().toISOString(),
    };
    const { data: existing } = await supabase
      .from("media_assets")
      .select("id")
      .eq("public_id", asset.public_id)
      .maybeSingle();
    const query = existing
      ? supabase.from("media_assets").update(payload).eq("id", existing.id)
      : supabase.from("media_assets").insert(payload);
    const { data, error } = await query.select().single();
    if (error) throw error;
    return NextResponse.json({ asset: data });
  } catch (error) {
    const detail = error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : "Unknown error";
    return NextResponse.json({ error: `अपलोड Cloudinary पर हो गया, लेकिन Supabase metadata save नहीं हुआ: ${detail}` }, { status: 500 });
  }
}
