import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cloudinary } from "@/lib/cloudinary";

async function getAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null };
  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();
  return {
    supabase,
    user: profile?.role === "admin" && profile.is_active ? user : null,
  };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { supabase, user } = await getAdmin();
  if (!user)
    return NextResponse.json({ error: "अनुमति नहीं है।" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const altText =
    typeof body.altText === "string" ? body.altText.trim().slice(0, 250) : "";
  const replacementPublicId =
    typeof body.replacementPublicId === "string" ? body.replacementPublicId : "";
  if (replacementPublicId) {
    const { data: current, error: currentError } = await supabase
      .from("media_assets")
      .select("id, public_id, url")
      .eq("id", id)
      .single();
    if (currentError || !current)
      return NextResponse.json({ error: "Media नहीं मिली।" }, { status: 404 });
    try {
      const replacement = await cloudinary.api.resource(replacementPublicId, {
        image_metadata: true,
      });
      const payload = {
        public_id: replacement.public_id,
        cloudinary_public_id: replacement.public_id,
        url: replacement.secure_url,
        secure_url: replacement.secure_url,
        width: replacement.width,
        height: replacement.height,
        bytes: replacement.bytes,
        format: replacement.format,
        original_filename: replacement.original_filename ?? null,
        updated_at: new Date().toISOString(),
      };
      // The browser upload creates a temporary catalogue row. Merge it into
      // this existing asset before swapping the public id to keep one record.
      await supabase
        .from("media_assets")
        .delete()
        .eq("public_id", replacement.public_id)
        .neq("id", id);
      const { data, error } = await supabase
        .from("media_assets")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      await supabase
        .from("articles")
        .update({ featured_image_url: replacement.secure_url })
        .eq("featured_image_url", current.url);
      await cloudinary.uploader.destroy(current.public_id, {
        resource_type: "image",
        invalidate: true,
      });
      return NextResponse.json({ asset: data });
    } catch {
      return NextResponse.json({ error: "Image replace नहीं हो पाई।" }, { status: 400 });
    }
  }
  const { data, error } = await supabase
    .from("media_assets")
    .update({ alt_text: altText || null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error)
    return NextResponse.json(
      { error: "जानकारी save नहीं हुई।" },
      { status: 400 },
    );
  return NextResponse.json({ asset: data });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { supabase, user } = await getAdmin();
  if (!user)
    return NextResponse.json({ error: "अनुमति नहीं है।" }, { status: 401 });
  const { id } = await context.params;
  const { data: asset } = await supabase
    .from("media_assets")
    .select("id, public_id, url")
    .eq("id", id)
    .maybeSingle();
  if (!asset)
    return NextResponse.json({ error: "मीडिया नहीं मिली।" }, { status: 404 });
  const { count } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true })
    .eq("featured_image_url", asset.url);
  if ((count ?? 0) > 0)
    return NextResponse.json(
      { error: `यह image ${count} article में लगी है। पहले उसे replace करें।` },
      { status: 409 },
    );
  try {
    await cloudinary.uploader.destroy(asset.public_id, {
      resource_type: "image",
      invalidate: true,
    });
    const { error } = await supabase.from("media_assets").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Delete नहीं हो पाया।" },
      { status: 500 },
    );
  }
}
