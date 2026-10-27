import Link from "next/link";
import { Metadata } from "next";
import { getAllPublishedArticles, getCategories } from "@/lib/content";
import { getHomepageInstagramReels } from "@/lib/instagram";
import SocialIcon from "@/components/SocialIcon";
import HeroSlider from "@/components/HeroSlider";
import RemoteArticleImage from "@/components/RemoteArticleImage";
import InstagramReelCarousel from "@/components/InstagramReelCarousel";

export const instant = false;

export const metadata: Metadata = {
  title: "507 Head | हिंदी समाचार, थार मरुस्थल, खेती और जनजीवन",
  description:
    "507 हेड (छतरगढ़, बीकानेर) का प्रमुख डिजिटल पोर्टल। थार रेगिस्तान, नहरी पानी, पारंपरिक खेती, राठी गाय और ग्रामीण विरासत की प्रामाणिक रिपोर्ट।",
  openGraph: {
    title: "507 Head | हिंदी समाचार, थार मरुस्थल, खेती और जनजीवन",
    description:
      "507 हेड (छतरगढ़, बीकानेर) का प्रमुख डिजिटल पोर्टल। थार रेगिस्तान, नहरी पानी, पारंपरिक खेती और ग्रामीण विरासत।",
    locale: "hi_IN",
    type: "website",
  },
};

const INSTAGRAM_URL = "https://www.instagram.com/507head/";
const FACEBOOK_URL = "https://www.facebook.com/507Head/";
const YOUTUBE_URL = "https://www.youtube.com/channel/UC0QF1fncNE4Z8G8ryNa4DiQ";
const WHITE_CATEGORY_BACKGROUND_SLUGS = new Set([
  "farming",
  "wisdom",
  "pashupalan",
]);

// The homepage hero is editorially curated. New articles remain in the
// article listings and never enter this slider automatically.
const HERO_ARTICLE_SLUGS = [
  "thar-registan-507-head-itihas",
  "nahari-kshetra-kheti-unnat-tarike",
  "rathi-gaay-marusthal-ki-kamdhenu",
  "thar-sanskriti-lokgeet-parampara",
  "kisan-mehanat-anubhav-desh-ki-shaan",
];

const fallbackReels = [
  {
    title: "507 हेड — थार रेगिस्तान की अनूठी झलक",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEyTtGBClDFHDUPJL2qK7vosE24ZreCkLg1GYZi5esyw&s=10",
    url: INSTAGRAM_URL,
  },
  {
    title: "थार के धोरों में सूर्यास्त",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQMaA7LGtefXqSnLZwt-N6LgFaXYmXBgy3ff3dMbbVww&s=10",
    url: INSTAGRAM_URL,
  },
  {
    title: "राठी गोवंश की समृद्ध परंपरा",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShUNJzXGSMFEBS2UDR2DIynpv0LU5m1RGEq81msYDZug&s=10",
    url: INSTAGRAM_URL,
  },
  {
    title: "507 हेड — ग्रामीण जीवन की कहानी",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPzlis4w-yX_1kMaJMlCEPEKNeP7JcmUv3UUa5tN9rIg&s=10",
    url: INSTAGRAM_URL,
  },
];

export default async function Home() {
  const [allArticles, instagramReels, categories] = await Promise.all([
    getAllPublishedArticles(),
    getHomepageInstagramReels(),
    getCategories(),
  ]);
  const reels = instagramReels.length > 0
    ? instagramReels
    : fallbackReels.map((reel, index) => ({ ...reel, id: `fallback-${index}` }));
  const featured =
    allArticles.find(
      (article) => article.slug === "thar-registan-507-head-itihas",
    ) ||
    allArticles.find((article) => article.is_featured) ||
    allArticles[0];

  // Latest cards are intentionally separate from the featured story. Do not
  // repeat it as a fallback: when fewer than six posts exist, show fewer cards.
  const seenLatestSlugs = new Set<string>();
  const latestArticles = allArticles
    .filter((article) => {
      if (article.id === featured.id || article.slug === featured.slug)
        return false;
      if (seenLatestSlugs.has(article.slug)) return false;
      seenLatestSlugs.add(article.slug);
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    )
    .slice(0, 6);
  const heroSliderArticles = HERO_ARTICLE_SLUGS.map((slug) =>
    allArticles.find((article) => article.slug === slug),
  ).filter((article): article is (typeof allArticles)[number] => Boolean(article));
  const heroSlides = (heroSliderArticles.length ? heroSliderArticles : [featured]).map((article) => ({
    image: article.featured_image_url,
    title: article.title,
    excerpt: article.excerpt,
    href: `/blog/${article.slug}`,
    category: article.category_name,
  }));
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://507head.com";
  const homepageJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "507 Head",
      url: siteUrl,
      inLanguage: "hi-IN",
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "507 Head",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      email: "info.507head@gmail.com",
    },
  ];

  return (
    <main className="public-page min-h-screen bg-[#fcf9f5] text-[#222222]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageJsonLd).replace(/</g, "\\u003c"),
        }}
      />
{/* Featured Story Hero */}
      <HeroSlider slides={heroSlides} />
      <section className="hidden border-b border-[#e5ddd3] bg-gradient-to-b from-[#f7efe3] to-[#fcf9f5] py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#8a4b1f] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#8a4b1f]">
              प्रमुख समाचार / FEATURED STORY
            </span>
          </div>

          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            {/* Left Content */}
            <div className="space-y-4 md:col-span-6">
              <Link
                href={`/category/${featured.category_slug}`}
                className="inline-block rounded-full bg-[#8a4b1f]/10 px-3.5 py-1 text-xs font-bold text-[#8a4b1f]"
              >
                {featured.category_name}
              </Link>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#222] tracking-tight leading-tight hover:text-[#8a4b1f]">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h1>

              <p className="text-base sm:text-lg text-[#666] leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="flex items-center gap-3 pt-2 text-xs text-[#777]">
                <span className="font-semibold text-[#333]">
                  {featured.author.name}
                </span>
                <span>•</span>
                <span>
                  {new Date(featured.published_at).toLocaleDateString("hi-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>{featured.reading_time_minutes} मिनट पठन</span>
              </div>

              <div className="pt-3">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#8a4b1f] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#6b3915]"
                >
                  पूरा लेख पढ़ें <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="md:col-span-6">
              <Link
                href={`/blog/${featured.slug}`}
                className="group relative block aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#e5ddd3] bg-white shadow-md"
              >
                <RemoteArticleImage
                  src={featured.featured_image_url}
                  alt={featured.featured_image_alt}
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {featured.category_name}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest 6 Stories Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#e5ddd3] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8a4b1f]">
              लेटेस्ट अपडेट्स
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#222] mt-1">
              ताज़ा खबरें और रिपोर्ट
            </h2>
          </div>
          <span className="text-xs font-bold text-[#777]">
            नियमित संपादकीय प्रकाशन
          </span>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
              <article
                key={article.id}
                data-article-href={`/blog/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5ddd3] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <Link
                href={`/blog/${article.slug}`}
                className="relative aspect-[16/9] w-full overflow-hidden bg-[#eee]"
              >
                <RemoteArticleImage
                  src={article.featured_image_url}
                  alt={article.featured_image_alt}
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {article.category_name}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-xs text-[#888]">
                  <span>
                    {new Date(article.published_at).toLocaleDateString(
                      "hi-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </span>
                  <span>•</span>
                  <span>{article.reading_time_minutes} मिनट</span>
                </div>

                <h3 className="text-lg font-bold leading-snug line-clamp-2 text-[#222] group-hover:text-[#8a4b1f]">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#666] line-clamp-3 flex-1">
                  {article.excerpt}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#f0e7dd] pt-4">
                  <span className="text-xs font-medium text-[#777]">
                    {article.author.name}
                  </span>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-xs font-bold text-[#8a4b1f] hover:underline"
                  >
                    पढ़ें →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Reel Thumbnail Strip (Static Thumbnails linking to Instagram) */}
      <section className="border-y border-[#e5ddd3] bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8a4b1f]">
                झलकियाँ • REELS & PHOTOS
              </span>
              <h2 className="text-2xl font-black text-[#222] mt-1">
                507 हेड की तस्वीरें और वीडियो
              </h2>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-bold text-[#8a4b1f] hover:underline hidden sm:inline-flex"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @507head पर फॉलो करें ↗
            </a>
          </div>

          <InstagramReelCarousel reels={reels} />
        </div>
      </section>

      {/* Category Blocks: 3 cards per category */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        {categories.map((cat) => {
          const catArticles = allArticles.filter(
            (a) => a.category_slug === cat.slug,
          );
          if (catArticles.length === 0) return null;

          return (
            <div
              key={cat.slug}
              className={`relative isolate py-10 sm:py-12 ${WHITE_CATEGORY_BACKGROUND_SLUGS.has(cat.slug) ? "before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-white" : ""}`}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#8a4b1f] pb-3">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-1.5 rounded-full bg-[#8a4b1f]" />
                  <h3 className="text-xl sm:text-2xl font-black text-[#222] tracking-tight">
                    {cat.name}
                  </h3>
                </div>
                <Link
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#f7efe3] px-3.5 py-1.5 text-xs font-bold text-[#8a4b1f] transition hover:bg-[#8a4b1f] hover:text-white"
                >
                  <span>सभी खबरें देखें</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {catArticles.slice(0, 3).map((article) => (
                  <article
                    key={article.id}
                    data-article-href={`/blog/${article.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-[#e5ddd3] bg-white transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <Link
                      href={`/blog/${article.slug}`}
                      className="relative aspect-[16/9] w-full overflow-hidden bg-[#eee]"
                    >
                      <RemoteArticleImage
                        src={article.featured_image_url}
                        alt={article.featured_image_alt}
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </Link>

                    <div className="p-5 flex flex-1 flex-col justify-between">
                      <div>
                        <h4 className="text-base font-bold leading-snug line-clamp-2 text-[#222] group-hover:text-[#8a4b1f]">
                          <Link href={`/blog/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h4>
                        <p className="mt-2 text-xs leading-relaxed text-[#666] line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#f0e7dd] pt-3 text-xs">
                        <span className="text-[#888]">
                          {new Date(article.published_at).toLocaleDateString(
                            "hi-IN",
                            { day: "numeric", month: "short" },
                          )}
                        </span>
                        <Link
                          href={`/blog/${article.slug}`}
                          className="font-bold text-[#8a4b1f] hover:underline"
                        >
                          पढ़ें →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Follow Band */}
      <section className="bg-[#6b3915] text-white py-12 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black">507 हेड से जुड़े रहें</h2>
            <p className="mt-1 text-sm text-[#f7efe3]">
              ताज़ा खबरों, कृषि सलाह और स्थानीय अपडेट्स के लिए हमारे सोशल मीडिया
              पर जुड़ें।
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold backdrop-blur-sm transition hover:bg-[#1877F2]/80"
            >
              <SocialIcon name="facebook" className="h-3.5 w-3.5" />
              Facebook ↗
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold backdrop-blur-sm transition hover:bg-gradient-to-r hover:from-[#833ab4] hover:to-[#fd1d1d]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram @507head ↗
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold backdrop-blur-sm transition hover:bg-[#FF0000]/70"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              YouTube Channel ↗
            </a>
          </div>
        </div>
      </section>

      {/* 4-Column Footer */}
</main>
  );
}
