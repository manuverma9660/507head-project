"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createArticle } from "../actions";
import type { RichTextDocument } from "@/lib/rich-text";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="min-h-72 animate-pulse rounded-xl bg-[#f7f3ed]" />
  ),
});

const CATEGORIES = [
  { slug: "news", name: "ताज़ा खबरें और रिपोर्ट (लेटेस्ट अपडेट्स)" },
  { slug: "farming", name: "खेती-बाड़ी" },
  { slug: "pashupalan", name: "पशुपालन" },
  { slug: "kisan", name: "किसान" },
  { slug: "wisdom", name: "बुजुर्गों की सीख" },
  { slug: "history", name: "इतिहास और विरासत" },
  { slug: "heritage", name: "सांस्कृतिक विरासत" },
  { slug: "food", name: "खान-पान" },
];

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [contentJson, setContentJson] = useState("");
  const [categorySlug, setCategorySlug] = useState("history");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [tags, setTags] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [readingTime, setReadingTime] = useState("3");
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const status =
      submitter instanceof HTMLButtonElement &&
      ["draft", "in_review", "published", "scheduled"].includes(submitter.value)
        ? submitter.value
        : "draft";

    formData.set("status", status);
    formData.set("category_slug", categorySlug);
    setMessage("");

    startTransition(async () => {
      try {
        const result = await createArticle(formData);
        setMessage(result.message);

        if (result.success) {
          router.push("/admin/articles");
        }
      } catch {
        setMessage("समाचार सेव नहीं हुआ। दोबारा कोशिश करें।");
      }
    });
  }

  // Auto-calculate reading time from content
  function handleContentChange(val: string) {
    setContent(val);
    const words = val.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    setReadingTime(String(minutes));
  }

  return (
    <main className="min-h-screen bg-[#f7f3ed] p-6 text-[#29231e] md:p-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin/articles"
          className="text-sm font-semibold text-[#8a4b1f] hover:underline"
        >
          ← वापस Articles पर जाएँ
        </Link>

        <section className="mt-6 rounded-2xl border border-[#e7ddd0] bg-white p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-[#8a4b1f]">
            507 HEAD · Editorial
          </p>
          <h1 className="mt-2 text-3xl font-bold">नया समाचार</h1>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <label className="mb-2 block font-semibold">
                समाचार का शीर्षक <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={40}
                maxLength={70}
                placeholder="समाचार का शीर्षक लिखें"
                className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="mb-2 block font-semibold">
                सारांश (Excerpt) <span className="text-red-500">*</span>
              </label>
              <textarea
                name="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                rows={2}
                maxLength={160}
                placeholder="समाचार का संक्षिप्त विवरण (SEO और preview के लिए)"
                className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block font-semibold">
                श्रेणी (Category) <span className="text-red-500">*</span>
              </label>
              <select
                name="category_slug"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full rounded-xl border border-[#e7ddd0] bg-white px-4 py-3 outline-none focus:border-[#8a4b1f]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Featured Image URL */}
            <div>
              <label className="mb-2 block font-semibold">
                Featured Image URL
              </label>
              <input
                name="featured_image_url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... (Media Library से copy करें)"
                className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
              />
              {imageUrl && (
                <div className="mt-2 overflow-hidden rounded-xl border border-[#e7ddd0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="preview"
                    className="h-40 w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              )}
            </div>

            {/* Image Alt */}
            <div>
              <label className="mb-2 block font-semibold">Image Alt Text</label>
              <input
                name="featured_image_alt"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="इमेज का विवरण (accessibility के लिए)"
                className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
              />
            </div>

            {/* Main Content */}
            <div>
              <label className="mb-2 block font-semibold">Image Caption</label>
              <input
                name="featured_image_caption"
                placeholder="फोटो में क्या दिख रहा है"
                className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Image Credit</label>
              <input
                name="featured_image_credit"
                placeholder="उदा. फोटो: 507 Head / नाम"
                className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                समाचार की सामग्री <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                onChange={(document: RichTextDocument, plainText) => {
                  setContentJson(JSON.stringify(document));
                  handleContentChange(plainText);
                }}
              />
              <input type="hidden" name="content_json" value={contentJson} />
              <p className="mb-2 text-xs text-gray-500">
                हर paragraph अलग line में लिखें। एक blank line = नया paragraph।
              </p>
              <textarea
                name="content"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                required
                rows={14}
                hidden
                disabled
                placeholder="पूरा समाचार यहाँ लिखें..."
                className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 font-mono text-sm outline-none focus:border-[#8a4b1f]"
              />
              <p className="mt-1 text-xs text-gray-500">
                अनुमानित पठन समय: ~{readingTime} मिनट
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block font-semibold">Tags</label>
              <input
                name="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="थार, किसान, बीकानेर (comma से अलग करें)"
                className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
              />
            </div>

            {/* Hidden reading time */}
            <input
              type="hidden"
              name="reading_time_minutes"
              value={readingTime}
            />

            <div>
              <label className="mb-2 block font-semibold">
                Schedule date and time
              </label>
              <input
                name="scheduled_for"
                type="datetime-local"
                value={scheduledFor}
                onChange={(event) => setScheduledFor(event.target.value)}
                className="w-full rounded-xl border border-[#e7ddd0] px-4 py-3 outline-none focus:border-[#8a4b1f]"
              />
              <p className="mt-1 text-xs text-gray-500">
                Future date चुनकर Schedule दबाएँ।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 border-t border-[#f0e7dd] pt-4">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="rounded-xl border border-[#8a4b1f] px-6 py-3 font-semibold text-[#8a4b1f] transition hover:bg-[#f7efe3]"
              >
                Preview देखें
              </button>
              <button
                type="submit"
                name="status"
                value="draft"
                disabled={isPending}
                className="rounded-xl border border-[#8a4b1f] px-6 py-3 font-semibold text-[#8a4b1f] transition hover:bg-[#f7efe3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "सेव हो रहा है..." : "Draft में सेव करें"}
              </button>

              <button
                type="submit"
                name="status"
                value="published"
                disabled={isPending}
                className="rounded-xl bg-[#8a4b1f] px-6 py-3 font-semibold text-white transition hover:bg-[#6b3915] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Publish हो रहा है..." : "🚀 Publish करें"}
              </button>
            </div>

            <button
              type="submit"
              name="status"
              value="in_review"
              disabled={isPending}
              className="rounded-xl border border-[#8a4b1f] px-6 py-3 font-semibold text-[#8a4b1f] transition hover:bg-[#f7efe3] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send for review
            </button>
            <button
              type="submit"
              name="status"
              value="scheduled"
              disabled={isPending || !scheduledFor}
              className="rounded-xl bg-[#6b3915] px-6 py-3 font-semibold text-white transition hover:bg-[#512a0f] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Schedule
            </button>
            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`rounded-lg p-3 text-sm ${message.includes("सफल") || message.includes("✅") ? "bg-green-50 text-green-800" : "bg-[#f7f3ed] text-[#29231e]"}`}
              >
                {message}
              </p>
            )}
          </form>

          {showPreview && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4">
              <div className="mx-auto my-8 max-w-3xl rounded-2xl bg-white p-6 shadow-xl md:p-10">
                <div className="flex items-center justify-between gap-4 border-b border-[#e7ddd0] pb-4">
                  <p className="text-sm font-bold uppercase tracking-widest text-[#8a4b1f]">
                    Draft Preview
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className="rounded-lg px-3 py-2 text-sm font-bold text-[#8a4b1f] hover:bg-[#f7efe3]"
                    aria-label="Preview बंद करें"
                  >
                    बंद करें
                  </button>
                </div>
                <article className="mx-auto max-w-2xl py-8">
                  <p className="text-sm font-bold text-[#8a4b1f]">
                    {categorySlug}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold leading-tight text-[#29231e]">
                    {title || "शीर्षक लिखें"}
                  </h2>
                  {excerpt && (
                    <p className="mt-4 text-lg text-gray-600">{excerpt}</p>
                  )}
                  {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={imageAlt || title}
                      className="mt-6 aspect-video w-full rounded-xl object-cover"
                    />
                  )}
                  <div className="mt-6 space-y-4 whitespace-pre-wrap leading-8 text-[#29231e]">
                    {content || "समाचार की सामग्री यहाँ दिखाई देगी।"}
                  </div>
                </article>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
