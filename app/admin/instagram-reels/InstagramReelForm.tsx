"use client";

import { useState } from "react";
import CloudinaryImageField from "@/components/admin/CloudinaryImageField";
import { addInstagramReel } from "./actions";

export default function InstagramReelForm() {
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  return (
    <form action={addInstagramReel} className="mt-7 grid gap-4 rounded-2xl border border-[#e8dac9] bg-white p-5 shadow-sm md:grid-cols-2 md:p-7">
      <label className="grid gap-2 md:col-span-2"><span className="text-sm font-bold">Instagram Reel URL *</span><input name="reel_url" required placeholder="https://www.instagram.com/reel/.../" className="rounded-xl border border-[#dfd3c5] px-4 py-3" /></label>
      <label className="grid gap-2"><span className="text-sm font-bold">Title</span><input name="title" maxLength={120} placeholder="रील का नाम" className="rounded-xl border border-[#dfd3c5] px-4 py-3" /></label>
      <CloudinaryImageField label="Cover image" name="thumbnail_url" value={thumbnailUrl} onChange={setThumbnailUrl} />
      <button className="w-fit rounded-xl bg-[#8a4b1f] px-5 py-3 font-bold text-white hover:bg-[#6b3915]">Reel जोड़ें</button>
    </form>
  );
}
