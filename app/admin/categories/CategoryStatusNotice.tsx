"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const messages = {
  created: {
    text: "श्रेणी Supabase में जोड़ दी गई है।",
    className: "bg-green-50 text-green-800",
  },
  updated: {
    text: "इस स्लग वाली श्रेणी पहले से थी, उसे Supabase में अपडेट और सक्रिय कर दिया गया है।",
    className: "bg-blue-50 text-blue-800",
  },
  invalid: {
    text: "नाम और अंग्रेज़ी स्लग सही भरें, जैसे: local-news.",
    className: "bg-red-50 text-red-800",
  },
} as const;

export default function CategoryStatusNotice({ status }: { status?: string }) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const notice =
    status && status in messages
      ? messages[status as keyof typeof messages]
      : null;

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => {
      setVisible(false);
      router.replace("/admin/categories");
    }, 3500);
    return () => window.clearTimeout(timeout);
  }, [notice, router]);

  if (!notice || !visible) return null;

  return (
    <div
      className={`mb-5 flex items-center justify-between gap-4 rounded-xl px-4 py-3 text-sm font-semibold ${notice.className}`}
      role="status"
    >
      <span>{notice.text}</span>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          router.replace("/admin/categories");
        }}
        className="shrink-0 text-base leading-none"
        aria-label="संदेश बंद करें"
      >
        ×
      </button>
    </div>
  );
}
