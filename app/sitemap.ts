import { MetadataRoute } from "next";
import { getAllPublishedArticles, getCategories } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://507head.com";
  const [articles, categories] = await Promise.all([getAllPublishedArticles(), getCategories()]);

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/blog/${article.slug}/`,
    lastModified: new Date(article.updated_at || article.published_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map(
    (cat) => ({
      url: `${siteUrl}/category/${cat.slug}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    })
  );

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy-policy/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  return [...staticEntries, ...categoryEntries, ...articleEntries];
}
