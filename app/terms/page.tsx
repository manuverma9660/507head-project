import { Metadata } from "next";

export const metadata: Metadata = {
  title: "नियम एवं शर्तें (Terms & Conditions) | 507 Head",
  description: "507head.com की उपयोग की शर्तें और संपादकीय नियम।",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fcf9f5] text-[#222222]">
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
</main>
  );
}
