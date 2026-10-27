"use client";

import { useState } from "react";
import { submitContact } from "./actions";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await submitContact(new FormData(e.currentTarget));
      if (result.success) {
        setSubmitted(true);
      } else {
        window.alert(result.message);
      }
    } catch {
      window.alert("संदेश भेजा नहीं जा सका। कृपया थोड़ी देर बाद कोशिश करें।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fcf9f5] text-[#222222]">
      {/* Top Header */}
{/* Hero Banner */}
      <section className="bg-[#F7F4DE] border-b border-[#e5ddd3] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-block rounded-full bg-[#8a4b1f]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8a4b1f] mb-3">
            संपादकीय संपर्क
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#222] tracking-tight">
            हमसे संपर्क करें
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[#666]">
            समाचार सुझाव, प्रतिक्रिया या सहयोग के लिए 507 Head की टीम से जुड़ें।
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-[#e5ddd3] bg-[#F7F6EE] p-8 shadow-sm">
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <span className="text-5xl block">✅</span>
                <h3 className="text-2xl font-bold text-green-800">
                  संदेश प्राप्त हुआ!
                </h3>
                <p className="text-sm text-[#666]">
                  धन्यवाद। आपका संदेश 507 Head संपादकीय टीम तक पहुँच गया है। हम
                  जल्द ही आपसे संपर्क करेंगे।
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 rounded-lg bg-[#8a4b1f] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#6b3915]"
                >
                  नया संदेश भेजें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <h3 className="text-xl font-bold text-[#222]">
                  हमें संदेश भेजें
                </h3>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold uppercase tracking-wider text-[#666] mb-2"
                  >
                    आपका पूरा नाम *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    type="text"
                    placeholder="उदा. रमेश कुमार"
                    className="w-full rounded-xl border border-[#e5ddd3] px-4 py-3 text-sm outline-none focus:border-[#8a4b1f]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold uppercase tracking-wider text-[#666] mb-2"
                  >
                    ईमेल पता *
                  </label>
                  <input
                    id="email"
                    name="email"
                    required
                    type="email"
                    placeholder="yourname@example.com"
                    className="w-full rounded-xl border border-[#e5ddd3] px-4 py-3 text-sm outline-none focus:border-[#8a4b1f]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-xs font-bold uppercase tracking-wider text-[#666] mb-2"
                  >
                    संदेश का विषय
                  </label>
                  <select
                    id="category"
                    name="topic"
                    className="w-full rounded-xl border border-[#e5ddd3] px-4 py-3 text-sm outline-none focus:border-[#8a4b1f]"
                  >
                    <option>समाचार सुझाव / प्रेस विज्ञप्ति</option>
                    <option>कृषि या पशुपालन से जुड़ा सवाल</option>
                    <option>स्थानीय समस्या या रिपोर्ट</option>
                    <option>सामान्य पूछताछ / फीडबैक</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-bold uppercase tracking-wider text-[#666] mb-2"
                  >
                    आपका संदेश / विवरण *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="कृपया अपना संदेश यहाँ लिखें..."
                    className="w-full rounded-xl border border-[#e5ddd3] px-4 py-3 text-sm outline-none focus:border-[#8a4b1f]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#8a4b1f] py-3.5 text-sm font-bold text-white transition hover:bg-[#6b3915] disabled:opacity-50"
                >
                  {loading ? "संदेश भेजा जा रहा है..." : "संदेश भेजें →"}
                </button>
              </form>
            )}
          </div>
      </section>
</main>
  );
}
