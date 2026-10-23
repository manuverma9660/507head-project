"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type MediaFile = {
  name: string;
  size: number;
  url: string;
  created_at: string;
};

export default function MediaLibraryClient({
  initialFiles,
}: {
  initialFiles: MediaFile[];
}) {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    setUploading(true);
    setMessage("");

    const supabase = createClient();
    const uploaded: MediaFile[] = [];

    for (const file of Array.from(selected)) {
      const ext = file.name.split(".").pop();
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("media")
        .upload(safeName, file, { upsert: false });

      if (error) {
        setMessage(`❌ ${file.name} अपलोड नहीं हुई: ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(safeName);
      uploaded.push({
        name: safeName,
        size: file.size,
        url: data.publicUrl,
        created_at: new Date().toISOString(),
      });
    }

    // Preserve the real storage error when every upload fails.
    if (uploaded.length > 0) {
      setFiles((prev) => [...uploaded, ...prev]);
    setMessage(`✅ ${uploaded.length} फाइल(ें) अपलोड हो गई।`);
    }
    setUploading(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(name: string) {
    if (!window.confirm(`"${name}" को डिलीट करना चाहते हैं?`)) return;

    const supabase = createClient();
    const { error } = await supabase.storage.from("media").remove([name]);

    if (error) {
      setMessage(`❌ डिलीट नहीं हुई: ${error.message}`);
      return;
    }

    setFiles((prev) => prev.filter((f) => f.name !== name));
    setMessage("✅ फाइल डिलीट हो गई।");
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(url);
      setTimeout(() => setCopied(""), 2000);
    });
  }

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="rounded-2xl border border-[#e7ddd0] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">नई फाइल अपलोड करें</h2>
        <label
          htmlFor="media-upload"
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#c4a882] bg-[#fdf7f0] p-10 text-center transition hover:border-[#8a4b1f] hover:bg-[#f7efe3] ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          <span className="text-4xl">🖼️</span>
          <span className="text-sm font-semibold text-[#8a4b1f]">
            {uploading ? "अपलोड हो रहा है..." : "यहाँ क्लिक करें या फाइल खींचकर छोड़ें"}
          </span>
          <span className="text-xs text-gray-500">
            JPG, PNG, WebP, GIF — max 10 MB प्रति फाइल
          </span>
          <input
            id="media-upload"
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>

        {message && (
          <p className="mt-4 rounded-lg bg-[#f7f3ed] p-3 text-sm">{message}</p>
        )}
      </div>

      {/* Files Grid */}
      <div className="rounded-2xl border border-[#e7ddd0] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">
          सभी मीडिया ({files.length} फाइलें)
        </h2>

        {files.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            कोई मीडिया फाइल नहीं मिली। ऊपर से अपलोड करें।
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {files.map((file) => (
              <div
                key={file.name}
                className="group relative overflow-hidden rounded-xl border border-[#e7ddd0] bg-[#fdf7f0]"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[#eee]">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    unoptimized
                    className="object-cover transition group-hover:scale-105"
                  />
                </div>

                <div className="p-2">
                  <p className="truncate text-xs font-semibold text-[#333]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatBytes(file.size)}
                  </p>

                  <div className="mt-2 flex gap-1.5">
                    <button
                      onClick={() => copyUrl(file.url)}
                      className="flex-1 rounded-lg bg-[#f7efe3] px-2 py-1.5 text-xs font-bold text-[#8a4b1f] transition hover:bg-[#8a4b1f] hover:text-white"
                    >
                      {copied === file.url ? "✓ Copied!" : "Copy URL"}
                    </button>
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="rounded-lg border border-red-200 px-2 py-1.5 text-xs text-red-600 transition hover:bg-red-50"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
