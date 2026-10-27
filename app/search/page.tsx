import type { Metadata } from "next";
import Link from "next/link";
import { getAllPublishedArticles } from "@/lib/content";

export const instant = false;

export const metadata: Metadata = {
  title: "खोजें",
  description: "507 Head पर प्रकाशित लेख खोजें।",
  robots: { index: false, follow: true },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const articles = await getAllPublishedArticles();
  const normalizedQuery = query.toLocaleLowerCase("hi-IN");
  const results = normalizedQuery
    ? articles.filter((article) =>
        [article.title, article.excerpt, article.category_name, ...article.tags]
          .join(" ")
          .toLocaleLowerCase("hi-IN")
          .includes(normalizedQuery),
      )
    : [];

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-5 py-10 text-[#29231e] md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-sm font-semibold text-[#8a4b1f] hover:underline"
        >
          ← होम पेज
        </Link>
        <header className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8a4b1f]">
            507 Head
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">लेख खोजें</h1>
        </header>

        <form className="mt-6 flex gap-3" role="search">
          <label htmlFor="site-search" className="sr-only">
            लेख खोजें
          </label>
          <input
            id="site-search"
            name="q"
            defaultValue={query}
            placeholder="विषय, श्रेणी या शब्द लिखें"
            className="min-h-11 flex-1 rounded-xl border border-[#d8c8b5] bg-[#F7F6EE] px-4 text-sm outline-none focus:border-[#8a4b1f] focus:ring-2 focus:ring-[#245d92]"
          />
          <button className="min-h-11 rounded-xl bg-[#8a4b1f] px-5 text-sm font-bold text-white hover:bg-[#6b3915]">
            खोजें
          </button>
        </form>

        {query && (
          <section className="mt-8" aria-live="polite">
            <p className="text-sm text-gray-600">
              “{query}” के लिए {results.length} परिणाम मिले।
            </p>
            {results.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-[#e7ddd0] bg-[#F7F6EE] p-8 text-center text-sm text-gray-600">
                कोई प्रकाशित लेख नहीं मिला। दूसरा शब्द आज़माएँ।
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {results.map((article) => (
                  <article
                    key={article.id}
                    data-article-href={`/blog/${article.slug}`}
                    className="rounded-2xl border border-[#e7ddd0] bg-[#F7F6EE] p-5 shadow-sm"
                  >
                    <p className="text-xs font-bold text-[#8a4b1f]">
                      {article.category_name}
                    </p>
                    <h2 className="mt-2 text-xl font-bold">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="hover:text-[#8a4b1f]"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {article.excerpt}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
