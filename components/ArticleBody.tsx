import Image from "next/image";
import type { ReactNode } from "react";
import type {
  RichTextDocument,
  RichTextMark,
  RichTextNode,
} from "@/lib/rich-text";

function marks(text: string, nodeMarks?: RichTextMark[]): ReactNode {
  return (nodeMarks ?? []).reduce<ReactNode>((result, mark) => {
    if (mark.type === "bold") return <strong>{result}</strong>;
    if (mark.type === "italic") return <em>{result}</em>;
    if (mark.type === "link" && mark.attrs?.href?.startsWith("http"))
      return (
        <a
          href={mark.attrs.href}
          className="text-[#8a4b1f] underline"
          rel="noopener noreferrer"
        >
          {result}
        </a>
      );
    return result;
  }, text);
}

function renderNode(node: RichTextNode, key: string): ReactNode {
  const children = node.content?.map((child, index) =>
    renderNode(child, `${key}-${index}`),
  );
  switch (node.type) {
    case "text":
      return <span key={key}>{marks(node.text ?? "", node.marks)}</span>;
    case "hardBreak":
      return <br key={key} />;
    case "heading":
      return node.attrs?.level === 3 ? (
        <h3 key={key} className="mt-8 text-2xl font-bold">
          {children}
        </h3>
      ) : (
        <h2 key={key} className="mt-10 text-3xl font-bold">
          {children}
        </h2>
      );
    case "paragraph":
      return (
        <p key={key} className="leading-relaxed">
          {children}
        </p>
      );
    case "bulletList":
      return (
        <ul key={key} className="list-disc space-y-2 pl-6">
          {children}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="list-decimal space-y-2 pl-6">
          {children}
        </ol>
      );
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-[#8a4b1f] pl-4 italic text-[#555]"
        >
          {children}
        </blockquote>
      );
    case "table":
      return (
        <div key={key} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse border border-[#e5ddd3] text-base">
            {children}
          </table>
        </div>
      );
    case "tableRow":
      return (
        <tr key={key} className="border-b border-[#e5ddd3]">
          {children}
        </tr>
      );
    case "tableHeader":
      return (
        <th
          key={key}
          className="border border-[#e5ddd3] bg-[#f7efe3] p-3 text-left font-bold"
        >
          {children}
        </th>
      );
    case "tableCell":
      return (
        <td key={key} className="border border-[#e5ddd3] p-3 align-top">
          {children}
        </td>
      );
    case "image": {
      const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
      return src.startsWith("https://") ? (
        <Image
          key={key}
          src={src}
          alt={typeof node.attrs?.alt === "string" ? node.attrs.alt : ""}
          width={1200}
          height={675}
          unoptimized
          className="my-6 h-auto w-full rounded-xl"
        />
      ) : null;
    }
    default:
      return <>{children}</>;
  }
}

export default function ArticleBody({
  richBody,
  fallback,
}: {
  richBody?: RichTextDocument | null;
  fallback: string[];
}) {
  if (richBody?.content?.length)
    return (
      <>
        {richBody.content.map((node, index) => renderNode(node, String(index)))}
      </>
    );
  return (
    <>
      {fallback.map((paragraph, index) => (
        <p key={index} className="leading-relaxed">
          {paragraph}
        </p>
      ))}
    </>
  );
}
