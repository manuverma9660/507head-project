export default function CategoryLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-[#fcf9f5] text-[#222222]"
    >
      <section className="border-b border-[#e5ddd3] bg-[#f7efe3] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-sm font-semibold text-[#8a4b1f]">
            श्रेणी खुल रही है…
          </p>
          <div className="mt-4 h-12 w-56 animate-pulse rounded bg-[#e5ddd3]" />
          <div className="mt-4 h-5 max-w-2xl animate-pulse rounded bg-[#e5ddd3]" />
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-2xl border border-[#e5ddd3] bg-white"
          >
            <div className="aspect-[16/9] animate-pulse bg-[#e5ddd3]" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-20 animate-pulse rounded bg-[#f0e7dd]" />
              <div className="h-6 w-full animate-pulse rounded bg-[#e5ddd3]" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-[#f0e7dd]" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
