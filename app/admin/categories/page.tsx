import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/content";
import { createCategory, syncApprovedCategories } from "./actions";
import CategoryStatusNotice from "./CategoryStatusNotice";

export const instant = false;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category_status?: string }>;
}) {
  await connection();
  const { category_status } = await searchParams;
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

  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-[#f7f3ed] p-6 text-[#29231e] md:p-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin"
          className="mb-6 inline-block text-sm font-semibold text-[#8a4b1f] hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>

        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a4b1f]">
              507 HEAD · Categories
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Category Management
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              507 Head की 7 स्वीकृत एवं स्थायी श्रेणियां (Phase 1 Fixed Slugs).
            </p>
          </div>
          <form action={syncApprovedCategories}>
            <button
              type="submit"
              className="rounded-xl bg-[#8a4b1f] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#6b3915]"
            >
              श्रेणियों को Supabase से मिलाएँ
            </button>
          </form>
        </header>

        <CategoryStatusNotice status={category_status} />

        <section className="mb-8 hidden rounded-2xl border border-[#e8dac9] bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-lg font-bold">नई श्रेणी जोड़ें</h2>
          <p className="mt-1 text-sm text-gray-600">यह श्रेणी सीधे Supabase में save होगी और वेबसाइट पर दिखेगी।</p>
          <form action={createCategory} className="mt-5 grid gap-3 md:grid-cols-2">
            <input name="name" required minLength={2} placeholder="नाम, जैसे स्थानीय समाचार" className="rounded-xl border border-[#e7ddd0] px-4 py-3" />
            <input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="अंग्रेज़ी स्लग, जैसे local-news" className="rounded-xl border border-[#e7ddd0] px-4 py-3" />
            <input name="description" placeholder="छोटा विवरण (optional)" className="rounded-xl border border-[#e7ddd0] px-4 py-3 md:col-span-2" />
            <button type="submit" className="w-fit rounded-xl bg-[#8a4b1f] px-5 py-3 text-sm font-bold text-white hover:bg-[#6b3915]">श्रेणी जोड़ें</button>
          </form>
        </section>

        <div className="overflow-x-auto rounded-2xl border border-[#e8dac9] bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-[#e8dac9] bg-[#f7efe3] text-xs font-bold uppercase tracking-wider text-[#6b3915]">
              <tr>
                <th className="px-6 py-4">क्रम</th>
                <th className="px-6 py-4">श्रेणी का नाम</th>
                <th className="px-6 py-4">अंग्रेज़ी स्लग</th>
                <th className="px-6 py-4">विवरण</th>
                <th className="px-6 py-4">स्थिति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e7dd]">
              {categories.map((cat, index) => (
                <tr key={cat.slug} className="hover:bg-[#fcfaf7]">
                  <td className="px-6 py-4 font-mono text-xs">{index + 1}</td>
                  <td className="px-6 py-4 font-bold text-[#222]">
                    <Link
                      href={`/category/${cat.slug}`}
                      target="_blank"
                      className="hover:text-[#8a4b1f]"
                    >
                      {cat.name} ↗
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#8a4b1f]">
                    {cat.slug}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#666] max-w-xs leading-relaxed">
                    {cat.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                      सक्रिय
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
