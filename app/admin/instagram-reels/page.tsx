import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addInstagramReel, deleteInstagramReel } from "./actions";
import StatusNotice from "./StatusNotice";

export const instant = false;

const messages: Record<string, string> = {
  added: "Reel homepage carousel में जोड़ दी गई है।",
  deleted: "Reel हटा दी गई है।",
  invalid_reel: "सही Instagram Reel URL डालें।",
  invalid_cover: "Cover image के लिए HTTPS URL डालें।",
  save_error: "Reel save नहीं हुई। Database migration पहले run करें।",
  delete_error: "Reel delete नहीं हुई।",
};

export default async function InstagramReelsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await connection();
  const { status } = await searchParams;
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
  if (profile?.role !== "admin" || profile.is_active !== true)
    redirect("/admin/login");

  const { data: settings } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "site")
    .maybeSingle();
  const settingValue = settings?.value;
  const reels =
    settingValue && typeof settingValue === "object" && !Array.isArray(settingValue)
      ? ((settingValue as { instagram_reels?: Array<{ id: string; reel_url: string; title: string }> }).instagram_reels ?? [])
      : [];

  return (
    <main className="min-h-screen bg-[#f7f3ed] p-6 text-[#29231e] md:p-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-sm font-semibold text-[#8a4b1f] hover:underline">
          ← Admin Dashboard
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8a4b1f]">Social media</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Instagram Reels</h1>
            <p className="mt-2 text-sm text-[#665a50]">Reel URL डालें। आपकी connected Instagram Reel का cover अपने-आप आएगा; चाहें तो cover image URL भी डाल सकते हैं।</p>
          </div>
          <Link href="/" target="_blank" className="rounded-xl border border-[#8a4b1f] px-4 py-2 text-sm font-bold text-[#8a4b1f]">
            Homepage देखें ↗
          </Link>
        </div>

        {status && <StatusNotice status={status} message={messages[status] || "कुछ गलत हो गया।"} />}

        <form action={addInstagramReel} className="mt-7 grid gap-4 rounded-2xl border border-[#e8dac9] bg-white p-5 shadow-sm md:grid-cols-2 md:p-7">
          <label className="grid gap-2 md:col-span-2"><span className="text-sm font-bold">Instagram Reel URL *</span><input name="reel_url" required placeholder="https://www.instagram.com/reel/.../" className="rounded-xl border border-[#dfd3c5] px-4 py-3" /></label>
          <label className="grid gap-2"><span className="text-sm font-bold">Title</span><input name="title" maxLength={120} placeholder="रील का नाम" className="rounded-xl border border-[#dfd3c5] px-4 py-3" /></label>
          <label className="grid gap-2"><span className="text-sm font-bold">Cover image URL (optional)</span><input name="thumbnail_url" type="url" placeholder="https://...jpg" className="rounded-xl border border-[#dfd3c5] px-4 py-3" /></label>
          <button className="w-fit rounded-xl bg-[#8a4b1f] px-5 py-3 font-bold text-white hover:bg-[#6b3915]">Reel जोड़ें</button>
        </form>

        <section className="mt-8 rounded-2xl border border-[#e8dac9] bg-white p-5 shadow-sm md:p-7">
          <h2 className="text-xl font-bold">Added reels ({reels?.length ?? 0})</h2>
          <div className="mt-5 grid gap-4">
            {(reels ?? []).map((reel) => (
              <div key={reel.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#eee3d8] p-4">
                <div className="min-w-0"><p className="font-bold">{reel.title}</p><a href={reel.reel_url} target="_blank" rel="noreferrer" className="block truncate text-sm text-[#8a4b1f] hover:underline">{reel.reel_url}</a></div>
                <form action={deleteInstagramReel}><input type="hidden" name="id" value={reel.id} /><button className="rounded-lg border border-red-300 px-3 py-2 text-sm font-bold text-red-700">Delete</button></form>
              </div>
            ))}
            {!reels?.length && <p className="text-sm text-[#786b5e]">अभी कोई reel add नहीं की गई है।</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
