import { Metadata } from "next";

export const metadata: Metadata = {
  title: "गोपनीयता नीति (Privacy Policy) | 507 Head",
  description:
    "507head.com की गोपनीयता नीति, डेटा सुरक्षा एवं कुकीज संबंधी जानकारी।",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fcf9f5] text-[#222222]">
<section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#222]">
          गोपनीयता नीति (Privacy Policy)
        </h1>
        <p className="text-sm text-[#777]">अंतिम अद्यतन: 2026</p>

        <div className="prose max-w-none text-base leading-relaxed text-[#444] space-y-6">
          <p>
            507 Head (507head.com) पर आने वाले पाठकों की गोपनीयता का सम्मान करना
            हमारी सर्वोच्च प्राथमिकता है। यह नीति बताती है कि जब आप हमारी
            वेबसाइट का उपयोग करते हैं तो कौन सी जानकारी एकत्र की जाती है।
          </p>

          <h2 className="text-xl font-bold text-[#222]">1. सूचना का संग्रह</h2>
          <p>
            हम सामान्य पाठकों से कोई व्यक्तिगत पहचान योग्य जानकारी (जैसे नाम या
            फोन नंबर) तब तक नहीं मांगते जब तक कि आप स्वयं संपर्क फॉर्म के माध्यम
            से हमें कोई संदेश न भेजें।
          </p>

          <h2 className="text-xl font-bold text-[#222]">
            2. एनालिटिक्स और कुकीज़
          </h2>
          <p>
            वेबसाइट की गति और प्रदर्शन में सुधार के लिए हम मानक वेब एनालिटिक्स
            (जैसे पृष्ठ दृश्य और डिवाइस प्रकार) का उपयोग करते हैं। इसमें कोई
            व्यक्तिगत संवेदनशील डेटा एकत्र या साझा नहीं किया जाता।
          </p>

          <h2 className="text-xl font-bold text-[#222]">
            3. बाहरी कड़ियाँ (External Links)
          </h2>
          <p>
            हमारी वेबसाइट पर संदर्भ या स्रोत के रूप में अन्य वेबसाइटों के लिंक
            हो सकते हैं। उन बाहरी वेबसाइटों की गोपनीयता नीतियों के लिए हम
            जिम्मेदार नहीं हैं।
          </p>

          <h2 className="text-xl font-bold text-[#222]">4. संपर्क</h2>
          <p>
            यदि आपके पास हमारी गोपनीयता नीति के संबंध में कोई प्रश्न है, तो आप
            हमें <strong>contact@507head.com</strong> पर लिख सकते हैं।
          </p>
        </div>
      </section>
</main>
  );
}
