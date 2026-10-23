import { NextResponse } from "next/server";

// Preserve compatibility for crawlers or older links that request a sitemap index.
export function GET(request: Request) {
  return NextResponse.redirect(new URL("/sitemap.xml", request.url), 301);
}
