import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { createClient } from "@/lib/supabase/server";
import { parseRichText } from "@/lib/rich-text";

export const metadata: Metadata = {
  title: "Article preview",
  robots: { index: false, follow: false },
};

type PreviewPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ revision?: string }>;
};

type ArticlePreview = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  body_json: unknown;
  status: string;
  updated_at: string;
};

export default async function ArticlePreviewPage({ params, searchParams }: PreviewPageProps) {
  await connection();
  const [{ id }, { revision: revisionId }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile?.is_active || !["admin", "editor", "author"].includes(profile.role)) {
    redirect("/admin/login?error=unauthorized");
  }

  const { data: article } = await supabase
    .from("articles")
    .select("id, title, excerpt, body, body_json, status, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (!article) notFound();

  let preview: ArticlePreview = article;
  let revisionNumber: number | null = null;

  if (revisionId) {
    const { data: revision } = await supabase
      .from("article_revisions")
      .select("revision_number, snapshot")
      .eq("id", revisionId)
      .eq("article_id", id)
      .maybeSingle();

    if (!revision || !revision.snapshot || typeof revision.snapshot !== "object" || Array.isArray(revision.snapshot)) notFound();

    const snapshot = revision.snapshot as Record<string, unknown>;
    if (typeof snapshot.title !== "string" || typeof snapshot.body !== "string") notFound();

    preview = {
      ...article,
      title: snapshot.title,
      excerpt: typeof snapshot.excerpt === "string" ? snapshot.excerpt : null,
      body: snapshot.body,
      body_json: snapshot.body_json ?? null,
      status: typeof snapshot.status === "string" ? snapshot.status : article.status,
    };
    revisionNumber = revision.revision_number;
  }

  const richBody = typeof preview.body_json === "object" && preview.body_json
    ? parseRichText(JSON.stringify(preview.body_json))
    : null;
  const fallback = preview.body.split(/\n{2,}/).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#fcf9f5] text-[#222]">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-950">
        Protected preview — this page is not indexed or publicly accessible.
      </div>
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link href={`/admin/articles/${id}/revisions`} className="text-sm font-semibold text-[#8a4b1f] hover:underline">
          ← Back to revision history
        </Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-wider text-[#8a4b1f]">
          {revisionNumber ? `Revision #${revisionNumber}` : "Current saved version"} · {preview.status}
        </p>
        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">{preview.title}</h1>
        {preview.excerpt && <p className="mt-5 text-xl leading-relaxed text-[#555]">{preview.excerpt}</p>}
        <p className="mt-6 border-y border-[#e5ddd3] py-3 text-xs text-[#666]">
          Last saved: {new Date(preview.updated_at).toLocaleString("hi-IN")}
        </p>
        <div className="mt-8 space-y-6 text-lg leading-[1.85]">
          <ArticleBody richBody={richBody} fallback={fallback} />
        </div>
      </article>
    </main>
  );
}
