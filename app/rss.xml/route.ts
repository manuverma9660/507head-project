import { NextResponse } from "next/server";
import { getAllPublishedArticles } from "@/lib/content";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://507head.com";
  const articles = await getAllPublishedArticles();

  const itemsXml = articles
    .map((article) => {
      const link = `${siteUrl}/blog/${article.slug}/`;
      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <category><![CDATA[${article.category_name}]]></category>
      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
      <author>${article.author.name}</author>
    </item>`;
    })
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>507 Head - हिंदी समाचार और ज्ञान पोर्टल</title>
    <link>${siteUrl}</link>
    <description>507 हेड (छतरगढ़, बीकानेर) का प्रमुख डिजिटल पोर्टल। थार मरुस्थल, खेती, राठी गाय और जनजीवन।</description>
    <language>hi-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
