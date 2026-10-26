import type { Metadata } from "next";
import "@fontsource/mukta/400.css";
import "@fontsource/mukta/700.css";
import "./globals.css";
import { getCategories } from "@/lib/content";
import { getPublicSiteSettings } from "@/lib/site-settings";
import { Analytics } from "@vercel/analytics/next";
import PublicSiteChrome from "@/components/PublicSiteChrome";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  const siteUrl = /^https:\/\//.test(settings.site_url)
    ? settings.site_url
    : "https://507head.com";
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.site_name,
      template: `%s | ${settings.site_name}`,
    },
    description: settings.default_description,
    applicationName: settings.site_name,
    openGraph: {
      title: settings.site_name,
      description: settings.default_description,
      siteName: settings.site_name,
      locale: "hi_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.site_name,
      description: settings.default_description,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = await getCategories();

  return (
    <html lang="hi">
      <body>
        <PublicSiteChrome
          categories={categories.map(({ slug, name }) => ({ slug, name }))}
        >
          {children}
        </PublicSiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
