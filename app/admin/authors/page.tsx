import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function AdminAuthorsPage() {
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

  const { data: authors } = await supabase.from("authors").select("*");

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
              507 HEAD · Team
            </p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Authors & Staff
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              संपादकीय टीम, लेखक और स्टाफ का प्रबंधन।
            </p>
          </div>
        </header>

        <div className="overflow-x-auto rounded-2xl border border-[#e8dac9] bg-white shadow-sm">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-[#e8dac9] bg-[#f7efe3] text-xs font-bold uppercase tracking-wider text-[#6b3915]">
              <tr>
                <th className="px-6 py-4">नाम</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Bio</th>
                <th className="px-6 py-4">पब्लिक प्रोफाइल</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e7dd]">
              {(authors && authors.length > 0) ? (
                authors.map((author) => (
                  <tr key={author.id} className="hover:bg-[#fcfaf7]">
                    <td className="px-6 py-4 font-bold text-[#222]">
                      {author.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#8a4b1f]">
                      {author.slug}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#666] max-w-sm">
                      {author.bio || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                        {author.is_public ? "Public" : "Internal"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#777]">
                    कोई लेखक रिकॉर्ड नहीं मिला।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
