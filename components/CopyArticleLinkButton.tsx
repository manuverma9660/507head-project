"use client";

import { useState } from "react";
import { FiLink } from "react-icons/fi";

type CopyArticleLinkButtonProps = {
  url: string;
};

export default function CopyArticleLinkButton({ url }: CopyArticleLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("इस लिंक को कॉपी करें:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      aria-label="लेख का लिंक कॉपी करें"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#222] bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#f5f5f5]"
    >
      <FiLink aria-hidden className="h-5 w-5" />
      {copied && (
        <span className="absolute -bottom-8 whitespace-nowrap rounded bg-[#222] px-2 py-1 text-xs font-semibold text-white">
          लिंक कॉपी हो गया
        </span>
      )}
    </button>
  );
}
