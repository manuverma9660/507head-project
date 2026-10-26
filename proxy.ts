import { NextResponse, type NextRequest } from "next/server";

type RedirectRecord = { destination_path: string; status_code: 301 | 302 };

type CachedRedirect = {
  expiresAt: number;
  value: RedirectRecord | null;
};

// Reused Vercel instances retain this short cache. It avoids a database lookup
// for every normal navigation, while redirect edits become live within a minute.
const redirectCache = new Map<string, CachedRedirect>();
const REDIRECT_CACHE_MS = 60_000;

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next();

  const pathname =
    request.nextUrl.pathname.length > 1
      ? request.nextUrl.pathname.replace(/\/+$/, "")
      : "/";

  const cached = redirectCache.get(pathname);
  if (cached && cached.expiresAt > Date.now()) {
    if (!cached.value) return NextResponse.next();
    return NextResponse.redirect(
      new URL(cached.value.destination_path, request.url),
      cached.value.status_code,
    );
  }

  try {
    const response = await fetch(
      `${url}/rest/v1/redirects?source_path=eq.${encodeURIComponent(pathname)}&is_active=eq.true&select=destination_path,status_code&limit=1`,
      { headers: { apikey: key } },
    );
    if (!response.ok) return NextResponse.next();
    const [match] = (await response.json()) as RedirectRecord[];
    if (
      !match ||
      !match.destination_path.startsWith("/") ||
      match.destination_path.startsWith("//")
    ) {
      redirectCache.set(pathname, {
        value: null,
        expiresAt: Date.now() + REDIRECT_CACHE_MS,
      });
      return NextResponse.next();
    }
    redirectCache.set(pathname, {
      value: match,
      expiresAt: Date.now() + REDIRECT_CACHE_MS,
    });
    return NextResponse.redirect(
      new URL(match.destination_path, request.url),
      match.status_code,
    );
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!admin|api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|rss.xml).*)",
  ],
};
