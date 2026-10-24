import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createRedirect, deleteRedirect } from "./actions";
import RedirectStatusNotice from "./RedirectStatusNotice";

export const instant = false;
type PageProps = { searchParams: Promise<{ error?: string; success?: string }> };

export default async function AdminRedirectsPage({ searchParams }: PageProps) {
  await connection();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("staff_profiles").select("role, is_active").eq("user_id", user.id).maybeSingle();
  if (profile?.role !== "admin" || profile.is_active !== true) redirect("/admin/login");
  const { data: redirects } = await supabase.from("redirects").select("id, source_path, destination_path, status_code, created_at").order("created_at", { ascending: false });
  const query = await searchParams;

  return <main className="min-h-screen bg-[#f7f3ed] p-6 text-[#29231e] md:p-10"><div className="mx-auto max-w-5xl">
    <Link href="/admin" className="mb-6 inline-block text-sm font-semibold text-[#8a4b1f] hover:underline">← Back to Admin Dashboard</Link>
    <header className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a4b1f]">507 HEAD · SEO</p><h1 className="mt-2 text-3xl font-bold md:text-4xl">Redirects</h1><p className="mt-2 text-sm text-gray-600">पुराने internal URLs को सुरक्षित 301/302 पर भेजें।</p></header>
    <RedirectStatusNotice success={query.success} error={query.error} />
    <form action={createRedirect} className="mb-8 grid gap-4 rounded-2xl border border-[#e8dac9] bg-white p-6 shadow-sm md:grid-cols-[1fr_1fr_110px_auto]"><input required name="source_path" placeholder="/purana-page" className="rounded-lg border border-[#e5ddd3] px-3 py-2" /><input required name="destination_path" placeholder="/naya-page" className="rounded-lg border border-[#e5ddd3] px-3 py-2" /><select name="status_code" defaultValue="301" className="rounded-lg border border-[#e5ddd3] px-3 py-2"><option value="301">301 Permanent</option><option value="302">302 Temporary</option></select><button className="rounded-lg bg-[#8a4b1f] px-4 py-2 font-bold text-white">Add redirect</button></form>
    <div className="overflow-x-auto rounded-2xl border border-[#e8dac9] bg-white shadow-sm"><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-[#f7efe3] text-xs uppercase text-[#6b3915]"><tr><th className="p-4">Source</th><th className="p-4">Destination</th><th className="p-4">Code</th><th className="p-4">Action</th></tr></thead><tbody>{(redirects ?? []).map((item) => <tr key={item.id} className="border-t border-[#f0e7dd]"><td className="p-4 font-mono">{item.source_path}</td><td className="p-4 font-mono">{item.destination_path}</td><td className="p-4">{item.status_code}</td><td className="p-4"><form action={deleteRedirect}><input type="hidden" name="id" value={item.id} /><button className="text-sm font-semibold text-red-700 hover:underline">Delete</button></form></td></tr>)}{(!redirects || redirects.length === 0) && <tr><td colSpan={4} className="p-8 text-center text-gray-500">No redirects yet.</td></tr>}</tbody></table></div>
  </div></main>;
}
