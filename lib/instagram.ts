import { cacheLife, cacheTag } from "next/cache";

export type InstagramReel = {
  id: string;
  title: string;
  image: string;
  url: string;
};

type InstagramMedia = {
  id: string;
  caption?: string;
  media_type?: string;
  thumbnail_url?: string;
  permalink?: string;
};

export async function getLatestInstagramReels(): Promise<InstagramReel[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("instagram-reels");

  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const apiVersion = process.env.INSTAGRAM_GRAPH_API_VERSION || "v23.0";

  if (!accountId || !accessToken) return [];

  const url = new URL(`https://graph.facebook.com/${apiVersion}/${accountId}/media`);
  url.searchParams.set("fields", "id,caption,media_type,thumbnail_url,permalink,timestamp");
  url.searchParams.set("limit", "12");
  url.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) return [];

    const payload = (await response.json()) as { data?: InstagramMedia[] };
    return (payload.data ?? [])
      .filter((media) => (media.media_type === "REELS" || media.media_type === "VIDEO") && media.thumbnail_url && media.permalink)
      .slice(0, 4)
      .map((media) => ({
        id: media.id,
        title: media.caption?.split("\n")[0].trim().slice(0, 120) || "Latest reel from 507 Head",
        image: media.thumbnail_url as string,
        url: media.permalink as string,
      }));
  } catch {
    return [];
  }
}
