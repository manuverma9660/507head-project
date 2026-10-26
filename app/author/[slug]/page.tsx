import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  getAuthorBySlug,
  getArticlesByAuthor,
} from "@/lib/content";

export const instant = false;

interface AuthorPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: "लेखक नहीं मिले",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://507head.com";
  const canonicalUrl = `${siteUrl}/author/${author.slug}/`;

  return {
    title: `${author.name} — लेखक प्रोफाइल | 507 Head`,
    description: author.bio,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${author.name} | 507 Head`,
      description: author.bio,
      url: canonicalUrl,
      type: "profile",
      locale: "hi_IN",
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const articles = await getArticlesByAuthor(author.slug);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio,
    image: author.avatar_url || undefined,
    url: `https://507head.com/author/${author.slug}/`,
    worksFor: {
      "@type": "NewsMediaOrganization",
      name: "507 Head",
      url: "https://507head.com",
    },
  };

  return (
    <main className="min-h-screen bg-[#fcf9f5] text-[#222222]">
      {/* Schema.org Person JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* Main Header */}
{/* Author Hero Profile Header */}
      <section className="border-b border-[#e5ddd3] bg-gradient-to-b from-[#f7efe3] to-[#fcf9f5] py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-[#777]">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link href="/" className="hover:text-[#8a4b1f]">
                  होम
                </Link>
              </li>
              <li>›</li>
              <li>
                <span className="font-semibold text-[#333]">लेखक</span>
              </li>
              <li>›</li>
              <li className="text-[#8a4b1f] font-semibold">{author.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Author Avatar */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-2 border-[#8a4b1f]/20 bg-white shadow-md">
              <Image
                src={
                  author.avatar_url ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                }
                alt={author.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>

            {/* Author Info */}
            <div className="space-y-3 flex-1">
              <div>
                <span className="inline-block rounded-full bg-[#8a4b1f]/10 px-3 py-0.5 text-xs font-bold text-[#8a4b1f]">
                  507 HEAD • लेखक / Editorial
                </span>
                <h1 className="mt-2 text-3xl sm:text-4xl font-black text-[#222]">
                  {author.name}
                </h1>
              </div>

              <p className="text-base text-[#555] leading-relaxed max-w-2xl">
                {author.bio}
              </p>

              <div className="pt-1 flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-[#777]">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#8a4b1f]">📰</span>
                  {articles.length} प्रकाशित लेख
                </span>
                <span>•</span>
                <span className="text-green-700">सत्यापित लेखक</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Articles Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 border-b-2 border-[#8a4b1f] pb-3">
          <h2 className="text-2xl font-black text-[#222]">
            {author.name} द्वारा लिखे गए लेख ({articles.length})
          </h2>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-[#e5ddd3] bg-white p-12 text-center">
            <p className="text-base text-gray-600">
              इस लेखक द्वारा अभी कोई लेख प्रकाशित नहीं हुआ है।
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-xl bg-[#8a4b1f] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#6b3915]"
            >
              होमपेज पर जाएँ
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                data-article-href={`/blog/${article.slug}`}
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
                    <span className="text-xs font-semibold text-[#8a4b1f]">
                      {article.category_name}
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
        )}
      </section>
</main>
  );
}
