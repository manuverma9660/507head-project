import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

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

function normalizedInstagramUrl(value: string) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.replace(/\/$/, "");
  } catch {
    return value.replace(/[?#].*$/, "").replace(/\/$/, "");
  }
}

export async function getInstagramReelMetadata(reelUrl: string): Promise<{
  title?: string;
  image?: string;
}> {
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const apiVersion = process.env.INSTAGRAM_GRAPH_API_VERSION || "v23.0";
  if (!accountId || !accessToken) return {};

  const url = new URL(
    `https://graph.facebook.com/${apiVersion}/${accountId}/media`,
  );
  url.searchParams.set(
    "fields",
    "caption,media_type,thumbnail_url,permalink",
  );
  url.searchParams.set("limit", "100");
  url.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return {};
    const payload = (await response.json()) as { data?: InstagramMedia[] };
    const target = normalizedInstagramUrl(reelUrl);
    const media = (payload.data ?? []).find(
      (item) =>
        (item.media_type === "REELS" || item.media_type === "VIDEO") &&
        item.permalink &&
        normalizedInstagramUrl(item.permalink) === target,
    );
    if (!media) return {};
    return {
      title: media.caption?.split("\n")[0].trim().slice(0, 120),
      image: media.thumbnail_url,
    };
  } catch {
    return {};
  }
}

export async function getLatestInstagramReels(): Promise<InstagramReel[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("instagram-reels");

  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const apiVersion = process.env.INSTAGRAM_GRAPH_API_VERSION || "v23.0";

  if (!accountId || !accessToken) return [];

  const url = new URL(
    `https://graph.facebook.com/${apiVersion}/${accountId}/media`,
  );
  url.searchParams.set(
    "fields",
    "id,caption,media_type,thumbnail_url,permalink,timestamp",
  );
  url.searchParams.set("limit", "12");
  url.searchParams.set("access_token", accessToken);

  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) return [];

    const payload = (await response.json()) as { data?: InstagramMedia[] };
    return (payload.data ?? [])
      .filter(
        (media) =>
          (media.media_type === "REELS" || media.media_type === "VIDEO") &&
          media.thumbnail_url &&
          media.permalink,
      )
      .slice(0, 4)
      .map((media) => ({
        id: media.id,
        title:
          media.caption?.split("\n")[0].trim().slice(0, 120) ||
          "Latest reel from 507 Head",
        image: media.thumbnail_url as string,
        url: media.permalink as string,
      }));
  } catch {
    return [];
  }
}

export async function getHomepageInstagramReels(): Promise<InstagramReel[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("instagram-reels");

  const supabase = createPublicClient();
  if (supabase) {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "site")
      .maybeSingle();
    const value = data?.value;
    const savedReels =
      value && typeof value === "object" && !Array.isArray(value)
        ? (value as { instagram_reels?: unknown }).instagram_reels
        : null;
    if (Array.isArray(savedReels)) {
      const reels = savedReels
        .filter(
          (reel): reel is Record<string, unknown> =>
            Boolean(reel) && typeof reel === "object" && !Array.isArray(reel),
        )
        .map((reel) => ({
          id: typeof reel.id === "string" ? reel.id : "",
          title: typeof reel.title === "string" ? reel.title : "Instagram Reel",
          image: typeof reel.thumbnail_url === "string" ? reel.thumbnail_url : "",
          url: typeof reel.reel_url === "string" ? reel.reel_url : "",
        }))
        .filter((reel) => reel.id && reel.url);
      if (reels.length) return reels;
    }
  }

  return getLatestInstagramReels();
}
