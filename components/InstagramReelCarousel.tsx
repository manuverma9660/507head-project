/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";

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
  const scroll = (direction: number) =>
    rail.current?.scrollBy({ left: direction * 300, behavior: "smooth" });

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="पिछली रील"
        onClick={() => scroll(-1)}
        className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-white/95 text-2xl shadow-md md:block"
      >
        ‹
      </button>
      <div
        ref={rail}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 scroll-smooth sm:gap-5 md:px-14"
      >
        {reels.map((reel) => (
          <a
            key={reel.id}
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative h-[370px] w-[220px] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#21150d] shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:h-[430px] sm:w-[255px]"
          >
            {reel.image ? (
              <img
                src={reel.image}
                alt={reel.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            ) : (
              <iframe
                title={reel.title}
                src={`${reel.url.replace(/\/$/, "")}/embed/`}
                className="h-full w-full border-0 bg-white"
                loading="lazy"
              />
            )}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent px-4 pb-4 pt-16 text-sm font-bold text-white">
              ▶ {reel.title}
            </span>
          </a>
        ))}
      </div>
      <button
        type="button"
        aria-label="अगली रील"
        onClick={() => scroll(1)}
        className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 rounded-full bg-white/95 text-2xl shadow-md md:block"
      >
        ›
      </button>
    </div>
  );
}
