"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function RedirectStatusNotice({ success, error }: { success?: string; error?: string }) {
  const [visible, setVisible] = useState(Boolean(success || error));
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!success && !error) return;
    const timer = window.setTimeout(() => {
      setVisible(false);
      router.replace(pathname);
    }, error ? 5000 : 1800);
    return () => window.clearTimeout(timer);
  }, [error, pathname, router, success]);

  if (!visible) return null;
  if (success) return <p className="mb-5 rounded-xl bg-green-50 p-4 text-sm text-green-800">Redirect saved successfully.</p>;
  return <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">Redirect save नहीं हुआ। Internal path दें, loop और /admin paths नहीं।</p>;
}
