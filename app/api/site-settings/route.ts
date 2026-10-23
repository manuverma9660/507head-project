import { getPublicSiteSettings } from "@/lib/site-settings";

export async function GET() {
  return Response.json(await getPublicSiteSettings());
}
