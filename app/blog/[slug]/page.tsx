import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/content";
import ArticleBody from "@/components/ArticleBody";
import ArticleShareRow from "@/components/ArticleShareRow";

export const instant = false;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "लेख नहीं मिला",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://507head.com";
  const canonicalUrl = `${siteUrl}/blog/${article.slug}/`;

  return {
    title: `${article.title} | 507 Head`,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: article.published_at,
      modifiedTime: article.updated_at || article.published_at,
      locale: "hi_IN",
      images: [
        {
          url: article.featured_image_url,
          width: 1200,
          height: 630,
          alt: article.featured_image_alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.featured_image_url],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(
    article.category_slug,
    article.id,
    3,
  );
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://507head.com";
  const currentUrl = `${siteUrl}/blog/${article.slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    image: [article.featured_image_url],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: `${siteUrl}/author/${article.author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "507 Head",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": currentUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "होम",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: article.category_name,
        item: `${siteUrl}/category/${article.category_slug}/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: currentUrl,
      },
    ],
  };

  const formattedDate = new Date(article.published_at).toLocaleDateString(
    "hi-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
  const formattedUpdatedDate = new Date(
    article.updated_at || article.published_at,
  ).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#fcf9f5] text-[#222222]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Header */}
{/* Main Article Container */}
      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="ब्रेडक्रम्ब"
          className="flex items-center gap-2 text-xs sm:text-sm text-[#8a4b1f] mb-6 flex-wrap"
        >
          <Link href="/" className="hover:underline">
            होम
          </Link>
          <span>›</span>
          <Link
            href={`/category/${article.category_slug}`}
            className="hover:underline"
          >
            {article.category_name}
          </Link>
          <span>›</span>
          <span className="text-[#666] line-clamp-1">{article.title}</span>
        </nav>

        {/* Category Pill */}
        <div className="mb-4">
          <Link
            href={`/category/${article.category_slug}`}
            className="inline-block rounded-full bg-[#8a4b1f]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8a4b1f] hover:bg-[#8a4b1f]/20"
          >
            {article.category_name}
          </Link>
        </div>

        {/* Single H1 Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#222] tracking-tight leading-tight mb-5">
          {article.title}
        </h1>

        {/* Standfirst / Excerpt */}
        <p className="text-lg sm:text-xl text-[#555] leading-relaxed mb-6 font-normal">
          {article.excerpt}
        </p>

        {/* Author & Publication Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#e5ddd3] py-4 mb-8 text-sm text-[#666]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F7F4DE] border border-[#e5ddd3] text-lg font-bold text-[#8a4b1f]">
              ✍️
            </div>
            <div>
              <Link
                href={`/author/${article.author.slug || "507-head-team"}`}
                className="block font-bold text-[#222] hover:text-[#8a4b1f] hover:underline"
              >
                {article.author.name}
              </Link>
              <span className="mt-0.5 block text-xs text-[#777]">
                Updated: {formattedUpdatedDate}
              </span>
              <span className="text-xs text-[#777]">
                {formattedDate} • {article.reading_time_minutes} मिनट पठन
              </span>
            </div>
          </div>
        </div>

        {/* 16:9 Hero Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#eee] border border-[#e5ddd3] mb-4 shadow-sm">
          <Image
            src={article.featured_image_url}
            alt={article.featured_image_alt}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
        {(article.featured_image_caption || article.featured_image_credit) && (
          <div className="mb-10 text-center text-xs text-[#777]">
            {article.featured_image_caption && (
              <p className="italic">
                फोटो विवरण: {article.featured_image_caption}
              </p>
            )}
            {article.featured_image_credit && (
              <p className="mt-1 font-semibold not-italic">
                फोटो क्रेडिट: {article.featured_image_credit}
              </p>
            )}
          </div>
        )}

        {/* Semantic Article Body */}
        <div className="space-y-6 text-lg sm:text-[19px] leading-[1.85] text-[#2c2c2c] pt-2">
          <ArticleBody richBody={article.rich_body} fallback={article.body} />
        </div>

        <div className="mt-12">
          <ArticleShareRow title={article.title} url={currentUrl} />
        </div>

        {/* Tags Row */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 border-t border-[#e5ddd3] pt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#888] block mb-3">
              संबंधित विषय (Tags):
            </span>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-[#F7F4DE] border border-[#e5ddd3] px-3 py-1.5 text-xs font-semibold text-[#6b3915]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-12 rounded-2xl border border-[#e5ddd3] bg-[#F7F6EE] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F7F4DE] border border-[#e5ddd3] text-2xl">
            📰
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8a4b1f]">
              लेखक / संपादकीय टीम
            </span>
            <Link
              href={`/author/${article.author.slug || "507-head-team"}`}
              className="group"
            >
              <h3 className="text-xl font-bold text-[#222] mt-1 group-hover:text-[#8a4b1f] group-hover:underline">
                {article.author.name}
              </h3>
            </Link>
            <p className="mt-2 text-sm text-[#666] leading-relaxed">
              {article.author.bio}
            </p>
            <div className="mt-3">
              <Link
                href={`/author/${article.author.slug || "507-head-team"}`}
                className="text-xs font-bold text-[#8a4b1f] hover:underline"
              >
                {article.author.name} के सभी लेख देखें →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 border-t border-[#e5ddd3] pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8a4b1f]">
                  और भी पढ़ें
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222] mt-1">
                  इस विषय से संबंधित अन्य लेख
                </h2>
              </div>
              <Link
                href={`/category/${article.category_slug}`}
                className="text-xs font-bold text-[#8a4b1f] hover:underline"
              >
                सभी देखें →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[#e5ddd3] bg-[#F7F6EE] transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#eee]">
                    <Image
                      src={rel.featured_image_url}
                      alt={rel.featured_image_alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#8a4b1f] block mb-1">
                        {rel.category_name}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2 text-[#222] group-hover:text-[#8a4b1f]">
                        {rel.title}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-[#8a4b1f] mt-4 block">
                      पूरा पढ़ें →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
</main>
  );
}
