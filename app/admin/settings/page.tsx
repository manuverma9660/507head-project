import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { saveSiteSettings } from "./actions";

export const instant = false;
type Props = { searchParams: Promise<{ error?: string; success?: string }> };
const defaults = {
  site_name: "507 Head",
  site_url: "https://507head.com",
  contact_email: "contact@507head.com",
  location: "Chhatargarh tehsil, Bikaner, Rajasthan",
  default_description:
    "507 Head पर हिंदी में समाचार, रिपोर्ट और स्थानीय ज्ञान।",
  instagram_url: "",
  facebook_url: "",
};

export default async function AdminSettingsPage({ searchParams }: Props) {
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
    .from("site_settings")
    .select("value")
    .eq("key", "site")
    .maybeSingle();
  const savedSettings =
    data?.value && typeof data.value === "object" && !Array.isArray(data.value)
      ? (data.value as Partial<typeof defaults>)
      : {};
  const settings = { ...defaults, ...savedSettings };
  const query = await searchParams;
  const fields = [
    ["site_name", "Site name", "text"],
    ["site_url", "Public site URL", "url"],
    ["contact_email", "Contact email", "email"],
    ["location", "Location", "text"],
    ["instagram_url", "Instagram URL", "url"],
    ["facebook_url", "Facebook URL", "url"],
  ] as const;
  return (
    <main className="min-h-screen bg-[#f7f3ed] p-6 text-[#29231e] md:p-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm font-semibold text-[#8a4b1f] hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a4b1f]">
            507 HEAD · Configuration
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Site Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Public identity, contact and SEO defaults.
          </p>
        </header>
        {query.success && (
          <p className="mb-4 rounded-lg bg-green-50 p-3 text-green-800">
            Settings saved.
          </p>
        )}
        {query.error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-red-800">
            Please enter valid required values and HTTPS URLs.
          </p>
        )}
        <form
          action={saveSiteSettings}
          className="space-y-5 rounded-2xl border border-[#e8dac9] bg-white p-6 shadow-sm"
        >
          {fields.map(([name, label, type]) => (
            <label key={name} className="block text-sm font-semibold">
              {label}
              <input
                required={!["instagram_url", "facebook_url"].includes(name)}
                name={name}
                type={type}
                defaultValue={settings[name] ?? ""}
                className="mt-2 w-full rounded-xl border border-[#e5ddd3] px-4 py-3 font-normal"
              />
            </label>
          ))}
          <label className="block text-sm font-semibold">
            Default SEO description
            <textarea
              name="default_description"
              required
              maxLength={160}
              defaultValue={settings.default_description}
              className="mt-2 w-full rounded-xl border border-[#e5ddd3] px-4 py-3 font-normal"
              rows={3}
            />
          </label>
          <button className="rounded-xl bg-[#8a4b1f] px-5 py-3 font-bold text-white">
            Save settings
          </button>
        </form>
      </div>
    </main>
  );
}
