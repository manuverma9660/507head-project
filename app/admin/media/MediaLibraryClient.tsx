"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import {
  ACCEPTED_IMAGE_TYPES,
  imageUploadError,
  uploadCloudinaryImage,
} from "@/lib/media-upload-client";

export type MediaAsset = {
  id: string;
  public_id: string;
  url: string;
  width: number | null;
  height: number | null;
  bytes: number | null;
  format: string | null;
  original_filename: string | null;
  alt_text: string | null;
  created_at: string;
};

export default function MediaLibraryClient({
  initialFiles,
}: {
  initialFiles: MediaAsset[];
}) {
  const [files, setFiles] = useState(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<MediaAsset | null>(null);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function notify(value: string, durationMs = 0) {
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    setMessage(value);
    if (durationMs > 0) {
      messageTimerRef.current = setTimeout(() => setMessage(""), durationMs);
    }
  }

  const visibleFiles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle
      ? files.filter((file) =>
          `${file.original_filename} ${file.alt_text} ${file.public_id}`
            .toLowerCase()
            .includes(needle),
        )
      : files;
  }, [files, query]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;
    const invalid = selected.find(imageUploadError);
    if (invalid) {
      notify(
        "केवल JPG, PNG, WebP, GIF या AVIF (अधिकतम 10 MB) अपलोड करें।",
        5000,
      );
      return;
    }
    setUploading(true);
    notify("");
    let success = 0;
    for (const file of selected) {
      try {
        const signatureResponse = await fetch("/api/admin/media/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          }),
        });
        const signature = await signatureResponse.json();
        if (!signatureResponse.ok) throw new Error(signature.error);
        const uploadData = new FormData();
        uploadData.set("file", file);
        uploadData.set("api_key", signature.apiKey);
        uploadData.set("timestamp", String(signature.timestamp));
        uploadData.set("signature", signature.signature);
        uploadData.set("folder", signature.folder);
        uploadData.set("public_id", signature.publicId);
        uploadData.set("transformation", signature.transformation);
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
          { method: "POST", body: uploadData },
        );
        const uploadedAsset = await uploadResponse.json().catch(() => null);
        if (!uploadResponse.ok) {
          throw new Error(
            uploadedAsset?.error?.message || "Cloudinary upload failed",
          );
        }
        const completeResponse = await fetch("/api/admin/media/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: uploadedAsset?.public_id }),
        });
        const complete = await completeResponse.json();
        if (!completeResponse.ok) throw new Error(complete.error);
        setFiles((current) => [complete.asset as MediaAsset, ...current]);
        success++;
      } catch (error) {
        notify(
          error instanceof Error ? error.message : "अपलोड नहीं हुआ।",
          5000,
        );
      }
    }
    setUploading(false);
    if (success)
      notify(`✓ ${success} फ़ाइल Cloudinary और Supabase में save हो गई।`, 1800);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function saveAlt(file: MediaAsset) {
    const response = await fetch(`/api/admin/media/${file.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ altText }),
    });
    const data = await response.json();
    if (!response.ok) {
      notify(data.error, 5000);
      return;
    }
    setFiles((current) =>
      current.map((item) => (item.id === file.id ? data.asset : item)),
    );
    setEditing(null);
    notify("✓ Image विवरण save हो गया।", 1800);
  }

  async function replaceImage(file?: File) {
    if (!file || !replaceTarget) return;
    setUploading(true);
    try {
      const replacement = await uploadCloudinaryImage(file);
      const response = await fetch(`/api/admin/media/${replaceTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replacementPublicId: replacement.public_id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Image replace नहीं हुई।");
      setFiles((current) => current.map((item) => item.id === replaceTarget.id ? data.asset : item).filter((item) => item.id !== replacement.id));
      notify("Image replace हो गई और article URL update हो गया।", 2500);
    } catch (error) {
      notify(error instanceof Error ? error.message : "Image replace नहीं हुई।", 5000);
    } finally {
      setUploading(false);
      setReplaceTarget(null);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  }

  async function remove(file: MediaAsset) {
    if (!window.confirm("इस image को हमेशा के लिए delete करना है?")) return;
    const response = await fetch(`/api/admin/media/${file.id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      notify(data.error, 5000);
      return;
    }
    setFiles((current) => current.filter((item) => item.id !== file.id));
    notify("✓ Image delete हो गई।", 1800);
  }

  function copy(url: string) {
    navigator.clipboard
      .writeText(url)
      .then(() => notify("✓ Image URL copy हो गया।", 1800));
  }
  function formatBytes(value: number | null) {
    if (!value) return "";
    return value < 1024 * 1024
      ? `${Math.round(value / 1024)} KB`
      : `${(value / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      <input
        ref={replaceInputRef}
        type="file"
        accept={Array.from(ACCEPTED_IMAGE_TYPES).join(",")}
        className="hidden"
        onChange={(event) => void replaceImage(event.target.files?.[0])}
      />
      <section className="rounded-2xl border border-[#e7ddd0] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-4 text-lg font-bold">नई फ़ाइल अपलोड करें</h2>
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const dropped = Array.from(event.dataTransfer.files);
            if (dropped.length)
              void handleUpload({ target: { files: event.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#c4a882] bg-[#fdf7f0] p-8 text-center transition hover:border-[#8a4b1f] sm:p-10 ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <span className="text-4xl">🖼️</span>
          <span className="text-sm font-semibold text-[#8a4b1f]">
            {uploading
              ? "Cloudinary पर अपलोड हो रही है..."
              : "यहाँ क्लिक करें या फ़ाइल खींचकर छोड़ें"}
          </span>
          <span className="text-xs text-gray-500">
            JPG, PNG, WebP, GIF, AVIF — अधिकतम 10 MB प्रति फ़ाइल
          </span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={Array.from(ACCEPTED_IMAGE_TYPES).join(",")}
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
        {message && (
          <p className="mt-4 rounded-lg bg-[#f7f3ed] p-3 text-sm" role="status">
            {message}
          </p>
        )}
      </section>
      <section className="rounded-2xl border border-[#e7ddd0] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">
            Cloudinary Media ({files.length})
          </h2>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Image खोजें..."
            className="w-full rounded-lg border border-[#e7ddd0] px-3 py-2 text-sm sm:w-64"
          />
        </div>
        {!visibleFiles.length ? (
          <p className="py-12 text-center text-sm text-gray-500">
            कोई media file नहीं मिली।
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleFiles.map((file) => (
              <article
                key={file.id}
                className="overflow-hidden rounded-xl border border-[#e7ddd0] bg-[#fdf7f0]"
              >
                <div className="relative aspect-[4/3] bg-[#eee]">
                  <Image
                    src={file.url}
                    alt={
                      file.alt_text || file.original_filename || "Media image"
                    }
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-2">
                  <p className="truncate text-xs font-semibold">
                    {file.original_filename || file.public_id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.width && file.height
                      ? `${file.width}×${file.height}`
                      : ""}{" "}
                    {formatBytes(file.bytes)}
                  </p>
                  {editing === file.id ? (
                    <div className="space-y-1">
                      <input
                        autoFocus
                        value={altText}
                        onChange={(event) => setAltText(event.target.value)}
                        placeholder="Alt text"
                        className="w-full rounded border px-2 py-1 text-xs"
                      />
                      <button
                        onClick={() => saveAlt(file)}
                        className="rounded bg-[#8a4b1f] px-2 py-1 text-xs font-bold text-white"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditing(file.id);
                        setAltText(file.alt_text || "");
                      }}
                      className="text-xs text-[#8a4b1f] underline"
                    >
                      विवरण edit
                    </button>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => copy(file.url)}
                      className="flex-1 rounded bg-[#f7efe3] px-2 py-1.5 text-xs font-bold text-[#8a4b1f]"
                    >
                      URL Copy
                    </button>
                    <button
                      onClick={() => {
                        setReplaceTarget(file);
                        replaceInputRef.current?.click();
                      }}
                      className="rounded border border-[#8a4b1f] px-2 py-1.5 text-xs text-[#8a4b1f]"
                    >
                      Replace
                    </button>
                    <button
                      onClick={() => remove(file)}
                      className="rounded border border-red-200 px-2 py-1.5 text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
