"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
  uploadCloudinaryImage,
} from "@/lib/media-upload-client";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  name?: string;
  optional?: boolean;
};

export default function CloudinaryImageField({
  value,
  onChange,
  label = "Featured image",
  name,
  optional = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function addFile(file?: File) {
    if (!file || uploading) return;
    setUploading(true);
    setMessage("");
    try {
      const asset = await uploadCloudinaryImage(file);
      onChange(asset.url);
      setMessage("✓ Image Cloudinary पर optimize होकर save हो गई।");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload नहीं हुआ।");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block font-semibold">{label}{optional ? " (optional)" : ""}</label>
        {value && <button type="button" onClick={() => onChange("")} className="text-xs font-bold text-red-700 hover:underline">Image हटाएँ</button>}
      </div>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => { event.preventDefault(); void addFile(event.dataTransfer.files[0]); }}
        disabled={uploading}
        className="flex min-h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#8a4b1f]/40 bg-[#f7efe3] p-4 text-center transition hover:border-[#8a4b1f] disabled:cursor-wait disabled:opacity-60"
      >
        <span className="text-sm font-bold text-[#8a4b1f]">{uploading ? "Cloudinary पर upload हो रहा है…" : "Image चुनें या यहाँ drag-and-drop करें"}</span>
        <span className="mt-1 text-xs text-[#666]">JPG, PNG, WebP, GIF या AVIF · अधिकतम {MAX_IMAGE_UPLOAD_BYTES / 1024 / 1024} MB · 2400px तक optimize</span>
      </button>
      <input ref={inputRef} type="file" accept={Array.from(ACCEPTED_IMAGE_TYPES).join(",")} className="hidden" onChange={(event) => void addFile(event.target.files?.[0])} />
      {message && <p className="mt-2 text-sm" role="status">{message}</p>}
      {value && <div className="relative mt-3 h-44 overflow-hidden rounded-xl border border-[#e7ddd0]"><Image src={value} alt="Selected upload" fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" /></div>}
    </div>
  );
}
