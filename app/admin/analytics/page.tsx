import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function AdminAnalyticsPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin" || profile?.is_active !== true) {
    redirect("/admin/login");
  }

  // Fetch analytics data from Supabase
  const [totalRes, publishedRes, draftRes, recentRes, categoryRes] =
    await Promise.all([
      supabase.from("articles").select("id", { count: "exact", head: true }),
      supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("articles")
        .select("id", { count: "exact", head: true })
        .eq("status", "draft"),
      supabase
        .from("articles")
        .select("title, status, created_at, category_slug")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("articles")
        .select("category_slug")
        .eq("status", "published"),
    ]);

  const total = totalRes.count ?? 0;
  const published = publishedRes.count ?? 0;
  const draft = draftRes.count ?? 0;
  const recentArticles = recentRes.data ?? [];

  // Category counts
  const categoryCounts: Record<string, number> = {};
  for (const a of categoryRes.data ?? []) {
    if (a.category_slug) {
      categoryCounts[a.category_slug] =
        (categoryCounts[a.category_slug] ?? 0) + 1;
    }
  }
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const publishRate = total > 0 ? Math.round((published / total) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#f7f3ed] p-6 text-[#29231e] md:p-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm font-semibold text-[#8a4b1f] hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>

        <header className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8a4b1f]">
            507 HEAD · Insights
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">Analytics</h1>
          <p className="mt-2 text-sm text-gray-600">
            वेबसाइट की सामग्री और प्रकाशन का विश्लेषण।
          </p>
        </header>

        {/* Stats Row */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "कुल लेख",
              value: total,
              icon: "📰",
              color: "text-[#8a4b1f]",
              bg: "bg-[#f7efe3]",
            },
            {
              label: "प्रकाशित",
              value: published,
              icon: "✅",
              color: "text-green-700",
              bg: "bg-green-50",
            },
            {
              label: "ड्राफ्ट",
              value: draft,
              icon: "✏️",
              color: "text-yellow-700",
              bg: "bg-yellow-50",
            },
            {
              label: "Publish Rate",
              value: `${publishRate}%`,
              icon: "📈",
              color: "text-blue-700",
              bg: "bg-blue-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-[#e8dac9] bg-white p-5 shadow-sm"
            >
              <div
                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} text-xl`}
              >
                {s.icon}
              </div>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-sm text-[#786b5e]">{s.label}</p>
            </div>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Articles */}
          <div className="rounded-2xl border border-[#e8dac9] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">हाल के लेख</h2>
            {recentArticles.length === 0 ? (
              <p className="text-sm text-gray-500">कोई लेख नहीं मिला।</p>
            ) : (
              <ul className="space-y-3">
                {recentArticles.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-3 border-b border-[#f0e7dd] pb-3 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-[#29231e]">
                        {a.title || "बिना शीर्षक"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.category_slug ?? "—"} ·{" "}
                        {String(a.created_at ?? "").slice(0, 10)}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                        a.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {a.status === "published" ? "Published" : "Draft"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/admin/articles"
              className="mt-4 inline-block text-xs font-bold text-[#8a4b1f] hover:underline"
            >
              सभी लेख देखें →
            </Link>
          </div>

          {/* Category Distribution */}
          <div className="rounded-2xl border border-[#e8dac9] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold">श्रेणी वितरण</h2>
            {topCategories.length === 0 ? (
              <p className="text-sm text-gray-500">कोई डेटा नहीं।</p>
            ) : (
              <ul className="space-y-3">
                {topCategories.map(([slug, count]) => (
                  <li key={slug}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold capitalize">
                        {slug.replace(/-/g, " ")}
                      </span>
                      <span className="font-bold text-[#8a4b1f]">
                        {count} लेख
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#f0e7dd]">
                      <div
                        className="h-full rounded-full bg-[#8a4b1f]"
                        style={{
                          width: `${Math.round((count / published) * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Note about page views */}
        <div className="mt-6 rounded-2xl border border-[#e8dac9] bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold">Page Views Analytics</h2>
          <p className="text-sm text-gray-600">
            Real-time page views tracking के लिए{" "}
            <strong>Google Analytics</strong> या{" "}
            <strong>Vercel Analytics</strong> integrate करें। अभी Supabase
            content analytics दिखाया जा रहा है।
          </p>
        </div>
      </div>
    </main>
  );
}
