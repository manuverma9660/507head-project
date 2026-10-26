
"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  unpublishArticle,
} from "./actions";

type Article = {
  id?: string | number;
  title?: string | null;
  excerpt?: string | null;
  body?: string | null;
  status?: string | null;
  category_slug?: string | null;
  category_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ArticleStatus = "all" | "draft" | "in_review" | "published" | "scheduled";

export default function ArticleManager({
  articles,
}: {
  articles: Article[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categorySlug, setCategorySlug] = useState("history");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ArticleStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  const filtered = useMemo(
    () =>
      articles.filter((article) => {
        const matchesSearch = String(article.title ?? "")
          .toLowerCase()
          .includes(search.trim().toLowerCase());

        const matchesStatus =
          filter === "all" ||
          String(article.status ?? "").toLowerCase() === filter;

        const matchesCategory =
          categoryFilter === "all" ||
          article.category_slug === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      }),
    [articles, search, filter, categoryFilter]
  );

  function handleSave(status: "draft" | "in_review" | "published") {
    if (busy) return;

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setMessage("शीर्षक और लेख की सामग्री भरना ज़रूरी है।");
      return;
    }

    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("excerpt", excerpt.trim());
    formData.set("category_slug", categorySlug);
    formData.set("content", content.trim());
    formData.set("status", status);

    if (editingId) {
      formData.set("id", editingId);
    }

    setBusy(true);
    setMessage("");

    startTransition(async () => {
      try {
        const result = editingId
          ? await updateArticle(formData)
          : await createArticle(formData);

        setMessage(result.message);

        if (result.success) {
          setEditingId("");
          setTitle("");
          setExcerpt("");
          setContent("");
          setCategorySlug("history");
          setFormOpen(false);
          router.refresh();
        }
      } catch {
        setMessage("लेख सेव करते समय त्रुटि हुई।");
      } finally {
        setBusy(false);
      }
    });
  }

  function handlePublish(id: string) {
    if (busy || !id) return;

    setBusy(true);
    setMessage("");

    startTransition(async () => {
      try {
        const result = await publishArticle(id);
        setMessage(result.message);

        if (result.success) {
          router.refresh();
        }
      } catch {
        setMessage("लेख Publish नहीं हुआ।");
      } finally {
        setBusy(false);
      }
    });
  }

  function handleUnpublish(id: string) {
    if (busy || !id || !window.confirm("क्या इस लेख को Draft में वापस करना है?")) return;
    setBusy(true);
    setMessage("");

    startTransition(async () => {
      try {
        const result = await unpublishArticle(id);
        setMessage(result.message);
        if (result.success) router.refresh();
      } catch {
        setMessage("लेख unpublish नहीं हुआ।");
      } finally {
        setBusy(false);
      }
    });
  }

  function handleDelete(id: string) {
    if (busy || !id) return;

    if (!window.confirm("क्या आप इस लेख को डिलीट करना चाहते हैं?")) {
      return;
    }

    setBusy(true);
    setMessage("");

    startTransition(async () => {
      try {
        const result = await deleteArticle(id);
        setMessage(result.message);

        if (result.success) {
          if (editingId === id) {
            setEditingId("");
            setTitle("");
            setExcerpt("");
            setContent("");
          }

          router.refresh();
        }
      } catch {
        setMessage("लेख Delete नहीं हुआ।");
      } finally {
        setBusy(false);
      }
    });
  }

  function startEdit(article: Article) {
    if (busy || article.id == null) return;

    setEditingId(String(article.id));
    setTitle(String(article.title ?? ""));
    setExcerpt(String(article.excerpt ?? ""));
    setCategorySlug(article.category_slug || "history");
    setContent(String(article.body ?? ""));
    setMessage("");
    setFormOpen(true);

    requestAnimationFrame(() => {
      document.getElementById("article-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function cancelEdit() {
    setEditingId("");
    setTitle("");
    setExcerpt("");
    setCategorySlug("history");
    setContent("");
    setMessage("");
    setFormOpen(false);
  }

  return (
    <div className="space-y-8">
      {formOpen && (
      <section
        id="article-form"
        className="scroll-mt-6 rounded-2xl border border-[#e7ddd0] bg-white p-5 shadow-sm md:p-7"
      >
        <h2 className="text-xl font-bold">
          {editingId ? "लेख एडिट करें" : "नया लेख बनाएँ"}
        </h2>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <label
              htmlFor="article-title"
              className="mb-2 block text-sm font-semibold"
            >
              लेख का शीर्षक <span className="text-red-500">*</span>
            </label>
            <input
              id="article-title"
              name="title"
              required
              minLength={40}
              maxLength={70}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="लेख का शीर्षक लिखें"
              className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
            />
          </div>

          <div>
            <label
              htmlFor="article-category"
              className="mb-2 block text-sm font-semibold"
            >
              श्रेणी (Category) <span className="text-red-500">*</span>
            </label>
            <select
              id="article-category"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full rounded-xl border border-[#e7ddd0] bg-white px-4 py-3 outline-none focus:border-[#8a4b1f]"
            >
              <option value="news">📢 ताज़ा खबरें और रिपोर्ट (लेटेस्ट अपडेट्स)</option>
              <option value="farming">🌾 खेती-बाड़ी</option>
              <option value="pashupalan">🐄 पशुपालन</option>
              <option value="kisan">🚜 किसान</option>
              <option value="wisdom">🧓 बुजुर्गों की सीख</option>
              <option value="history">🏛️ इतिहास और विरासत</option>
              <option value="heritage">🎭 सांस्कृतिक विरासत</option>
              <option value="food">🍲 खान-पान</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              लेख वेबसाइट पर इसी चुनी गई श्रेणी के ब्लॉक में दिखेगा।
            </p>
          </div>

          <div>
            <label
              htmlFor="article-content"
              className="mb-2 block text-sm font-semibold"
            >
              लेख की सामग्री <span className="text-red-500">*</span>
            </label>
            <textarea
              id="article-content"
              name="content"
              required
              rows={7}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="लेख यहाँ लिखें..."
              className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
            />
          </div>

          <div>
            <label htmlFor="article-excerpt" className="mb-2 block text-sm font-semibold">Description <span className="text-red-500">*</span></label>
            <textarea
              id="article-excerpt"
              required
              maxLength={160}
              rows={2}
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleSave("draft")}
              className="rounded-xl border border-[#8a4b1f] px-5 py-3 font-semibold text-[#8a4b1f] disabled:opacity-50"
            >
              {busy ? "प्रतीक्षा करें..." : "Draft में सेव करें"}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => void handleSave("published")}
              className="rounded-xl bg-[#8a4b1f] px-5 py-3 font-semibold text-white hover:bg-[#6b3915] disabled:opacity-50"
            >
              {busy ? "प्रतीक्षा करें..." : "Publish करें"}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => void handleSave("in_review")}
              className="rounded-xl border border-[#8a4b1f] px-5 py-3 font-semibold text-[#8a4b1f] disabled:opacity-50"
            >
              Send for review
            </button>

            {editingId && (
              <button
                type="button"
                disabled={busy}
                onClick={cancelEdit}
                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mt-4 rounded-lg bg-[#f7f3ed] p-3 text-sm"
          >
            {message}
          </p>
        )}
      </section>
      )}

      <section className="rounded-2xl border border-[#e7ddd0] bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-bold">
            सभी लेख ({filtered.length})
          </h2>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <input
              aria-label="शीर्षक से लेख खोजें"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="शीर्षक से खोजें..."
              className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 sm:w-56"
            />

            <select
              aria-label="श्रेणी से फ़िल्टर करें"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-xl border border-[#e7ddd0] bg-white px-4 py-3 text-sm"
            >
              <option value="all">सभी श्रेणियां</option>
              <option value="news">📢 ताज़ा खबरें</option>
              <option value="farming">🌾 खेती-बाड़ी</option>
              <option value="pashupalan">🐄 पशुपालन</option>
              <option value="kisan">🚜 किसान</option>
              <option value="wisdom">🧓 बुजुर्गों की सीख</option>
              <option value="history">🏛️ इतिहास और विरासत</option>
              <option value="heritage">🎭 सांस्कृतिक विरासत</option>
              <option value="food">🍲 खान-पान</option>
            </select>

            <select
              aria-label="लेख की स्थिति"
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as ArticleStatus)
              }
              className="rounded-xl border border-[#e7ddd0] bg-white px-4 py-3 text-sm"
            >
              <option value="all">सभी स्थिति</option>
              <option value="draft">Draft</option>
              <option value="in_review">Review</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="px-3 py-3">शीर्षक</th>
                <th className="px-3 py-3">श्रेणी</th>
                <th className="px-3 py-3">स्थिति</th>
                <th className="px-3 py-3">तारीख</th>
                <th className="px-3 py-3">एक्शन</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((article, index) => {
                const id =
                  article.id == null ? "" : String(article.id);
                const status = String(
                  article.status ?? "अज्ञात"
                ).toLowerCase();

                return (
                  <tr
                    key={id || index}
                    className="border-b border-gray-100 hover:bg-[#faf7f3]"
                  >
                    <td className="max-w-xs break-words px-3 py-4 font-semibold">
                      {article.title || "बिना शीर्षक"}
                    </td>

                    <td className="px-3 py-4">
                      <span className="inline-block rounded-lg bg-[#f7efe3] px-2.5 py-1 text-xs font-bold text-[#8a4b1f]">
                        {article.category_name || "ताज़ा खबरें"}
                      </span>
                    </td>

                    <td className="px-3 py-4">
                      <span className="rounded-full bg-[#f7f3ed] px-3 py-1 text-xs font-semibold">
                        {status === "draft"
                          ? "Draft"
                          : status === "published"
                            ? "Published"
                            : status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-gray-500">
                      {String(
                        article.created_at ??
                          article.updated_at ??
                          "—"
                      ).slice(0, 10)}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busy || !id}
                          onClick={() => startEdit(article)}
                          className="rounded-lg border px-3 py-2 font-medium disabled:opacity-40"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            busy || !id || status === "published"
                          }
                          onClick={() => void handlePublish(id)}
                          className="rounded-lg bg-[#8a4b1f] px-3 py-2 text-white disabled:opacity-40"
                        >
                          Publish
                        </button>

                        {status === "published" && (
                          <button
                            type="button"
                            disabled={busy || !id}
                            onClick={() => void handleUnpublish(id)}
                            className="rounded-lg border border-amber-300 px-3 py-2 text-amber-800 disabled:opacity-40"
                          >
                            Unpublish
                          </button>
                        )}

                        {id && !id.startsWith("art-") && (
                          <Link
                            href={`/admin/articles/${id}/revisions`}
                            className="rounded-lg border border-[#8a4b1f] px-3 py-2 font-medium text-[#8a4b1f] hover:bg-[#f7efe3]"
                          >
                            History
                          </Link>
                        )}

                        <button
                          type="button"
                          disabled={busy || !id}
                          onClick={() => void handleDelete(id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-red-700 disabled:opacity-40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-12 text-center text-gray-500"
                  >
                    कोई लेख नहीं मिला। Search या Filter बदलकर देखें।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
