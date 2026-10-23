export type RichTextMark = { type: "bold" | "italic" | "link"; attrs?: { href?: string } };

export type RichTextNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: RichTextMark[];
  content?: RichTextNode[];
};

export type RichTextDocument = { type: "doc"; content: RichTextNode[] };

export function parseRichText(value: string): RichTextDocument | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const document = parsed as RichTextDocument;
    if (document.type !== "doc" || !Array.isArray(document.content)) return null;
    return document;
  } catch {
    return null;
  }
}

export function richTextToPlainText(node: RichTextNode | RichTextDocument): string {
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";
  const content = node.content?.map(richTextToPlainText).join("") ?? "";
  return /^(paragraph|heading|blockquote|listItem)$/.test(node.type) ? `${content}\n\n` : content;
}

export function richTextSummary(document: RichTextDocument): string {
  return richTextToPlainText(document).replace(/\n{3,}/g, "\n\n").trim();
}
