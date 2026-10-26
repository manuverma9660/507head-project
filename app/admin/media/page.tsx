import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import MediaLibraryClient, { type MediaAsset } from "./MediaLibraryClient";

export const instant = false;

export default async function AdminMediaPage() {
  await connection();
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
  const { data } = await supabase
    .from("media_assets")
    .select(
      "id, public_id, url, width, height, bytes, format, original_filename, alt_text, created_at",
    )
    .order("created_at", { ascending: false });
  const mediaFiles: MediaAsset[] = (data ?? []) as MediaAsset[];
  return (
    <main className="min-h-screen bg-[#f7f3ed] p-6 text-[#29231e] md:p-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm font-semibold text-[#8a4b1f] hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8a4b1f]">
            507 HEAD · Media
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Media Library</h1>
          <p className="mt-2 text-sm text-gray-600">
            Images Cloudinary में सुरक्षित हैं, और उनकी जानकारी Supabase में
            save होती है।
          </p>
        </header>
        <MediaLibraryClient initialFiles={mediaFiles} />
      </div>
    </main>
  );
}
