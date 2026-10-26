
"use server";

import { revalidatePath, updateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { validateArticleInput } from "@/lib/editorial";
import { recordArticleHistory } from "@/lib/editorial-history";
import { parseRichText, richTextSummary } from "@/lib/rich-text";

const ARTICLE_STATUSES = ["draft", "in_review", "published", "scheduled"] as const;

type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

type ActionResult = {
  success: boolean;
  message: string;
};

function getTextValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function getArticleStatus(value: string): ArticleStatus | null {
  return ARTICLE_STATUSES.includes(value as ArticleStatus)
    ? (value as ArticleStatus)
    : null;
}

function getScheduledFor(formData: FormData) {
  const value = getTextValue(formData, "scheduled_for");
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function createArticleSlug(title: string) {
  const base = title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

  return `${base || "article"}-${crypto.randomUUID().slice(0, 8)}`;
}

async function getAdminClient() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      supabase: null,
      user: null,
      error: "पहले Admin Login करो।",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("staff_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (
    profileError ||
    !["admin", "editor", "author"].includes(profile?.role ?? "") ||
    profile?.is_active !== true
  ) {
    return {
      supabase: null,
      user: null,
      error: "Admin permission नहीं है।",
    };
  }

  return {
    supabase,
    user,
    role: profile.role as "admin" | "editor" | "author",
    error: "",
  };
}

function refreshArticles(paths?: { slug?: string; categorySlug?: string }) {
  updateTag("published-articles");
  revalidatePath("/admin/articles", "page");
  revalidatePath("/admin/articles/new", "page");
  revalidatePath("/admin", "page");
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  if (paths?.slug) revalidatePath(`/blog/${paths.slug}`);
  if (paths?.categorySlug) revalidatePath(`/category/${paths.categorySlug}`);
}

export async function createArticle(formData: FormData): Promise<ActionResult> {
  const { supabase, user, role, error } = await getAdminClient();

  if (!supabase || !user) {
    return { success: false, message: error };
  }

  const title = getTextValue(formData, "title");
  const richText = parseRichText(getTextValue(formData, "content_json"));
  const body = richText ? richTextSummary(richText) : getTextValue(formData, "content") || getTextValue(formData, "body");
  const excerpt = getTextValue(formData, "excerpt");
  const categorySlug = getTextValue(formData, "category_slug");
  const featuredImageUrl = getTextValue(formData, "featured_image_url");
  const featuredImageAlt = getTextValue(formData, "featured_image_alt") || title;
  const tagsRaw = getTextValue(formData, "tags");
  const status = getArticleStatus(getTextValue(formData, "status"));
  const scheduledFor = getScheduledFor(formData);
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const validationError = validateArticleInput({
    title,
    excerpt,
    body,
    categorySlug,
    tags,
  });

  if (validationError) {
    return { success: false, message: validationError };
  }

  if (!title || !body || title.length > 250) {
    return {
      success: false,
      message: "शीर्षक और समाचार की सामग्री भरना ज़रूरी है।",
    };
  }

  if (!status) {
    return {
      success: false,
      message: "समाचार की स्थिति सही नहीं है।",
    };
  }

  if (status !== "draft" && role === "author") {
    return { success: false, message: "लेखक केवल draft बना सकते हैं; publish करने के लिए editor की समीक्षा जरूरी है।" };
  }

  if (status === "scheduled" && (!scheduledFor || scheduledFor.getTime() <= Date.now())) {
    return { success: false, message: "Scheduled article के लिए future date और time जरूरी है।" };
  }

  const { data: author, error: authorError } = await supabase
    .from("authors")
    .select("id")
    .eq("staff_user_id", user.id)
    .maybeSingle();

  if (authorError) {
    return {
      success: false,
      message: `Author profile नहीं मिला: ${authorError.message}`,
    };
  }

  let authorId = author?.id;
  if (!authorId) {
    const { data: defaultAuthor } = await supabase
      .from("authors")
      .select("id")
      .limit(1)
      .maybeSingle();
    authorId = defaultAuthor?.id || null;
  }

  const CAT_NAMES: Record<string, string> = {
    news: "ताज़ा खबरें और रिपोर्ट",
    farming: "खेती-बाड़ी",
    pashupalan: "पशुपालन",
    kisan: "किसान",
    wisdom: "बुजुर्गों की सीख",
    history: "इतिहास और विरासत",
    heritage: "सांस्कृतिक विरासत",
    food: "खान-पान",
  };

  let categoryId: string | null = null;
  if (categorySlug) {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();

    if (catData?.id) {
      categoryId = catData.id;
    } else {
      const { data: newCat } = await supabase
        .from("categories")
        .insert({
          name: CAT_NAMES[categorySlug] || categorySlug,
          slug: categorySlug,
          description: CAT_NAMES[categorySlug] || categorySlug,
          sort_order: 1,
          is_active: true,
          show_on_home: true,
        })
        .select("id")
        .maybeSingle();
      categoryId = newCat?.id || null;
    }
  }

  const { data: insertedArticle, error: insertError } = await supabase
    .from("articles")
    .insert({
      title,
      slug: createArticleSlug(title),
      created_by: user.id,
      excerpt: excerpt || null,
      body,
      body_json: richText,
      status,
      category_id: categoryId,
      featured_image_url: featuredImageUrl || null,
      featured_image_alt: featuredImageAlt || null,
      author_id: authorId,
      published_at: status === "published" ? new Date().toISOString() : null,
      scheduled_for: status === "scheduled" ? scheduledFor?.toISOString() : null,
    })
    .select("id")
    .single();

  if (insertError) {
    return {
      success: false,
      message: `समाचार सेव नहीं हुआ: ${insertError.message}`,
    };
  }

  if (insertedArticle?.id) {
    try {
      await recordArticleHistory(supabase, {
        articleId: String(insertedArticle.id),
        actorUserId: user.id,
        action: "article.created",
        snapshot: {
          id: insertedArticle.id,
          title,
          excerpt,
          body,
          status,
          category_id: categoryId,
          author_id: authorId,
          featured_image_url: featuredImageUrl || null,
          featured_image_alt: featuredImageAlt || null,
        },
        summary: status === "published" ? "Article created and published" : "Draft created",
      });
    } catch (historyError) {
      console.error("Article history could not be recorded:", historyError);
    }
  }

  refreshArticles();

  return {
    success: true,
    message:
      status === "published"
        ? "समाचार सफलतापूर्वक Publish हो गया।"
        : "समाचार Draft में सेव हो गया।",
  };
}

export async function updateArticle(formData: FormData): Promise<ActionResult> {
  const { supabase, user, role, error } = await getAdminClient();

  if (!supabase || !user) {
    return { success: false, message: error };
  }

  const id = getTextValue(formData, "id");
  const title = getTextValue(formData, "title");
  const richText = parseRichText(getTextValue(formData, "content_json"));
  const body = richText ? richTextSummary(richText) : getTextValue(formData, "content") || getTextValue(formData, "body");
  const status = getArticleStatus(getTextValue(formData, "status"));
  const scheduledFor = getScheduledFor(formData);

  if (!id || !title || !body || title.length > 250) {
    return {
      success: false,
      message: "समाचार की जानकारी अधूरी है।",
    };
  }

  if (!status) {
    return {
      success: false,
      message: "समाचार की स्थिति सही नहीं है।",
    };
  }

  if (status !== "draft" && role === "author") {
    return { success: false, message: "लेखक published status नहीं चुन सकते।" };
  }

  if (status === "scheduled" && (!scheduledFor || scheduledFor.getTime() <= Date.now())) {
    return { success: false, message: "Scheduled article के लिए future date और time जरूरी है।" };
  }

  const excerpt = getTextValue(formData, "excerpt");
  const featuredImageUrl = getTextValue(formData, "featured_image_url");
  const featuredImageAlt = getTextValue(formData, "featured_image_alt");

  const updatePayload: Record<string, unknown> = {
    title,
    body,
    ...(richText ? { body_json: richText } : {}),
    status,
    updated_at: new Date().toISOString(),
    scheduled_for: status === "scheduled" ? scheduledFor?.toISOString() : null,
  };

  if (status === "published") updatePayload.published_at = new Date().toISOString();

  if (excerpt !== undefined && excerpt !== null && excerpt !== "") {
    updatePayload.excerpt = excerpt;
  }
  if (featuredImageUrl) {
    updatePayload.featured_image_url = featuredImageUrl;
  }
  if (featuredImageAlt) {
    updatePayload.featured_image_alt = featuredImageAlt;
  }

  const categorySlug = getTextValue(formData, "category_slug");
  if (categorySlug) {
    const { data: catData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle();

    if (catData?.id) {
      updatePayload.category_id = catData.id;
    } else {
      const CAT_NAMES: Record<string, string> = {
        news: "ताज़ा खबरें और रिपोर्ट",
        farming: "खेती-बाड़ी",
        pashupalan: "पशुपालन",
        kisan: "किसान",
        wisdom: "बुजुर्गों की सीख",
        history: "इतिहास और विरासत",
        heritage: "सांस्कृतिक विरासत",
        food: "खान-पान",
      };
      const { data: newCat } = await supabase
        .from("categories")
        .insert({
          name: CAT_NAMES[categorySlug] || categorySlug,
          slug: categorySlug,
          description: CAT_NAMES[categorySlug] || categorySlug,
          sort_order: 1,
          is_active: true,
          show_on_home: true,
        })
        .select("id")
        .maybeSingle();
      if (newCat?.id) {
        updatePayload.category_id = newCat.id;
      }
    }
  }

  const { data, error: updateError } = await supabase
    .from("articles")
    .update(updatePayload)
    .eq("id", id)
    .select("id");

  if (updateError) {
    return {
      success: false,
      message: `समाचार अपडेट नहीं हुआ: ${updateError.message}`,
    };
  }

  if (!data?.length) {
    const { error: insertErr } = await supabase.from("articles").insert({
      title,
      slug: createArticleSlug(title),
      excerpt: excerpt || null,
      body,
      status,
      featured_image_url: featuredImageUrl || null,
      featured_image_alt: featuredImageAlt || null,
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    if (insertErr) {
      return {
        success: false,
        message: `समाचार अपडेट नहीं हुआ: ${insertErr.message}`,
      };
    }
  }

  if (data?.[0]?.id) {
    try {
      await recordArticleHistory(supabase, {
        articleId: String(data[0].id),
        actorUserId: user.id,
        action: "article.updated",
        snapshot: { id: data[0].id, ...updatePayload },
        summary: "Article updated",
      });
    } catch (historyError) {
      console.error("Article history could not be recorded:", historyError);
    }
  }

  refreshArticles();

  return {
    success: true,
    message: "समाचार अपडेट हो गया।",
  };
}

export async function publishArticle(id: string): Promise<ActionResult> {
  const { supabase, user, role, error } = await getAdminClient();

  if (!supabase || !user) {
    return { success: false, message: error };
  }

  if (role === "author") {
    return { success: false, message: "केवल editor या admin लेख publish कर सकते हैं।" };
  }

  const articleId = id.trim();

  if (!articleId) {
    return {
      success: false,
      message: "समाचार ID नहीं मिली।",
    };
  }

  const { data, error: updateError } = await supabase
    .from("articles")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", articleId)
    .select("id, title, slug, excerpt, body, status, category_id, author_id, featured_image_url, featured_image_alt, published_at, updated_at");

  if (!updateError && data?.[0]) {
    try {
      const publishedArticle = data[0];
      await recordArticleHistory(supabase, {
        articleId: String(publishedArticle.id),
        actorUserId: user.id,
        action: "article.published",
        snapshot: publishedArticle,
        summary: "Article published",
      });
    } catch (historyError) {
      console.error("Article history could not be recorded:", historyError);
    }
  }

  if (updateError) {
    return {
      success: false,
      message: `Publish नहीं हुआ: ${updateError.message}`,
    };
  }

  if (!data?.length) {
    return {
      success: false,
      message: "समाचार नहीं मिला या Publish करने की अनुमति नहीं है।",
    };
  }

  refreshArticles();

  return {
    success: true,
    message: "समाचार Publish हो गया।",
  };
}

export async function unpublishArticle(id: string): Promise<ActionResult> {
  const { supabase, user, role, error } = await getAdminClient();
  if (!supabase || !user) return { success: false, message: error };
  if (role === "author") {
    return { success: false, message: "केवल editor या admin लेख को unpublish कर सकते हैं।" };
  }

  const articleId = id.trim();
  if (!articleId) return { success: false, message: "समाचार ID नहीं मिली।" };

  const { data: article, error: updateError } = await supabase
    .from("articles")
    .update({ status: "draft", updated_at: new Date().toISOString() })
    .eq("id", articleId)
    .eq("status", "published")
    .select("id, title, slug, excerpt, body, status, category_id, author_id, featured_image_url, featured_image_alt, published_at, updated_at")
    .maybeSingle();

  if (updateError) return { success: false, message: `Unpublish नहीं हुआ: ${updateError.message}` };
  if (!article) return { success: false, message: "समाचार नहीं मिला या पहले ही unpublish है।" };

  try {
    await recordArticleHistory(supabase, {
      articleId: String(article.id),
      actorUserId: user.id,
      action: "article.unpublished",
      snapshot: article,
      summary: "Article unpublished and returned to draft",
    });
  } catch (historyError) {
    console.error("Article history could not be recorded:", historyError);
  }

  refreshArticles({ slug: article.slug });
  return { success: true, message: "समाचार को सुरक्षित रूप से Draft में वापस कर दिया गया है।" };
}

export async function restoreArticleRevision(formData: FormData): Promise<ActionResult> {
  const { supabase, user, role, error } = await getAdminClient();
  if (!supabase || !user) return { success: false, message: error };
  if (role !== "admin") {
    return { success: false, message: "Revision restore करने की अनुमति केवल admin को है।" };
  }

  const revisionId = getTextValue(formData, "revision_id");
  if (!revisionId) return { success: false, message: "Revision नहीं मिली।" };

  const { data: revision, error: revisionError } = await supabase
    .from("article_revisions")
    .select("id, article_id, snapshot")
    .eq("id", revisionId)
    .maybeSingle();

  if (revisionError || !revision) {
    return { success: false, message: "Revision नहीं मिली या access नहीं है।" };
  }

  const snapshot = revision.snapshot as Record<string, unknown>;
  const restoredFields: Record<string, unknown> = {};
  for (const key of [
    "title",
    "excerpt",
    "body",
    "status",
    "category_id",
    "author_id",
    "featured_image_url",
    "featured_image_alt",
  ]) {
    if (key in snapshot) restoredFields[key] = snapshot[key];
  }

  if (!restoredFields.title || !restoredFields.body || !restoredFields.status) {
    return { success: false, message: "इस revision में restore करने के लिए पूरी article जानकारी नहीं है।" };
  }

  const { data: restoredArticle, error: restoreError } = await supabase
    .from("articles")
    .update({ ...restoredFields, updated_at: new Date().toISOString() })
    .eq("id", revision.article_id)
    .select("id, title, slug, excerpt, body, status, category_id, author_id, featured_image_url, featured_image_alt, published_at, updated_at")
    .maybeSingle();

  if (restoreError || !restoredArticle) {
    return { success: false, message: "Revision restore नहीं हो सकी।" };
  }

  try {
    await recordArticleHistory(supabase, {
      articleId: String(restoredArticle.id),
      actorUserId: user.id,
      action: "article.restored",
      snapshot: restoredArticle,
      summary: `Restored from revision ${revisionId}`,
    });
  } catch (historyError) {
    console.error("Article restore history could not be recorded:", historyError);
  }

  revalidatePath("/admin/articles", "page");
  revalidatePath(`/admin/articles/${revision.article_id}/revisions`);
  revalidatePath(`/blog/${restoredArticle.slug}`);
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");

  return { success: true, message: "Revision restore हो गई है।" };
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const { supabase, role, error } = await getAdminClient();

  if (!supabase) {
    return { success: false, message: error };
  }

  if (role !== "admin") {
    return { success: false, message: "लेख delete करने की अनुमति केवल admin को है।" };
  }

  const articleId = id.trim();

  if (!articleId) {
    return {
      success: false,
      message: "समाचार ID नहीं मिली।",
    };
  }

  if (articleId.startsWith("art-")) {
    refreshArticles();
    return {
      success: true,
      message: "समाचार Delete हो गया।",
    };
  }

  const { data, error: deleteError } = await supabase
    .from("articles")
    .delete()
    .eq("id", articleId)
    .select("id, title, slug, excerpt, body, status, category_id, author_id, featured_image_url, featured_image_alt, published_at, updated_at");

  if (deleteError) {
    return {
      success: false,
      message: `समाचार Delete नहीं हुआ: ${deleteError.message}`,
    };
  }

  if (!data?.length) {
    return {
      success: false,
      message: "समाचार नहीं मिला या Delete करने की अनुमति नहीं है।",
    };
  }

  refreshArticles();

  return {
    success: true,
    message: "समाचार Delete हो गया।",
  };
}
