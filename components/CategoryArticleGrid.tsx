"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article, Category } from "@/lib/content";

interface CategoryArticleGridProps {
  articles: Article[];
  categories: Category[];
}

export default function CategoryArticleGrid({
  articles,
  categories,
}: CategoryArticleGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category_slug === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Horizontal Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#e5ddd3] no-scrollbar">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
            selectedCategory === "all"
              ? "bg-[#8a4b1f] text-white shadow-sm"
              : "bg-[#f7efe3] text-[#6b3915] hover:bg-[#e8d9c7]"
          }`}
        >
          सभी खबरें ({articles.length})
        </button>

        {categories.map((cat) => {
          const count = articles.filter(
            (a) => a.category_slug === cat.slug,
          ).length;
          if (count === 0) return null;

          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`shrink-0 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all ${
                isSelected
                  ? "bg-[#8a4b1f] text-white shadow-sm"
                  : "bg-[#f7efe3] text-[#6b3915] hover:bg-[#e8d9c7]"
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Side-by-Side (आगे-पीछे) 3-Column Responsive Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#e5ddd3] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <Link
              href={`/blog/${article.slug}`}
              className="relative aspect-[16/9] w-full overflow-hidden bg-[#eee]"
            >
              <Image
                src={article.featured_image_url}
                alt={article.featured_image_alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {article.category_name}
              </span>
            </Link>

            <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between">
              <div>
                <div className="mb-2.5 flex items-center gap-2 text-xs text-[#888]">
                  <span>
                    {new Date(article.published_at).toLocaleDateString(
                      "hi-IN",
                      {
                        day: "numeric",
                        month: "short",
                      },
                    )}
                  </span>
                  <span>•</span>
                  <span>{article.reading_time_minutes} मिनट पठन</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold leading-snug line-clamp-2 text-[#222] group-hover:text-[#8a4b1f]">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#666] line-clamp-2">
                  {article.excerpt}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#f0e7dd] pt-4 text-xs">
                <span className="font-medium text-[#777]">
                  {article.author.name}
                </span>
                <Link
                  href={`/blog/${article.slug}`}
                  className="font-bold text-[#8a4b1f] hover:underline"
                >
                  पूरा पढ़ें →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
