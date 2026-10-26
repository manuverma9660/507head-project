import { z } from "zod";

const categorySlugSchema = z
  .string()
  .trim()
  .min(1, "Category is required.")
  .max(80, "Category slug must be at most 80 characters.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Category slug must use lowercase English letters, numbers, and hyphens only.",
  );

export const articleInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(40, "Title must be at most 40 characters."),
  excerpt: z
    .string()
    .trim()
    .min(1, "Excerpt is required.")
    .max(160, "Excerpt must be at most 160 characters."),
  body: z.string().trim().min(1, "Article body is required."),
  categorySlug: categorySlugSchema,
  tags: z.array(z.string().trim().min(1)).max(5, "Use at most five tags."),
});

export type ArticleInput = {
  title: string;
  excerpt: string;
  body: string;
  categorySlug: string;
  tags: string[];
};

export function validateArticleInput(input: ArticleInput): string | null {
  const result = articleInputSchema.safeParse(input);
  return result.success
    ? null
    : (result.error.issues[0]?.message ?? "Invalid article input.");
}
