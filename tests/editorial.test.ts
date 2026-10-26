import { describe, expect, it } from "vitest";
import {
  articleInputSchema,
  FIXED_CATEGORY_SLUGS,
  isFixedCategorySlug,
  validateArticleInput,
} from "../lib/editorial";

const validInput = {
  title: "यह परीक्षण शीर्षक ठीक चालीस अक्षरों से अधिक लंबा होना चाहिए",
  excerpt: "यह संक्षिप्त विवरण है।",
  body: "पूर्ण लेख सामग्री।",
  categorySlug: "history",
  tags: ["राजस्थान"],
};

describe("editorial validation", () => {
  it("keeps exactly the seven approved category slugs", () => {
    expect(FIXED_CATEGORY_SLUGS).toHaveLength(7);
    expect(isFixedCategorySlug("history")).toBe(true);
    expect(isFixedCategorySlug("news")).toBe(false);
  });

  it("accepts a handbook-compliant article", () => {
    expect(validateArticleInput(validInput)).toBeNull();
    expect(articleInputSchema.safeParse(validInput).success).toBe(true);
  });

  it("rejects invalid title, description, category, and tag count", () => {
    expect(
      validateArticleInput({ ...validInput, title: "छोटा" }),
    ).not.toBeNull();
    expect(validateArticleInput({ ...validInput, excerpt: "" })).not.toBeNull();
    expect(
      validateArticleInput({ ...validInput, categorySlug: "news" }),
    ).not.toBeNull();
    expect(
      validateArticleInput({
        ...validInput,
        tags: ["1", "2", "3", "4", "5", "6"],
      }),
    ).not.toBeNull();
  });
});
