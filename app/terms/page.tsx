import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "नियम एवं शर्तें (Terms & Conditions) | 507 Head",
  description: "507head.com की उपयोग की शर्तें और संपादकीय नियम।",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fcf9f5] text-[#222222]">
      <header className="border-b border-[#e5ddd3] bg-white sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8a4b1f] text-base font-black text-white">
              507
            </span>
            <span className="leading-tight">
              <strong className="block text-xl font-black text-[#222]">
                507 हेड
              </strong>
              <small className="text-xs text-[#666]">
                जल, प्रकृति और जनजीवन
              </small>
            </span>
          </Link>

          <nav className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/" className="hover:text-[#8a4b1f]">
              होम
            </Link>
            <Link href="/about" className="hover:text-[#8a4b1f]">
              हमारे बारे में
            </Link>
            <Link href="/contact" className="hover:text-[#8a4b1f]">
              संपर्क
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#222]">
          नियम एवं शर्तें (Terms & Conditions)
        </h1>
        <p className="text-sm text-[#777]">अंतिम अद्यतन: 2026</p>

        <div className="prose max-w-none text-base leading-relaxed text-[#444] space-y-6">
          <p>
            507 Head (507head.com) का उपयोग करके आप निम्नलिखित नियमों और शर्तों
            से बंधे होने की सहमति देते हैं।
          </p>

          <h2 className="text-xl font-bold text-[#222]">
            1. सामग्री का स्वामित्व (Copyright)
          </h2>
          <p>
            इस वेबसाइट पर प्रकाशित सभी आलेख, रिपोर्ट, तस्वीरें और ऑडियो-विजुअल
            सामग्री 507 Head या उनके संबंधित लेखकों/फोटोग्राफरों की बौद्धिक
            संपदा हैं। उचित संदर्भ और श्रेय दिए बिना व्यावसायिक उपयोग प्रतिबंधित
            है।
          </p>

          <h2 className="text-xl font-bold text-[#222]">
            2. सूचना की प्रामाणिकता
          </h2>
          <p>
            हम कृषि, जल प्रबंधन और स्थानीय इतिहास से जुड़ी सामग्री को पूरी
            प्रामाणिकता और शोध के साथ प्रकाशित करने का प्रयास करते हैं। हालांकि,
            किसान भाइयों को सलाह दी जाती है कि कृषि संबंधी बड़े तकनीकी निर्णय
            लेने से पहले स्थानीय कृषि वैज्ञानिकों या विभाग से भी परामर्श लें।
          </p>

          <h2 className="text-xl font-bold text-[#222]">
            3. संपादकीय स्वतंत्रता
          </h2>
          <p>
            507 Head एक स्वतंत्र ग्रामीण पत्रकारिता मंच है। संपादकीय निर्णय
            निष्पक्षता और जनहित पर आधारित होते हैं।
          </p>
        </div>
      </section>

      <footer className="border-t border-[#e5ddd3] bg-white py-10 text-center text-sm text-[#666]">
        <div className="mx-auto max-w-7xl px-4">
          <p>© 2026 507 हेड। सर्वाधिकार सुरक्षित।</p>
        </div>
      </footer>
    </main>
  );
}
