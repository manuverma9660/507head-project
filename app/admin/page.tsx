import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { INITIAL_ARTICLES } from "@/lib/content";
import { logout } from "./actions";
export const instant = false;
const sections = [
  {
    title: "Articles",
    description: "लेख बनाएँ, एडिट करें और प्रकाशित करें।",
    href: "/admin/articles",
    icon: "📰",
  },
  {
    title: "Categories",
    description: "समाचार और अन्य श्रेणियाँ मैनेज करें।",
    href: "/admin/categories",
    icon: "📂",
  },
  {
    title: "Authors & Staff",
    description: "लेखकों और टीम का प्रबंधन करें।",
    href: "/admin/authors",
    icon: "👥",
  },
  {
    title: "Media Library",
    description: "लेखों की इमेज और मीडिया मैनेज करें।",
    href: "/admin/media",
    icon: "🖼️",
  },
  {
    title: "Site Settings",
    description: "वेबसाइट की सेटिंग्स मैनेज करें।",
    href: "/admin/settings",
    icon: "⚙️",
  },
  {
    title: "Analytics",
    description: "वेबसाइट के आँकड़े देखें।",
    href: "/admin/analytics",
    icon: "📊",
  },
  {
    title: "Redirects",
    description: "Manage safe 301 and 302 redirects for old URLs.",
    href: "/admin/redirects",
    icon: "↪️",
  },
  {
    title: "Contact Inbox",
    description: "Read messages submitted from the public contact form.",
    href: "/admin/contact-submissions",
    icon: "✉️",
  },
];

export default async function AdminDashboardPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const { data: profile, error } = await supabase
    .from("staff_profiles")
    .select("display_name, role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (
    error ||
    !profile ||
    profile.role !== "admin" ||
    profile.is_active !== true
  ) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  const displayName = profile.display_name || user.email || "Administrator";

  const [dbArticlesRes, publishedRes, draftRes] = await Promise.all([
    supabase.from("articles").select("slug"),
    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("articles")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
  ]);

  const dbSlugs = new Set((dbArticlesRes.data ?? []).map((a) => a.slug));
  const missingCount = INITIAL_ARTICLES.filter(
    (a) => !dbSlugs.has(a.slug),
  ).length;

  const totalCount = (dbArticlesRes.data?.length ?? 0) + missingCount;
  const publishedCount = (publishedRes.count ?? 0) + missingCount;
  const draftCount = draftRes.count ?? 0;

  const stats = [
    {
      title: "Total Articles",
      subtitle: "कुल लेख",
      icon: "📰",
      count: totalCount,
      color: "text-[#8a4b1f]",
      bg: "bg-[#f7efe3]",
    },
    {
      title: "Published",
      subtitle: "प्रकाशित लेख",
      icon: "✅",
      count: publishedCount,
      color: "text-green-700",
      bg: "bg-green-50",
    },
    {
      title: "Drafts",
      subtitle: "ड्राफ्ट लेख",
      icon: "✏️",
      count: draftCount,
      color: "text-yellow-700",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7efe3] text-[#29231e]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6d8c7] bg-white px-5 py-5 md:px-10">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8a4b1f] text-lg font-black text-white">
            507
          </span>
          <span>
            <span className="block text-xl font-black tracking-wide">HEAD</span>
            <span className="text-xs text-[#786b5e]">
              Content Management System
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold">{displayName}</p>
            <p className="text-xs capitalize text-[#786b5e]">{profile.role}</p>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-[#8a4b1f] px-4 py-2.5 text-sm font-bold text-[#8a4b1f] transition hover:bg-[#8a4b1f] hover:text-white"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 md:px-10 md:py-12">
        <section className="mb-9">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#8a4b1f]">
            Administration
          </p>
          <h1 className="text-3xl font-black md:text-4xl">Admin Dashboard</h1>
          <p className="mt-3 text-sm text-[#71665b] md:text-base">
            स्वागत है, {displayName}. यहाँ से अपनी वेबसाइट मैनेज करें।
          </p>
        </section>

        <section className="mb-10 grid gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#e8dac9] bg-white p-6 shadow-sm"
            >
              <div
                className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${item.bg} text-2xl`}
              >
                {item.icon}
              </div>
              <p className={`text-4xl font-black ${item.color}`}>
                {item.count}
              </p>
              <h2 className="mt-1 font-bold text-[#29231e]">{item.title}</h2>
              <p className="mt-1 text-sm text-[#786b5e]">{item.subtitle}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-extrabold">Manage Website</h2>
            <p className="mt-1 text-sm text-[#786b5e]">
              वेबसाइट के अलग-अलग सेक्शन मैनेज करें।
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                className="group rounded-2xl border border-[#e8dac9] bg-white p-6 transition hover:-translate-y-1 hover:border-[#8a4b1f] hover:shadow-md"
              >
                <div className="mb-4 text-3xl">{section.icon}</div>
                <h3 className="font-bold group-hover:text-[#8a4b1f]">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#786b5e]">
                  {section.description}
                </p>
                <span className="mt-5 inline-block text-sm font-bold text-[#8a4b1f]">
                  Open section →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="mt-12 border-t border-[#e6d8c7] pt-5 text-xs text-[#786b5e]">
          507 HEAD · Secure Admin Panel
        </footer>
      </div>
    </main>
  );
}
