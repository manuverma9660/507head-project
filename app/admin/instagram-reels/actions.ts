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
      url.pathname.length > 1
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
  updateTag("site-settings");
  revalidatePath("/");
  revalidatePath("/admin/instagram-reels");
}

type StoredReel = {
  id: string;
  reel_url: string;
  title: string;
  thumbnail_url: string | null;
  created_at: string;
};

function reelsFromValue(value: unknown): StoredReel[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const reels = (value as { instagram_reels?: unknown }).instagram_reels;
  if (!Array.isArray(reels)) return [];
  return reels.filter(
    (reel): reel is StoredReel =>
      Boolean(reel) &&
      typeof reel === "object" &&
      typeof (reel as StoredReel).id === "string" &&
      typeof (reel as StoredReel).reel_url === "string",
  );
}

async function saveReels(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  update: (reels: StoredReel[]) => StoredReel[],
) {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "site")
    .maybeSingle();
  if (error) throw error;
  const current =
    data?.value && typeof data.value === "object" && !Array.isArray(data.value)
      ? data.value
      : {};
  const { error: saveError } = await supabase.from("site_settings").upsert({
    key: "site",
    value: { ...current, instagram_reels: update(reelsFromValue(current)) },
    updated_at: new Date().toISOString(),
    updated_by: userId,
  });
  if (saveError) throw saveError;
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

  try {
    await saveReels(supabase, user.id, (reels) => [
      {
        id: crypto.randomUUID(),
        reel_url: reelUrl.replace(/\/$/, ""),
        title: title.slice(0, 120),
        thumbnail_url: thumbnailUrl || null,
        created_at: new Date().toISOString(),
      },
      ...reels,
    ]);
  } catch {
    redirect("/admin/instagram-reels?status=save_error");
  }
  refreshReels();
  redirect("/admin/instagram-reels?status=added");
}

export async function deleteInstagramReel(formData: FormData) {
  const { supabase, user } = await getAdmin();
  const id = text(formData, "id");
  if (!id) redirect("/admin/instagram-reels?status=invalid");
  try {
    await saveReels(supabase, user.id, (reels) =>
      reels.filter((reel) => reel.id !== id),
    );
  } catch {
    redirect("/admin/instagram-reels?status=delete_error");
  }
  refreshReels();
  redirect("/admin/instagram-reels?status=deleted");
}
