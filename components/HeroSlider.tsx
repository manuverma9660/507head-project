"use client";

import RemoteArticleImage from "@/components/RemoteArticleImage";
import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = {
  image: string;
  title: string;
  excerpt: string;
  href: string;
  category: string;
};

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [active, setActive] = useState(0);
  const total = slides.length;

  useEffect(() => {
    if (total < 2) return;
    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % total),
      5500,
    );
    return () => window.clearInterval(timer);
  }, [total]);

  if (!total) return null;
  const slide = slides[active];

  return (
    <section className="group/hero border-b border-[#cde7ea] bg-[#063f47]">
      <div className="relative isolate min-h-[500px] overflow-hidden sm:min-h-[520px]">
        {slides.map((item, index) => (
          <RemoteArticleImage
            key={item.image}
            src={item.image}
            alt=""
            className={`object-cover transition-opacity duration-700 ${index === active ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/48 to-black/10" />
        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-end px-4 pb-28 pt-10 sm:min-h-[520px] sm:px-6 sm:py-14">
          <div className="max-w-3xl text-white">
            <p className="mb-4 inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold tracking-wide backdrop-blur">
              {slide.category}
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-[3.5rem]">
              {slide.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              {slide.excerpt}
            </p>
            <Link
              href={slide.href}
              className="mt-7 inline-flex items-center rounded-xl bg-[#0a92a0] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#056a75]"
            >
              पूरा लेख पढ़ें{" "}
              <span className="ml-2" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 items-center gap-3 opacity-100 transition-opacity duration-200 md:pointer-events-none md:opacity-0 md:group-hover/hero:pointer-events-auto md:group-hover/hero:opacity-100 md:group-focus-within/hero:pointer-events-auto md:group-focus-within/hero:opacity-100 sm:bottom-20">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => setActive((active - 1 + total) % total)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/50 bg-black/25 text-xl text-white backdrop-blur transition hover:bg-white hover:text-black"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => setActive((active + 1) % total)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/50 bg-black/25 text-xl text-white backdrop-blur transition hover:bg-white hover:text-black"
          >
            ›
          </button>
        </div>
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-8">
          {slides.map((item, index) => (
            <button
              key={item.image}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all ${index === active ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
