import type { SupabaseClient } from "@supabase/supabase-js";

type HistoryEvent = {
  articleId: string;
  actorUserId: string;
  action:
    | "article.created"
    | "article.updated"
    | "article.published"
    | "article.unpublished"
    | "article.restored";
  snapshot: Record<string, unknown>;
  summary: string;
};

export async function recordArticleHistory(
  supabase: SupabaseClient,
  event: HistoryEvent,
): Promise<void> {
  const { data: latestRevision, error: latestRevisionError } = await supabase
    .from("article_revisions")
    .select("revision_number")
    .eq("article_id", event.articleId)
    .order("revision_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestRevisionError) throw latestRevisionError;

  const revisionNumber = (latestRevision?.revision_number ?? 0) + 1;
  const { error: revisionError } = await supabase
    .from("article_revisions")
    .insert({
      article_id: event.articleId,
      revision_number: revisionNumber,
      snapshot: event.snapshot,
      changed_by: event.actorUserId,
      change_summary: event.summary,
    });

  if (revisionError) throw revisionError;

  const { error: auditError } = await supabase.from("audit_logs").insert({
    actor_user_id: event.actorUserId,
    action: event.action,
    entity_type: "article",
    entity_id: event.articleId,
    metadata: { revision_number: revisionNumber },
  });

  if (auditError) throw auditError;
}
