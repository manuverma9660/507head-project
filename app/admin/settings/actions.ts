"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string, max: number) {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function isAllowedSiteUrl(value: string) {
  return /^https:\/\/[^\s]+$/i.test(value) || /^http:\/\/localhost(?::\d+)?$/i.test(value);
}

export async function saveSiteSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("staff_profiles").select("role, is_active").eq("user_id", user.id).maybeSingle();
  if (profile?.role !== "admin" || profile.is_active !== true) redirect("/admin/login");

  const siteName = text(formData, "site_name", 80);
  const siteUrl = text(formData, "site_url", 200);
  const contactEmail = text(formData, "contact_email", 160);
  const location = text(formData, "location", 200);
  const description = text(formData, "default_description", 160);
  const instagramUrl = text(formData, "instagram_url", 200) || null;
  const facebookUrl = text(formData, "facebook_url", 200) || null;

  if (!siteName || !location || !description || !isAllowedSiteUrl(siteUrl) || !/^\S+@\S+\.\S+$/.test(contactEmail)) {
    redirect("/admin/settings?error=invalid");
  }
  if ([instagramUrl, facebookUrl].some((url) => url && !/^https:\/\/[^\s]+$/i.test(url))) {
    redirect("/admin/settings?error=invalid");
  }

  const { error } = await supabase.from("site_settings").upsert({
    key: "site",
    value: { site_name: siteName, site_url: siteUrl, contact_email: contactEmail, location, default_description: description, instagram_url: instagramUrl, facebook_url: facebookUrl },
    updated_at: new Date().toISOString(),
    updated_by: user.id,
  });
  if (error) redirect("/admin/settings?error=save");
  updateTag("site-settings");
  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?success=1");
}
