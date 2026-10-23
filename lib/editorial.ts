export const FIXED_CATEGORY_SLUGS = [
  "history",
  "farming",
  "kisan",
  "wisdom",
  "heritage",
  "pashupalan",
  "food",
] as const;

export type FixedCategorySlug = (typeof FIXED_CATEGORY_SLUGS)[number];

export function isFixedCategorySlug(value: string): value is FixedCategorySlug {
  return FIXED_CATEGORY_SLUGS.includes(value as FixedCategorySlug);
}

export function validateArticleInput({
  title,
  excerpt,
  body,
  categorySlug,
  tags,
}: {
  title: string;
  excerpt: string;
  body: string;
  categorySlug: string;
  tags: string[];
}): string | null {
  if (title.length < 40 || title.length > 70) {
    return "शीर्षक 40 से 70 अक्षरों के बीच होना चाहिए।";
  }
  if (!excerpt || excerpt.length > 160) {
    return "विवरण जरूरी है और अधिकतम 160 अक्षरों का हो सकता है।";
  }
  if (!body) return "समाचार की सामग्री भरना जरूरी है।";
  if (!isFixedCategorySlug(categorySlug)) return "कृपया अनुमोदित श्रेणी चुनें।";
  if (tags.length > 5) return "अधिकतम 5 टैग जोड़े जा सकते हैं।";
  return null;
}
