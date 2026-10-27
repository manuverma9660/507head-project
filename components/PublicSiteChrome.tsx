"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SocialIcon from "@/components/SocialIcon";

type NavigationCategory = { slug: string; name: string };

const categories = [
  ["history", "इतिहास और विरासत"],
  ["farming", "खेती-बाड़ी"],
  ["kisan", "किसान"],
  ["wisdom", "बुजुर्गों की सीख"],
  ["heritage", "सांस्कृतिक विरासत"],
  ["pashupalan", "पशुपालन"],
  ["food", "खान-पान"],
] as const;
const fallbackCategories: NavigationCategory[] = categories.map(
  ([slug, name]) => ({ slug, name }),
);
const socials = [
  ["facebook", "https://www.facebook.com/507Head/", "Facebook"],
  ["instagram", "https://www.instagram.com/507head/", "Instagram"],
  [
    "youtube",
    "https://www.youtube.com/channel/UC0QF1fncNE4Z8G8ryNa4DiQ",
    "YouTube",
  ],
] as const;

function Header({
  categories = fallbackCategories,
}: {
  categories?: NavigationCategory[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <div className="bg-[#6b3915] px-4 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        507 HEAD — अपनी मिट्टी, अपनी पहचान, अपनी कहानियाँ • छतरगढ़, बीकानेर
      </div>
      <header className="sticky top-0 z-40 border-b border-[#e5ddd3] bg-white backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-1.5 px-3 py-3 sm:gap-4 sm:px-6 sm:py-3.5">
          <Link
            href="/"
            prefetch
            className="flex min-w-0 items-center gap-2 sm:gap-3"
          >
            <Image
              src="/images/507-head-logo.jfif"
              alt="507 हेड"
              width={96}
              height={96}
                className="logo-handbook-tone h-12 w-12 shrink-0 rounded-xl bg-white object-cover shadow-sm sm:h-14 sm:w-14"
            />
            <span className="min-w-0 leading-tight">
              <strong className="block text-lg font-black tracking-tight text-[#8a4b1f] sm:text-2xl">
                507 हेड
              </strong>
              <small className="hidden text-xs font-semibold text-[#8a4b1f] min-[390px]:block">
                जल, प्रकृति और जनजीवन
              </small>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-[#8a4b1f] xl:flex">
            <Link href="/" prefetch className="font-bold text-[#8a4b1f]">
              होम
            </Link>
            {categories.map(({ slug, name }) => (
              <Link
                key={slug}
                href={`/category/${slug}`}
                prefetch
                className="transition-colors hover:text-[#8a4b1f]"
              >
                {name}
              </Link>
            ))}
          </nav>
          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            {socials.map(([name, href, label]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[#222] bg-[#F7F6EE] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#f5f5f5] sm:h-10 sm:w-10"
              >
                <SocialIcon name={name} className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            ))}
          </div>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
            aria-label={menuOpen ? "मेनू बंद करें" : "मेनू खोलें"}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#e5ddd3] text-[#6b3915] transition hover:bg-[#F7F4DE] focus:outline-none focus:ring-2 focus:ring-[#245d92] focus:ring-offset-2 xl:hidden"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
        {menuOpen ? (
          <div
            id="mobile-site-menu"
            className="border-t border-[#e5ddd3] bg-[#F7F4DE] px-4 py-4 shadow-lg xl:hidden"
          >
            <nav aria-label="Mobile navigation" className="grid gap-1">
              <Link
                href="/"
                prefetch
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-bold text-[#8a4b1f] transition hover:bg-[#F7F6EE]"
              >
                होम
              </Link>
              {categories.map(({ slug, name }) => (
                <Link
                  key={slug}
                  href={`/category/${slug}`}
                  prefetch
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-semibold text-[#8a4b1f] transition hover:bg-[#F7F6EE] hover:text-[#8a4b1f]"
                >
                  {name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex gap-3 border-t border-[#e5ddd3] pt-4">
              {socials.map(([name, href, label]) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8a4b1f] bg-[#F7F6EE] text-[#6b3915] transition hover:bg-[#8a4b1f] hover:text-white"
                >
                  <SocialIcon name={name} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        ) : null}
        <nav
          aria-label="श्रेणियाँ"
          className="hidden"
        >
          <Link
            href="/"
            prefetch
            className="shrink-0 snap-start text-[#8a4b1f]"
          >
            होम
          </Link>
          {categories.map(({ slug, name }) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              prefetch
              className="shrink-0 snap-start hover:text-[#8a4b1f]"
            >
              {name}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}

function Footer({
  categories = fallbackCategories,
}: {
  categories?: NavigationCategory[];
}) {
  return (
    <footer className="border-t border-[#e5ddd3] bg-[#F7F6EE] pb-8 pt-14 text-[#555]">
      <div className="mx-auto grid max-w-7xl gap-10 border-b border-[#f0e7dd] px-4 pb-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/507-head-logo.jfif"
              alt="507 हेड"
              width={96}
              height={96}
                className="logo-handbook-tone h-12 w-12 rounded-lg bg-white object-cover"
            />
            <span className="leading-tight">
              <strong className="block text-xl font-black text-[#222]">
                507 हेड
              </strong>
              <small className="text-xs text-[#777]">
                जल, प्रकृति और जनजीवन
              </small>
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-[#666]">
            बीकानेर के छतरगढ़ क्षेत्र से संचालित स्वतंत्र हिंदी न्यूज़ पोर्टल।
            थार रेगिस्तान, किसान, पशुपालन और मरुस्थलीय विरासत की सच्ची आवाज़।
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold text-[#222]">
            प्रमुख श्रेणियाँ
          </h4>
          <ul className="space-y-2 text-xs">
            {categories.map(({ slug, name }) => (
              <li key={slug}>
                <Link
                  href={`/category/${slug}`}
                  className="hover:text-[#8a4b1f]"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold text-[#222]">507 Head लिंक</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/about" className="hover:text-[#8a4b1f]">
                हमारे बारे में
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[#8a4b1f]">
                संपर्क करें
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-[#8a4b1f]">
                गोपनीयता नीति
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#8a4b1f]">
                नियम एवं शर्तें
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-bold text-[#222]">
            कार्यालय व संपर्क
          </h4>
          <p className="text-xs leading-relaxed text-[#666]">
            507 Head संपादकीय डेस्क,
            <br />
            छतरगढ़ तहसील, जिला बीकानेर,
            <br />
            राजस्थान — 334021
          </p>
          <p className="mt-3 text-xs font-semibold text-[#8a4b1f]">
            ईमेल: info.507head@gmail.com
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 pt-6 text-xs text-[#777] sm:flex-row sm:px-6">
        <p>© 2026 507 हेड। सर्वाधिकार सुरक्षित।</p>
        <p>डिजिटल राजस्थान • ग्रामीण पत्रकारिता की नई दिशा</p>
      </div>
    </footer>
  );
}

export default function PublicSiteChrome({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories?: NavigationCategory[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const prefetchedRoutes = useRef(new Set<string>());
  useEffect(() => {
    const prefetch = (href: string) => {
      if (!href.startsWith("/") || prefetchedRoutes.current.has(href)) return;
      prefetchedRoutes.current.add(href);
      router.prefetch(href);
    };

    const prefetchOnIntent = (event: Event) => {
      const target = event.target as HTMLElement;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      const href = link?.getAttribute("href");
      if (href) prefetch(href);
    };

    const openCard = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, label")) return;
      const card = target.closest<HTMLElement>("[data-article-href]");
      if (card?.dataset.articleHref) {
        prefetch(card.dataset.articleHref);
        router.push(card.dataset.articleHref);
      }
    };
    document.addEventListener("pointerover", prefetchOnIntent, {
      passive: true,
    });
    document.addEventListener("focusin", prefetchOnIntent);
    document.addEventListener("click", openCard);
    return () => {
      document.removeEventListener("pointerover", prefetchOnIntent);
      document.removeEventListener("focusin", prefetchOnIntent);
      document.removeEventListener("click", openCard);
    };
  }, [router]);
  if (pathname.startsWith("/admin") || pathname.startsWith("/api"))
    return <>{children}</>;
  return (
    <div className="public-site-shell">
      <Header categories={categories} />
      <div className="public-site-content">{children}</div>
      <Footer categories={categories} />
    </div>
  );
}
