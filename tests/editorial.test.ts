import { describe, expect, it } from "vitest";
import { articleInputSchema, validateArticleInput } from "../lib/editorial";

const validInput = {
  title: "यह एक सही परीक्षण लेख है",
  excerpt: "यह संक्षिप्त विवरण है।",
  body: "पूर्ण लेख सामग्री।",
  categorySlug: "history",
  tags: ["राजस्थान"],
};

describe("editorial validation", () => {
  it("accepts an existing or custom category slug", () => {
    expect(
      validateArticleInput({ ...validInput, categorySlug: "history" }),
    ).toBeNull();
    expect(
      validateArticleInput({ ...validInput, categorySlug: "recipes" }),
    ).toBeNull();
  });

  it("accepts a handbook-compliant article", () => {
    expect(validateArticleInput(validInput)).toBeNull();
    expect(articleInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects invalid title, description, category, and tag count", () => {
    expect(validateArticleInput({ ...validInput, title: "अ" })).not.toBeNull();
    expect(validateArticleInput({ ...validInput, excerpt: "" })).not.toBeNull();
    expect(
      validateArticleInput({ ...validInput, categorySlug: "Hindi Recipes" }),
    ).not.toBeNull();
    expect(
      validateArticleInput({
        ...validInput,
        tags: ["1", "2", "3", "4", "5", "6"],
      }),
    ).not.toBeNull();
  });
});
