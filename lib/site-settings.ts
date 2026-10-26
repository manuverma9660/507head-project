import { cacheLife, cacheTag } from "next/cache";

export type PublicSiteSettings = {
  site_name: string;
  site_url: string;
  contact_email: string;
  location: string;
  default_description: string;
  instagram_url: string;
  facebook_url: string;
};

const fallback: PublicSiteSettings = {
  site_name: "507 Head",
  site_url: "https://507head.com",
  contact_email: "contact@507head.com",
  location: "Chhatargarh tehsil, Bikaner, Rajasthan",
  default_description: "507 Head - Hindi news, reports and local knowledge.",
  instagram_url: "",
  facebook_url: "",
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag("site-settings");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return fallback;

  try {
    const response = await fetch(
      `${url}/rest/v1/site_settings?key=eq.site&select=value`,
      {
        headers: { apikey: key },
      },
    );
    if (!response.ok) return fallback;
    const rows = (await response.json()) as Array<{ value?: unknown }>;
    const value = rows[0]?.value;
    if (!value || typeof value !== "object" || Array.isArray(value))
      return fallback;
    return { ...fallback, ...(value as Partial<PublicSiteSettings>) };
  } catch {
    return fallback;
  }
}
