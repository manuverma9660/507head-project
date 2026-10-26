import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { INITIAL_ARTICLES } from "@/lib/content";
import ArticleManager from "./ArticleManager";

// This page reads the authenticated Supabase session for every request.
export const instant = false;

export default async function ArticlesPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin" || profile?.is_active !== true) {
    redirect("/admin/login");
  }

  const { data: dbArticles, error } = await supabase
    .from("articles")
    .select("*, categories(id, name, slug)")
    .order("created_at", { ascending: false });

  const CAT_LOOKUP: Record<string, { slug: string; name: string }> = {
    news: { slug: "news", name: "ताज़ा खबरें और रिपोर्ट" },
    farming: { slug: "farming", name: "खेती-बाड़ी" },
    kheti: { slug: "farming", name: "खेती-बाड़ी" },
    pashupalan: { slug: "pashupalan", name: "पशुपालन" },
    kisan: { slug: "kisan", name: "किसान" },
    wisdom: { slug: "wisdom", name: "बुजुर्गों की सीख" },
    history: { slug: "history", name: "इतिहास और विरासत" },
    heritage: { slug: "heritage", name: "सांस्कृतिक विरासत" },
    food: { slug: "food", name: "खान-पान" },
    shiksha: { slug: "news", name: "ताज़ा खबरें और रिपोर्ट" },
    shikhsa: { slug: "news", name: "ताज़ा खबरें और रिपोर्ट" },
  };

  let articlesList = (dbArticles ?? []).map((art) => {
    const cat = art.categories as {
      id?: string;
      name?: string;
      slug?: string;
    } | null;
    const slugKey = (cat?.slug || "").toLowerCase();
    const matched = CAT_LOOKUP[slugKey] || {
      slug: cat?.slug || "news",
      name: cat?.name || "ताज़ा खबरें और रिपोर्ट",
    };
    return {
      ...art,
      category_slug: matched.slug,
      category_name: matched.name,
    };
  });

  // Sync Homepage initial articles into Admin Panel
  const existingSlugs = new Set(articlesList.map((a) => a.slug));
  const missing = INITIAL_ARTICLES.filter((a) => !existingSlugs.has(a.slug));

  if (missing.length > 0) {
    const mappedFallback = missing.map((m) => ({
      id: m.id,
      title: m.title,
      slug: m.slug,
      excerpt: m.excerpt,
      body: Array.isArray(m.body) ? m.body.join("\n\n") : m.body,
      category_slug: m.category_slug,
      category_name: m.category_name,
      status: "published",
      created_at: m.published_at,
      updated_at: m.published_at,
    }));
    articlesList = [...articlesList, ...mappedFallback];
  }

  return (
    <main className="min-h-screen bg-[#f7f3ed] p-6 text-[#29231e] md:p-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm font-semibold text-[#8a4b1f] hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a4b1f]">
              507 HEAD · Content Management
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">लेख</h1>
            <p className="mt-2 text-gray-600">
              लेख बनाएँ, Draft सेव करें और प्रकाशित करें।
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            className="inline-flex items-center rounded-xl bg-[#8a4b1f] px-5 py-3 font-semibold text-white hover:bg-[#6b3915]"
          >
            + नया लेख
          </Link>
        </header>

        {error && articlesList.length === 0 ? (
          <section className="mt-8 rounded-xl border border-red-200 bg-white p-5 text-red-700">
            लेख लोड नहीं हुए: {error.message}
          </section>
        ) : (
          <section className="mt-8">
            <ArticleManager articles={articlesList} />
          </section>
        )}
      </div>
    </main>
  );
}
