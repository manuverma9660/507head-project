import { describe, expect, it } from "vitest";
import { parseRichText, richTextSummary } from "../lib/rich-text";

describe("rich text helpers", () => {
  it("keeps readable text from a structured Tiptap document", () => {
    const document = parseRichText(
      JSON.stringify({
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 2 },
            content: [{ type: "text", text: "शीर्षक" }],
          },
          {
            type: "paragraph",
            content: [{ type: "text", text: "पूरा समाचार" }],
          },
        ],
      }),
    );

    expect(document).not.toBeNull();
    expect(richTextSummary(document!)).toContain("शीर्षक");
    expect(richTextSummary(document!)).toContain("पूरा समाचार");
  });

  it("rejects malformed rich-text input", () => {
    expect(parseRichText("not-json")).toBeNull();
    expect(parseRichText(JSON.stringify({ type: "paragraph" }))).toBeNull();
  });
});
