import Image from "next/image";
import Link from "next/link";

const stories = [
  {
    title: "थार रेगिस्तान की पहचान और ग्रामीण जीवन",
    description:
      "रेतीले रास्तों, ग्रामीण जीवनशैली और मरुस्थल से जुड़े प्राकृतिक परिवेश की झलक जानिए।",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/20191213%20Dirt%20road%2C%20Thar%20Desert%2C%20Bikaner%2C%201402%208450.jpg?width=1000",
    alt: "बीकानेर क्षेत्र के थार रेगिस्तान में कच्चा रास्ता",
    credit: "Jakub Hałun / Wikimedia Commons",
    creditUrl:
      "https://commons.wikimedia.org/wiki/File:20191213_Dirt_road,_Thar_Desert,_Bikaner,_1402_8450.jpg",
  },
  {
    title: "राजस्थान की ग्रामीण संस्कृति और परंपराएँ",
    description:
      "राजस्थान के गाँवों, स्थानीय जीवन और पीढ़ियों से चली आ रही परंपराओं से परिचित हों।",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/20191213%20Ulica%20wioski%20Himtasar%20w%20Indiach%201137%208393.jpg?width=1000",
    alt: "हिमतासर गाँव की गली",
    credit: "Wikimedia Commons",
    creditUrl:
      "https://commons.wikimedia.org/wiki/Category:Quality_images_of_Bikaner",
  },
  {
    title: "बीकानेर क्षेत्र की ऐतिहासिक पहचान",
    description:
      "मरुस्थलीय क्षेत्र के परिवेश और स्थानीय विरासत को समझने की एक शुरुआत।",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/20191213%20Dirt%20road%2C%20Thar%20Desert%2C%20Bikaner%2C%201325%208425.jpg?width=1000",
    alt: "बीकानेर के पास थार क्षेत्र का ग्रामीण रास्ता",
    credit: "Wikimedia Commons",
    creditUrl:
      "https://commons.wikimedia.org/wiki/Category:Quality_images_of_Bikaner",
  },
];

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-stone-900">
      <div className="bg-[#6b3915] px-4 py-2 text-center text-sm text-white">
        507 HEAD — अपनी मिट्टी, अपनी पहचान, अपनी कहानियाँ
      </div>

      <header className="border-b border-[#e5ddd3] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="block">
            <span className="block text-3xl font-extrabold tracking-tight text-[#8a4b1f]">
              507 HEAD
            </span>
            <span className="mt-1 block text-xs text-stone-600 sm:text-sm">
              गाँव की बात, गाँव की पहचान
            </span>
          </Link>

          <nav
            aria-label="मुख्य नेविगेशन"
            className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-stone-700"
          >
            <Link href="/" className="hover:text-[#8a4b1f]">
              होम
            </Link>
            <Link href="/#latest" className="hover:text-[#8a4b1f]">
              ताज़ा लेख
            </Link>
            <Link href="/#categories" className="text-[#8a4b1f]">
              श्रेणियाँ
            </Link>
            <Link href="/#about" className="hover:text-[#8a4b1f]">
              हमारे बारे में
            </Link>
            <Link href="/contact" className="hover:text-[#8a4b1f]">
              संपर्क
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#e5ddd3] bg-[#f7efe3]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <Link
            href="/#categories"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#8a4b1f] hover:underline"
          >
            <span aria-hidden="true">←</span>
            सभी श्रेणियाँ
          </Link>

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div>
              <span className="inline-flex rounded-full border border-[#e5ddd3] bg-white px-4 py-2 text-sm font-bold text-[#6b3915]">
                507 HEAD · इतिहास और विरासत
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                राजस्थान का
                <span className="block text-[#8a4b1f]">इतिहास और पहचान।</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
                राजस्थान की ऐतिहासिक धरोहर, ग्रामीण संस्कृति, पुराने रास्तों और
                स्थानीय परंपराओं से जुड़ी कहानियाँ यहाँ पढ़ें।
              </p>

              <Link
                href="#history-articles"
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-lg bg-[#8a4b1f] px-6 py-3 font-bold text-white transition hover:bg-[#6b3915]"
              >
                कहानियाँ पढ़ें
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#e5ddd3] bg-white p-2 shadow-sm">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#eadbc9]">
                <Image
                  src={stories[0].image}
                  alt={stories[0].alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
              <p className="px-3 pb-2 pt-3 text-xs leading-5 text-stone-500">
                फोटो: {stories[0].credit} ·{" "}
                <a
                  href={stories[0].creditUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-[#8a4b1f]"
                >
                  स्रोत देखें
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="history-articles"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-amber-800">
            इतिहास और संस्कृति
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
            राजस्थान की कहानियाँ
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-stone-600">
            मरुस्थल, ग्रामीण जीवन और स्थानीय विरासत से जुड़े विषयों को तस्वीरों
            के साथ जानिए।
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <article
              key={story.title}
              className="group overflow-hidden rounded-xl border border-[#e5ddd3] bg-white transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#f7efe3]">
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="p-5">
                <span className="inline-flex rounded-full bg-[#f7efe3] px-3 py-1 text-xs font-bold text-[#6b3915]">
                  इतिहास और विरासत
                </span>

                <h3 className="mt-4 text-xl font-bold leading-snug">
                  {story.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-stone-600">
                  {story.description}
                </p>

                <p className="mt-3 text-xs leading-5 text-stone-500">
                  फोटो: {story.credit} ·{" "}
                  <a
                    href={story.creditUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-[#8a4b1f]"
                  >
                    स्रोत देखें
                  </a>
                </p>

                <Link
                  href={`/blog/history?story=${index + 1}`}
                  className="mt-5 inline-flex items-center font-bold text-[#8a4b1f] hover:text-[#6b3915]"
                >
                  आगे पढ़ें
                  <span className="ml-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 rounded-xl border border-[#e5ddd3] bg-[#f7efe3] p-5 text-sm leading-7 text-stone-600">
          ये शुरुआती नमूना कार्ड हैं, पूरे ऐतिहासिक लेख नहीं। प्रकाशित करने से
          पहले ऐतिहासिक तथ्यों, फोटो के स्रोत और लाइसेंस की जाँच आवश्यक है।
        </p>
      </section>

      <section className="border-y border-[#e5ddd3] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h2 className="text-xl font-bold">दूसरे विषय भी देखिए</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              खेती-बाड़ी, किसान, पशुपालन और ग्रामीण जीवन से जुड़ी सामग्री भी
              हमारी वेबसाइट पर खोजें।
            </p>
          </div>

          <Link
            href="/#categories"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-[#e5ddd3] px-5 py-3 font-bold text-[#8a4b1f] transition hover:bg-[#f7efe3]"
          >
            सभी श्रेणियाँ देखें →
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#e5ddd3] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <Link href="/" className="text-xl font-extrabold text-[#8a4b1f]">
              507 HEAD
            </Link>
            <p className="mt-1 text-sm text-stone-600">
              गाँव की बात, गाँव की पहचान।
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-stone-600">
            <Link href="/about" className="hover:text-[#8a4b1f]">
              हमारे बारे में
            </Link>
            <Link href="/contact" className="hover:text-[#8a4b1f]">
              संपर्क
            </Link>
            <Link href="/privacy" className="hover:text-[#8a4b1f]">
              गोपनीयता नीति
            </Link>
            <Link href="/terms" className="hover:text-[#8a4b1f]">
              नियम और शर्तें
            </Link>
          </div>
        </div>

        <div className="border-t border-[#e5ddd3] px-4 py-5 text-center text-xs text-stone-500">
          © 2026 507 HEAD. सर्वाधिकार सुरक्षित।
        </div>
      </footer>
    </main>
  );
}
