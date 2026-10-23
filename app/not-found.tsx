import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ed] px-6 text-center text-[#29231e]">
      <section className="max-w-lg rounded-2xl border border-[#e7ddd0] bg-white p-8 shadow-sm md:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8a4b1f]">
          507 Head
        </p>
        <p className="mt-5 text-6xl font-black text-[#8a4b1f]">404</p>
        <h1 className="mt-4 text-2xl font-bold">यह पेज नहीं मिला</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          संभव है कि लिंक बदल गया हो या पेज उपलब्ध नहीं है। होम पेज से फिर से शुरू करें।
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-[#8a4b1f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#6b3915] focus:outline-none focus:ring-2 focus:ring-[#245d92] focus:ring-offset-2"
        >
          होम पेज पर जाएँ
        </Link>
      </section>
    </main>
  );
}
