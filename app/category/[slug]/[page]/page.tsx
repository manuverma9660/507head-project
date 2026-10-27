import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticlesByCategory, getCategories } from "@/lib/content";

const PAGE_SIZE = 12;

type CategoryPaginationPageProps = {
  params: Promise<{ slug: string; page: string }>;
};

export const instant = false;

export async function generateMetadata({
  params,
}: CategoryPaginationPageProps): Promise<Metadata> {
  const { slug, page } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) return {};

  return {
    title: `${category.name} — पेज ${page}`,
    description: `${category.name} के प्रकाशित लेखों का पेज ${page}।`,
    alternates: { canonical: `/category/${slug}/${page}` },
  };
}

export default async function CategoryPaginationPage({
  params,
}: CategoryPaginationPageProps) {
  const { slug, page } = await params;
  const pageNumber = Number(page);
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category || !Number.isInteger(pageNumber) || pageNumber < 2) notFound();

  const articles = await getArticlesByCategory(slug);
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  if (pageNumber > totalPages) notFound();

  const start = (pageNumber - 1) * PAGE_SIZE;
  const currentArticles = articles.slice(start, start + PAGE_SIZE);

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-5 py-10 text-[#29231e] md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/category/${slug}`}
          className="text-sm font-semibold text-[#8a4b1f] hover:underline"
        >
          ← {category.name}
        </Link>
        <header className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8a4b1f]">
            507 Head · श्रेणी
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            {category.name}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            पेज {pageNumber} / {totalPages}
          </p>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {currentArticles.map((article) => (
            <article
              key={article.id}
              data-article-href={`/blog/${article.slug}`}
              className="overflow-hidden rounded-2xl border border-[#e7ddd0] bg-[#F7F6EE] shadow-sm"
            >
              <Link
                href={`/blog/${article.slug}`}
                className="block p-5 hover:bg-[#fdf7f0]"
              >
                <p className="text-xs font-bold text-[#8a4b1f]">
                  {article.category_name}
                </p>
                <h2 className="mt-2 text-xl font-bold leading-snug">
                  {article.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {article.excerpt}
                </p>
              </Link>
            </article>
          ))}
        </section>

        <nav
          className="mt-10 flex items-center justify-between gap-4"
          aria-label="पेज नेविगेशन"
        >
          <Link
            href={
              pageNumber === 2
                ? `/category/${slug}`
                : `/category/${slug}/${pageNumber - 1}`
            }
            className="rounded-xl border border-[#8a4b1f] px-4 py-2 text-sm font-bold text-[#8a4b1f] hover:bg-[#F7F4DE]"
          >
            ← पिछला पेज
          </Link>
          {pageNumber < totalPages ? (
            <Link
              href={`/category/${slug}/${pageNumber + 1}`}
              className="rounded-xl bg-[#8a4b1f] px-4 py-2 text-sm font-bold text-white hover:bg-[#6b3915]"
            >
              अगला पेज →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </main>
  );
}
