import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  getArticleBySlug,
  getRelatedArticles,
  APPROVED_CATEGORIES,
} from "@/lib/content";
import ArticleBody from "@/components/ArticleBody";
import SocialIcon from "@/components/SocialIcon";
import ArticleShareRow from "@/components/ArticleShareRow";
import CopyArticleLinkButton from "@/components/CopyArticleLinkButton";

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
      <header className="border-b border-[#e5ddd3] bg-white sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8a4b1f] text-base font-black text-white">
              507
            </span>
            <span className="leading-tight">
              <strong className="block text-xl font-black text-[#222]">
                507 हेड
              </strong>
              <small className="text-xs text-[#666]">
                जल, प्रकृति और जनजीवन
              </small>
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold">
            <Link href="/" className="hover:text-[#8a4b1f]">
              होम
            </Link>
            {APPROVED_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={
                  c.slug === article.category_slug
                    ? "text-[#8a4b1f] font-bold"
                    : "hover:text-[#8a4b1f]"
                }
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
        <nav
          aria-label="श्रेणियाँ"
          className="flex snap-x snap-mandatory items-center gap-3 overflow-x-auto border-t border-[#f0e7dd] px-4 py-2.5 text-xs font-bold text-[#555] xl:hidden"
        >
          <Link href="/" className="shrink-0 snap-start text-[#8a4b1f]">
            होम
          </Link>
          {APPROVED_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`shrink-0 snap-start ${c.slug === article.category_slug ? "text-[#8a4b1f]" : "hover:text-[#8a4b1f]"}`}
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </header>

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
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7efe3] border border-[#e5ddd3] text-lg font-bold text-[#8a4b1f]">
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

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-[#888] mr-1 hidden sm:inline">
              शेयर करें:
            </span>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " - " + currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="व्हाट्सएप पर शेयर करें"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#222] bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#f5f5f5]"
            >
              <SocialIcon name="whatsapp" className="h-5 w-5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="फेसबुक पर शेयर करें"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#222] bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#f5f5f5]"
            >
              <SocialIcon name="facebook" className="h-5 w-5" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X पर शेयर करें"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#222] bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#f5f5f5]"
            >
              <SocialIcon name="x" className="h-5 w-5" />
            </a>
            <CopyArticleLinkButton url={currentUrl} />
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
                  className="rounded-lg bg-[#f7efe3] border border-[#e5ddd3] px-3 py-1.5 text-xs font-semibold text-[#6b3915]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio Box */}
        <div className="mt-12 rounded-2xl border border-[#e5ddd3] bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f7efe3] border border-[#e5ddd3] text-2xl">
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
                  className="group flex flex-col overflow-hidden rounded-xl border border-[#e5ddd3] bg-white transition hover:-translate-y-1 hover:shadow-md"
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

      {/* Footer */}
      <footer className="border-t border-[#e5ddd3] bg-white py-10 text-center text-sm text-[#666] mt-16">
        <div className="mx-auto max-w-7xl px-4">
          <p>© 2026 507 हेड। सर्वाधिकार सुरक्षित।</p>
          <div className="mt-3 flex justify-center gap-5 text-xs">
            <Link href="/" className="hover:text-[#8a4b1f]">
              होम
            </Link>
            <Link href="/about" className="hover:text-[#8a4b1f]">
              हमारे बारे में
            </Link>
            <Link href="/contact" className="hover:text-[#8a4b1f]">
              संपर्क
            </Link>
            <Link href="/privacy-policy" className="hover:text-[#8a4b1f]">
              गोपनीयता नीति
            </Link>
            <Link href="/terms" className="hover:text-[#8a4b1f]">
              नियम और शर्तें
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
