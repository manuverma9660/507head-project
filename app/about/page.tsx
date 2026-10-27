import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "हमारे बारे में | 507 Head",
  description:
    "507 हेड (छतरगढ़, बीकानेर, राजस्थान) का परिचय, इतिहास, नहरी क्रांति, ग्रामीण पत्रकारिता और हमारी संपादकीय प्रतिबद्धता।",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fcf9f5] text-[#222222]">
      {/* Top Header */}
{/* Hero Section */}
      <section className="bg-[#F7F4DE] border-b border-[#e5ddd3] py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-block rounded-full bg-[#8a4b1f]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8a4b1f] mb-4">
            छतरगढ़ • बीकानेर • राजस्थान
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-[#222] tracking-tight leading-tight">
            अपनी मिट्टी, अपनी पहचान, अपनी कहानियाँ
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-[#666] leading-relaxed">
            507 Head पश्चिमी राजस्थान के ग्रामीण जीवन, थार मरुस्थल की विरासत,
            किसानों के परिश्रम और लोक परंपराओं को समर्पित एक स्वतंत्र डिजिटल मंच
            है।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 space-y-12">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#e5ddd3] bg-[#eee] shadow-sm">
          <Image
            src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1400&q=85"
            alt="507 हेड और थार मरुस्थल"
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        <div className="prose max-w-none text-lg leading-relaxed text-[#333] space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222]">
            507 हेड क्या है और इसका क्या महत्व है?
          </h2>
          <p>
            507 हेड (507 Head) राजस्थान के बीकानेर जिले की छतरगढ़ तहसील के
            अंतर्गत इंदिरा गांधी नहर परियोजना (IGNP) की मुख्य शाखा पर स्थित एक
            ऐतिहासिक जल वितरण बिंदु और ग्रामीण इलाका है।
          </p>
          <p>
            नहर आने से पहले यह संपूर्ण क्षेत्र &lsquo;महामरुस्थल&rsquo; का
            हिस्सा था, जहाँ केवल रेत के विशाल धोरे, खेजड़ी के पेड़ और पीने के
            पानी के लिए मीलों की यात्राएं थीं। नहरी पानी पहुँचने के बाद 507 हेड
            न केवल खेतों के लिए जीवनदायिनी बना, बल्कि यहाँ बसे सैकड़ों गाँवों के
            सामाजिक, सांस्कृतिक और आर्थिक उत्थान का केंद्र बन गया।
          </p>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222] pt-6">
            हमारा उद्देश्य (Our Mission)
          </h2>
          <p>
            मुख्यधारा की मीडिया में अक्सर सुदूर ग्रामीण अंचलों, स्थानीय किसानों
            की वास्तविक समस्याओं, नहरी जल प्रबंधन और पारंपरिक ज्ञान की उपेक्षा
            हो जाती है। हमारा संकल्प है:
          </p>

          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>सच्ची व निष्पक्ष ग्रामीण पत्रकारिता:</strong> 507 हेड और
              आसपास के किसानों, पशुपालकों और युवाओं की आवाज को प्रामाणिकता के
              साथ उठाना।
            </li>
            <li>
              <strong>मरुस्थलीय विरासत का संरक्षण:</strong> थार की लोक कला,
              बुजुर्गों के अनमोल अनुभव, पारंपरिक खान-पान और देशी बीजों के ज्ञान
              को डिजिटल रूप में सहेजना।
            </li>
            <li>
              <strong>किसान समृद्धि और आधुनिक तकनीक:</strong> कम पानी में बेहतर
              पैदावार, ड्रिप सिंचाई और उन्नत पशुपालन के वैज्ञानिक तौर-तरीकों को
              स्थानीय भाषा में पहुँचाना।
            </li>
          </ul>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222] pt-6">
            7 मुख्य विषय (Editorial Pillars)
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 not-prose mt-4">
            {[
              {
                title: "इतिहास और विरासत",
                desc: "क्षेत्र का इतिहास, नहरी निर्माण और संघर्ष गाथाएं।",
              },
              {
                title: "खेती-बाड़ी",
                desc: "फसल प्रबंधन, नहरी बारी, मिट्टी परीक्षण और जैविक खेती।",
              },
              {
                title: "किसान",
                desc: "अन्नदाताओं के जीवन के सच्चे किस्से और उनकी आवश्यकताएं।",
              },
              {
                title: "बुजुर्गों की सीख",
                desc: "चौपाल की बातें, लोक सूक्तियां और जीवन दर्शन।",
              },
              {
                title: "सांस्कृतिक विरासत",
                desc: "लोकगीत, मांड, पारंपरिक रीति-रिवाज और मेले।",
              },
              {
                title: "पशुपालन",
                desc: "राठी गाय, ऊँट संरक्षण, चारा प्रबंधन और डेयरी।",
              },
              {
                title: "खान-पान",
                desc: "बाजरे का सोगरा, कैर-सांगरी और पौष्टिक देशी स्वाद।",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-xl border border-[#e5ddd3] bg-[#F7F6EE] p-5"
              >
                <strong className="block text-[#8a4b1f] text-base">
                  {pillar.title}
                </strong>
                <p className="text-xs text-[#666] mt-1">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#F7F4DE] border border-[#e5ddd3] p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-[#222]">
            क्या आपके पास कोई कहानी या जानकारी है?
          </h3>
          <p className="text-[#666] max-w-xl mx-auto text-sm">
            यदि आप 507 हेड या बीकानेर क्षेत्र से जुड़ी कोई ऐतिहासिक जानकारी,
            सफलता की कहानी या समस्या साझा करना चाहते हैं, तो हमसे अवश्य संपर्क
            करें।
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-xl bg-[#8a4b1f] px-6 py-3 font-bold text-white hover:bg-[#6b3915]"
          >
            हमसे संपर्क करें →
          </Link>
        </div>
      </section>
</main>
  );
}
