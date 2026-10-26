import { createClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return Response.json(
      { error: "Scheduled publishing is not configured." },
      { status: 503 },
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  const now = new Date().toISOString();
  const { data: articles, error } = await supabase
    .from("articles")
    .update({ status: "published", published_at: now, updated_at: now })
    .eq("status", "scheduled")
    .lte("scheduled_for", now)
    .select("id, slug");

  if (error)
    return Response.json(
      { error: "Could not publish scheduled articles." },
      { status: 500 },
    );

  for (const article of articles ?? []) {
    await supabase.from("audit_logs").insert({
      actor_user_id: null,
      action: "article.published_scheduled",
      entity_type: "article",
      entity_id: String(article.id),
      metadata: { source: "vercel-cron" },
    });
    revalidatePath(`/blog/${article.slug}`);
  }
  revalidateTag("published-articles", "max");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  return Response.json({ published: articles?.length ?? 0 });
}
