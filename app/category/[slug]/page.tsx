import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { APPROVED_CATEGORIES, getArticlesByCategory } from "@/lib/content";

export const instant = false;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = APPROVED_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: "श्रेणी नहीं मिली",
    };
  }

  return {
    title: `${category.name} | 507 Head`,
    description: category.description,
    openGraph: {
      title: `${category.name} | 507 Head`,
      description: category.description,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = APPROVED_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(slug);

  return (
    <main className="min-h-screen bg-[#fcf9f5] text-[#222222]">
      {/* Header */}
      <header className="border-b border-[#e5ddd3] bg-white sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8a4b1f] text-base font-black text-white">
              507
            </span>
            <span className="leading-tight">
              <strong className="block text-xl font-black text-[#222]">507 हेड</strong>
              <small className="text-xs text-[#666]">जल, प्रकृति और जनजीवन</small>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link href="/" className="hover:text-[#8a4b1f]">होम</Link>
            {APPROVED_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className={c.slug === slug ? "text-[#8a4b1f] font-bold" : "hover:text-[#8a4b1f]"}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Category Hero Banner */}
      <section className="bg-[#f7efe3] border-b border-[#e5ddd3] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-[#8a4b1f] mb-4">
            <Link href="/" className="hover:underline">होम</Link>
            <span>›</span>
            <span>श्रेणियां</span>
            <span>›</span>
            <span className="font-bold">{category.name}</span>
          </div>

          <span className="inline-block rounded-full bg-[#8a4b1f]/10 px-3 py-1 text-xs font-bold text-[#8a4b1f] mb-3">
            विषय सूची · 507 HEAD
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#222] tracking-tight">
            {category.name}
          </h1>

          <p className="mt-4 max-w-3xl text-base sm:text-lg text-[#666] leading-relaxed">
            {category.description}
          </p>

          <div className="mt-4 text-xs font-semibold text-[#8a4b1f]">
            कुल {articles.length} प्रकाशित लेख
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#e5ddd3] bg-white p-12 text-center">
            <span className="text-4xl mb-4 block">📰</span>
            <h2 className="text-xl font-bold">इस श्रेणी में अभी कोई लेख उपलब्ध नहीं है</h2>
            <p className="mt-2 text-[#666] text-sm">
              संपादकीय टीम द्वारा इस श्रेणी में जल्द ही नए शोधपूर्ण लेख जोड़े जाएंगे।
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-[#8a4b1f] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6b3915]"
            >
              होमपेज पर वापस जाएँ
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5ddd3] bg-white transition hover:-translate-y-1 hover:shadow-lg"
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
                  <div className="flex items-center gap-2 text-xs text-[#888] mb-3">
                    <span>{new Date(article.published_at).toLocaleDateString("hi-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>•</span>
                    <span>{article.reading_time_minutes} मिनट पठन</span>
                  </div>

                  <h2 className="text-xl font-bold leading-snug line-clamp-2 text-[#222] group-hover:text-[#8a4b1f]">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-[#666] line-clamp-3 flex-1">
                    {article.excerpt}
                  </p>

                  <div className="mt-5 border-t border-[#f0e7dd] pt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#777]">
                      द्वारा: {article.author.name}
                    </span>
                    <Link
                      href={`/blog/${article.slug}`}
                      className="text-xs font-bold text-[#8a4b1f] hover:underline"
                    >
                      पूरा पढ़ें →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5ddd3] bg-white py-10 text-center text-sm text-[#666]">
        <div className="mx-auto max-w-7xl px-4">
          <p>© 2026 507 हेड। सर्वाधिकार सुरक्षित।</p>
          <div className="mt-3 flex justify-center gap-5 text-xs">
            <Link href="/" className="hover:text-[#8a4b1f]">होम</Link>
            <Link href="/about" className="hover:text-[#8a4b1f]">हमारे बारे में</Link>
            <Link href="/contact" className="hover:text-[#8a4b1f]">संपर्क</Link>
            <Link href="/privacy-policy" className="hover:text-[#8a4b1f]">गोपनीयता नीति</Link>
            <Link href="/terms" className="hover:text-[#8a4b1f]">नियम और शर्तें</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
