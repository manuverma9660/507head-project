"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function getAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin" || profile.is_active !== true)
    redirect("/admin/login");
  return { supabase, user };
}

function text(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function isInstagramReelUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      (url.hostname === "instagram.com" ||
        url.hostname === "www.instagram.com") &&
      /^\/(reel|p)\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function refreshReels() {
  updateTag("instagram-reels");
  revalidatePath("/");
  revalidatePath("/admin/instagram-reels");
}

export async function addInstagramReel(formData: FormData) {
  const { supabase, user } = await getAdmin();
  const reelUrl = text(formData, "reel_url");
  const title = text(formData, "title") || "Instagram Reel";
  const thumbnailUrl = text(formData, "thumbnail_url");
  if (!isInstagramReelUrl(reelUrl))
    redirect("/admin/instagram-reels?status=invalid_reel");
  if (thumbnailUrl && !isHttpsUrl(thumbnailUrl))
    redirect("/admin/instagram-reels?status=invalid_cover");

  const { error } = await supabase.from("instagram_reels").insert({
    reel_url: reelUrl.replace(/\/$/, ""),
    title: title.slice(0, 120),
    thumbnail_url: thumbnailUrl || null,
    created_by: user.id,
  });
  if (error) redirect("/admin/instagram-reels?status=save_error");
  refreshReels();
  redirect("/admin/instagram-reels?status=added");
}

export async function deleteInstagramReel(formData: FormData) {
  const { supabase } = await getAdmin();
  const id = text(formData, "id");
  if (!id) redirect("/admin/instagram-reels?status=invalid");
  const { error } = await supabase.from("instagram_reels").delete().eq("id", id);
  if (error) redirect("/admin/instagram-reels?status=delete_error");
  refreshReels();
  redirect("/admin/instagram-reels?status=deleted");
}
