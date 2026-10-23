"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdministrator() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("staff_profiles").select("role, is_active").eq("user_id", user.id).maybeSingle();
  if (profile?.role !== "admin" || profile.is_active !== true) redirect("/admin/login");
  return { supabase, user };
}

function normalisePath(value: FormDataEntryValue | null) {
  const path = typeof value === "string" ? value.trim() : "";
  if (!path || !path.startsWith("/") || path.startsWith("//") || /[?#]/.test(path)) return null;
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export async function createRedirect(formData: FormData) {
  const { supabase, user } = await requireAdministrator();
  const sourcePath = normalisePath(formData.get("source_path"));
  const destinationPath = normalisePath(formData.get("destination_path"));
  const statusCode = formData.get("status_code") === "302" ? 302 : 301;
  if (!sourcePath || !destinationPath || sourcePath === destinationPath) redirect("/admin/redirects?error=invalid");
  if (sourcePath.startsWith("/admin") || destinationPath.startsWith("/admin")) redirect("/admin/redirects?error=protected");

  const { data: reverse } = await supabase.from("redirects").select("id").eq("source_path", destinationPath).eq("destination_path", sourcePath).maybeSingle();
  if (reverse) redirect("/admin/redirects?error=loop");

  const { error } = await supabase.from("redirects").insert({ source_path: sourcePath, destination_path: destinationPath, status_code: statusCode, created_by: user.id });
  if (error) redirect("/admin/redirects?error=save");
  revalidatePath("/admin/redirects");
  redirect("/admin/redirects?success=created");
}

export async function deleteRedirect(formData: FormData) {
  const { supabase } = await requireAdministrator();
  const id = formData.get("id");
  if (typeof id !== "string" || !id) redirect("/admin/redirects?error=invalid");
  const { error } = await supabase.from("redirects").delete().eq("id", id);
  if (error) redirect("/admin/redirects?error=delete");
  revalidatePath("/admin/redirects");
  redirect("/admin/redirects?success=deleted");
}
