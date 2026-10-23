import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { APPROVED_CATEGORIES } from "@/lib/content";

export const instant = false;

export default async function AdminCategoriesPage() {
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
              507 HEAD · Taxonomy
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Categories Management
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              507 Head की 7 स्वीकृत एवं स्थायी श्रेणियां (Phase 1 Fixed Slugs).
            </p>
          </div>
        </header>

        <div className="rounded-2xl border border-[#e8dac9] bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#e8dac9] bg-[#f7efe3] text-xs font-bold uppercase tracking-wider text-[#6b3915]">
              <tr>
                <th className="px-6 py-4">क्रम</th>
                <th className="px-6 py-4">श्रेणी का नाम</th>
                <th className="px-6 py-4">English Slug</th>
                <th className="px-6 py-4">विवरण</th>
                <th className="px-6 py-4">स्थिति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e7dd]">
              {APPROVED_CATEGORIES.map((cat, index) => (
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
                      Active
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
