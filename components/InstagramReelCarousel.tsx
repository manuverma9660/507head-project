/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type HomepageReel = {
  id: string;
  title: string;
  image?: string | null;
  url: string;
};

export default function InstagramReelCarousel({
  reels,
}: {
  reels: HomepageReel[];
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  const hasCarouselControls = reels.length > 5;

  const updateScrollControls = useCallback(() => {
    const element = rail.current;
    if (!element || !hasCarouselControls) return;

    setCanScrollBack(element.scrollLeft > 1);
    setCanScrollForward(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    );
  }, [hasCarouselControls]);

  useEffect(() => {
    updateScrollControls();
    window.addEventListener("resize", updateScrollControls);
    return () => window.removeEventListener("resize", updateScrollControls);
  }, [reels, updateScrollControls]);

  const scroll = (direction: number) => {
    const element = rail.current;
    if (!element) return;

    element.scrollBy({
      left: direction * Math.max(300, element.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {hasCarouselControls ? (
        <button
          type="button"
          aria-label="पिछली रील"
          disabled={!canScrollBack}
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-[#F7F6EE]/95 text-2xl shadow-md transition hover:bg-[#F7F6EE] disabled:pointer-events-none disabled:opacity-0 md:block"
        >
          ‹
        </button>
      ) : null}
      <div
        ref={rail}
        onScroll={updateScrollControls}
        className={`no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 scroll-smooth sm:gap-5 ${hasCarouselControls ? "md:px-14" : "md:px-1"}`}
      >
        {reels.map((reel) => (
          <a
            key={reel.id}
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-[9/16] w-[62vw] max-w-[220px] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#21150d] shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-[36vw] sm:max-w-[245px] md:w-[28vw] md:max-w-[255px] lg:w-[220px] xl:w-[255px]"
          >
            {reel.image ? (
              <img
                src={reel.image}
                alt={reel.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-5 text-center text-white">
                <span className="mb-3 text-5xl">◎</span>
                <span className="text-sm font-bold">Instagram Reel</span>
                <span className="mt-2 text-xs text-white/85">
                  देखने के लिए खोलें
                </span>
              </div>
            )}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent px-4 pb-4 pt-16 text-sm font-bold text-white">
              ▶ {reel.title}
            </span>
          </a>
        ))}
      </div>
      {hasCarouselControls ? (
        <button
          type="button"
          aria-label="अगली रील"
          disabled={!canScrollForward}
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-[#F7F6EE]/95 text-2xl shadow-md transition hover:bg-[#F7F6EE] disabled:pointer-events-none disabled:opacity-0 md:block"
        >
          ›
        </button>
      ) : null}
    </div>
  );
}
