import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { restoreArticleRevision } from "../../actions";

export const instant = false;

async function handleRestoreRevision(formData: FormData): Promise<void> {
  "use server";
  await restoreArticleRevision(formData);
}

type RevisionPageProps = {
  params: Promise<{ id: string }>;
};

type RevisionSnapshot = {
  title?: string;
  status?: string;
  excerpt?: string;
};

export default async function ArticleRevisionsPage({ params }: RevisionPageProps) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin" || profile?.is_active !== true) {
    redirect("/admin/login");
  }

  const [{ data: article }, { data: revisions, error }] = await Promise.all([
    supabase.from("articles").select("id, title, slug").eq("id", id).maybeSingle(),
    supabase
      .from("article_revisions")
      .select("id, revision_number, snapshot, change_summary, created_at")
      .eq("article_id", id)
      .order("revision_number", { ascending: false }),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f3ed] p-6 text-[#29231e] md:p-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/articles" className="text-sm font-semibold text-[#8a4b1f] hover:underline">
          ← Articles पर वापस जाएँ
        </Link>
        <Link href={`/admin/articles/${id}/preview`} className="ml-5 text-sm font-semibold text-[#8a4b1f] hover:underline">
          Preview current version
        </Link>
        <header className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8a4b1f]">507 Head · Editorial</p>
          <h1 className="mt-2 text-3xl font-bold">Revision History</h1>
          <p className="mt-2 text-sm text-gray-600">{article?.title ?? "Article"}</p>
        </header>

        {error ? (
          <p className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-800">History load नहीं हो सकी: {error.message}</p>
        ) : revisions?.length ? (
          <ol className="mt-8 space-y-4">
            {revisions.map((revision) => {
              const snapshot = revision.snapshot as RevisionSnapshot | null;
              return (
                <li key={revision.id} className="rounded-2xl border border-[#e7ddd0] bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-bold text-[#8a4b1f]">Revision #{revision.revision_number}</p>
                    <time className="text-xs text-gray-500">{new Date(revision.created_at).toLocaleString("hi-IN")}</time>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{snapshot?.title ?? "Article snapshot"}</p>
                  {snapshot?.excerpt && <p className="mt-2 text-sm leading-6 text-gray-600">{snapshot.excerpt}</p>}
                  <p className="mt-3 text-xs text-gray-500">
                    {revision.change_summary ?? "Article changed"}
                    {snapshot?.status ? ` · ${snapshot.status}` : ""}
                  </p>
                  <Link href={`/admin/articles/${id}/preview?revision=${revision.id}`} className="mt-3 inline-block text-xs font-bold text-[#8a4b1f] hover:underline">
                    Preview this revision
                  </Link>
                  <form action={handleRestoreRevision} className="mt-4">
                    <input type="hidden" name="revision_id" value={revision.id} />
                    <button className="rounded-lg border border-[#8a4b1f] px-3 py-2 text-xs font-bold text-[#8a4b1f] hover:bg-[#f7efe3]">
                      इस revision को restore करें
                    </button>
                  </form>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="mt-8 rounded-2xl border border-[#e7ddd0] bg-white p-8 text-center text-sm text-gray-600">
            अभी कोई revision नहीं है। अगला save, update या publish revision बना देगा।
          </p>
        )}
      </div>
    </main>
  );
}
