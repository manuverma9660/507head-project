"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useRef, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";
import { parseRichText, type RichTextDocument } from "@/lib/rich-text";
import { uploadCloudinaryImage } from "@/lib/media-upload-client";

type Props = {
  onChange: (document: RichTextDocument, plainText: string) => void;
  content?: RichTextDocument | string | null;
};

function getPlainText(document: RichTextDocument) {
  return document.content
    .map((node) => {
      const walk = (item: { text?: string; content?: unknown[] }): string =>
        item.text ??
        (Array.isArray(item.content)
          ? item.content
              .map((child) =>
                walk(child as { text?: string; content?: unknown[] }),
              )
              .join("")
          : "");
      return walk(node);
    })
    .join("\n\n")
    .trim();
}

export default function RichTextEditor({ onChange, content = "" }: Props) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const initialContent =
    typeof content === "string" ? parseRichText(content) ?? content : content;
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https"],
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "min-h-72 rounded-b-xl border border-t-0 border-[#e7ddd0] bg-white px-4 py-3 leading-8 outline-none focus:border-[#8a4b1f]",
        "aria-label": "समाचार की सामग्री",
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      const document = activeEditor.getJSON() as RichTextDocument;
      onChange(document, getPlainText(document));
    },
  });

  if (!editor)
    return <div className="min-h-72 animate-pulse rounded-xl bg-[#f7f3ed]" />;

  const buttonClass =
    "rounded px-2 py-1 text-xs font-bold hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#245d92]";
  const toggleLink = () => {
    const href = window.prompt("Link URL (https://...)");
    if (href?.startsWith("http://") || href?.startsWith("https://"))
      editor.chain().focus().setLink({ href }).run();
  };
  const addUploadedImage = async (file?: File) => {
    if (!file || uploadingImage) return;
    setUploadingImage(true);
    try {
      const asset = await uploadCloudinaryImage(file);
      editor.chain().focus().setImage({ src: asset.url }).run();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Image upload नहीं हुआ।");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        className="flex flex-wrap gap-1 rounded-t-xl border border-[#e7ddd0] bg-[#f7f3ed] p-2"
        role="toolbar"
        aria-label="Text formatting"
      >
        <button
          type="button"
          className={buttonClass}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          H3
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          Table
        </button>
        <button type="button" className={buttonClass} onClick={toggleLink}>
          Link
        </button>
        <button type="button" className={buttonClass} onClick={() => imageInputRef.current?.click()}>
          {uploadingImage ? "Uploading…" : "Image upload"}
        </button>
        <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={(event) => void addUploadedImage(event.target.files?.[0])} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
