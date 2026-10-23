import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  APPROVED_CATEGORIES,
  getAllPublishedArticles,
  getFeaturedArticle,
} from "@/lib/content";

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

const reels = [
  {
    title: "507 हेड — थार रेगिस्तान की अनूठी झलक",
    image:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    url: INSTAGRAM_URL,
  },
  {
    title: "थार के धोरों में सूर्यास्त",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
    url: INSTAGRAM_URL,
  },
  {
    title: "राठी गोवंश की समृद्ध परंपरा",
    image:
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80",
    url: INSTAGRAM_URL,
  },
  {
    title: "507 हेड — ग्रामीण जीवन की कहानी",
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
    url: INSTAGRAM_URL,
  },
];

export default async function Home() {
  const allArticles = await getAllPublishedArticles();
  const featured = await getFeaturedArticle();
  
  const latestArticles = allArticles
    .filter((a) => a.id !== featured.id)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-[#fcf9f5] text-[#222222]">
      {/* Topline Banner */}
      <div className="bg-[#6b3915] px-4 py-2 text-center text-xs sm:text-sm font-medium text-white tracking-wide">
        507 HEAD — अपनी मिट्टी, अपनी पहचान, अपनी कहानियाँ • छतरगढ़, बीकानेर
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 border-b border-[#e5ddd3] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8a4b1f] text-lg font-black text-white shadow-sm">
              507
            </span>
            <span className="leading-tight">
              <strong className="block text-2xl font-black text-[#222] tracking-tight">
                507 हेड
              </strong>
              <small className="text-xs text-[#777] font-semibold">
                जल, प्रकृति और जनजीवन
              </small>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold text-[#444]">
            <Link href="/" className="text-[#8a4b1f] font-bold">
              होम
            </Link>
            {APPROVED_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="hover:text-[#8a4b1f] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Social Icons & Admin Link */}
          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1877F2]/10 text-[#1877F2] transition hover:bg-[#1877F2] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E1306C]/10 text-[#E1306C] transition hover:bg-gradient-to-br hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF0000]/10 text-[#FF0000] transition hover:bg-[#FF0000] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

          </div>
        </div>

        {/* Mobile Horizontal Category Scroll */}
        <div className="xl:hidden flex items-center gap-3 overflow-x-auto border-t border-[#f0e7dd] px-4 py-2.5 text-xs font-bold text-[#555] no-scrollbar">
          <Link href="/" className="shrink-0 text-[#8a4b1f]">
            होम
          </Link>
          {APPROVED_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="shrink-0 hover:text-[#8a4b1f]"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </header>

      {/* Featured Story Hero */}
      <section className="border-b border-[#e5ddd3] bg-gradient-to-b from-[#f7efe3] to-[#fcf9f5] py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#8a4b1f] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#8a4b1f]">
              प्रमुख समाचार / FEATURED STORY
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <Link
                href={`/category/${featured.category_slug}`}
                className="inline-block rounded-full bg-[#8a4b1f]/10 px-3.5 py-1 text-xs font-bold text-[#8a4b1f]"
              >
                {featured.category_name}
              </Link>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#222] tracking-tight leading-tight hover:text-[#8a4b1f]">
                <Link href={`/blog/${featured.slug}`}>
                  {featured.title}
                </Link>
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
            <div className="lg:col-span-6">
              <Link
                href={`/blog/${featured.slug}`}
                className="group relative block aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#e5ddd3] bg-white shadow-md"
              >
                <Image
                  src={featured.featured_image_url}
                  alt={featured.featured_image_alt}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
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
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
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
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5ddd3] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <Link
                href={`/blog/${article.slug}`}
                className="relative aspect-[16/9] w-full overflow-hidden bg-[#eee]"
              >
                <Image
                  src={article.featured_image_url}
                  alt={article.featured_image_alt}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {article.category_name}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-2 text-xs text-[#888]">
                  <span>
                    {new Date(article.published_at).toLocaleDateString("hi-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span>{article.reading_time_minutes} मिनट</span>
                </div>

                <h3 className="text-lg font-bold leading-snug line-clamp-2 text-[#222] group-hover:text-[#8a4b1f]">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
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
      <section className="bg-[#f7efe3] border-y border-[#e5ddd3] py-12">
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="inline">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @507head पर फॉलो करें ↗
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {reels.map((reel) => (
              <a
                key={reel.title}
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[9/16] overflow-hidden rounded-xl border border-[#e5ddd3] bg-black shadow-sm"
              >
                <Image
                  src={reel.image}
                  alt={reel.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover opacity-85 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-lg">▶</span>
                  <p className="mt-1 text-xs font-bold line-clamp-2 leading-tight">
                    {reel.title}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Category Blocks: 3 cards per category */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-12">

        {APPROVED_CATEGORIES.map((cat) => {
          const catArticles = allArticles.filter(
            (a) => a.category_slug === cat.slug
          );
          if (catArticles.length === 0) return null;

          return (
            <div key={cat.slug} className="pt-6">
              <div className="mb-6 flex items-center justify-between border-b-2 border-[#8a4b1f] pb-3">
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
                    className="group flex flex-col overflow-hidden rounded-xl border border-[#e5ddd3] bg-white transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <Link
                      href={`/blog/${article.slug}`}
                      className="relative aspect-[16/9] w-full overflow-hidden bg-[#eee]"
                    >
                      <Image
                        src={article.featured_image_url}
                        alt={article.featured_image_alt}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 33vw"
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
                            { day: "numeric", month: "short" }
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
              ताज़ा खबरों, कृषि सलाह और स्थानीय अपडेट्स के लिए हमारे सोशल मीडिया पर जुड़ें।
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold backdrop-blur-sm transition hover:bg-[#1877F2]/80"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook ↗
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold backdrop-blur-sm transition hover:bg-gradient-to-r hover:from-[#833ab4] hover:to-[#fd1d1d]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram @507head ↗
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-xs font-bold backdrop-blur-sm transition hover:bg-[#FF0000]/70"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube Channel ↗
            </a>
          </div>
        </div>
      </section>

      {/* 4-Column Footer */}
      <footer className="border-t border-[#e5ddd3] bg-white pt-14 pb-8 text-[#555]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-[#f0e7dd]">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8a4b1f] text-base font-black text-white">
                507
              </span>
              <span className="leading-tight">
                <strong className="block text-xl font-black text-[#222]">
                  507 हेड
                </strong>
                <small className="text-xs text-[#777]">
                  जल, प्रकृति और जनजीवन
                </small>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#666]">
              बीकानेर के छतरगढ़ क्षेत्र से संचालित स्वतंत्र हिंदी न्यूज़ पोर्टल। थार रेगिस्तान, किसान, पशुपालन और मरुस्थलीय विरासत की सच्ची आवाज।
            </p>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-bold text-[#222] text-sm mb-4">प्रमुख श्रेणियां</h4>
            <ul className="space-y-2 text-xs">
              {APPROVED_CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="hover:text-[#8a4b1f]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: 507 Head Links */}
          <div>
            <h4 className="font-bold text-[#222] text-sm mb-4">507 Head लिंक</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-[#8a4b1f]">
                  हमारे बारे में
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#8a4b1f]">
                  संपर्क करें
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#8a4b1f]">
                  गोपनीयता नीति
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#8a4b1f]">
                  नियम एवं शर्तें
                </Link>
              </li>

            </ul>
          </div>

          {/* Col 4: Contact / Address */}
          <div>
            <h4 className="font-bold text-[#222] text-sm mb-4">कार्यालय व संपर्क</h4>
            <p className="text-xs text-[#666] leading-relaxed">
              507 Head संपादकीय डेस्क,<br />
              छतरगढ़ तहसील, जिला बीकानेर,<br />
              राजस्थान — 334021
            </p>
            <p className="mt-3 text-xs text-[#8a4b1f] font-semibold">
              ईमेल: contact@507head.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777]">
          <p>© 2026 507 हेड। सर्वाधिकार सुरक्षित।</p>
          <p>
            डिजिटल राजस्थान • ग्रामीण पत्रकारिता की नई दिशा
          </p>
        </div>
      </footer>
    </main>
  );
}
