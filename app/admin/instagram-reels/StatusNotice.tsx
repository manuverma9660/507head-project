"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StatusNotice({
  status,
  message,
}: {
  status: string;
  message: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      router.replace("/admin/instagram-reels", { scroll: false });
    }, 2000);
    return () => window.clearTimeout(timeout);
  }, [router]);

  return (
    <p
      className={`mt-6 rounded-xl px-4 py-3 text-sm ${["added", "deleted"].includes(status) ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
    >
      {message}
    </p>
  );
}
