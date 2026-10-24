import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cloudinary } from "@/lib/cloudinary";

async function getAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null };
  const { data: profile } = await supabase.from("staff_profiles").select("role, is_active").eq("user_id", user.id).maybeSingle();
  return { supabase, user: profile?.role === "admin" && profile.is_active ? user : null };
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await getAdmin();
  if (!user) return NextResponse.json({ error: "अनुमति नहीं है।" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const altText = typeof body.altText === "string" ? body.altText.trim().slice(0, 250) : "";
  const { data, error } = await supabase.from("media_assets").update({ alt_text: altText || null, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "जानकारी save नहीं हुई।" }, { status: 400 });
  return NextResponse.json({ asset: data });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { supabase, user } = await getAdmin();
  if (!user) return NextResponse.json({ error: "अनुमति नहीं है।" }, { status: 401 });
  const { id } = await context.params;
  const { data: asset } = await supabase.from("media_assets").select("id, public_id, url").eq("id", id).maybeSingle();
  if (!asset) return NextResponse.json({ error: "मीडिया नहीं मिली।" }, { status: 404 });
  const { count } = await supabase.from("articles").select("id", { count: "exact", head: true }).eq("featured_image_url", asset.url);
  if ((count ?? 0) > 0) return NextResponse.json({ error: `यह image ${count} article में लगी है। पहले उसे replace करें।` }, { status: 409 });
  try {
    await cloudinary.uploader.destroy(asset.public_id, { resource_type: "image", invalidate: true });
    const { error } = await supabase.from("media_assets").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete नहीं हो पाया।" }, { status: 500 });
  }
}
