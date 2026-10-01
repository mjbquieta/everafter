export function EditorialStatement() {
  return (
    <section className="relative border-y border-stone-200/60 bg-white/30">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        {/* Asymmetric whitespace - right-aligned manifesto */}
        <div className="ml-auto max-w-xl text-right">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-stone-400 mb-4">
            OUR PHILOSOPHY
          </p>
          <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl leading-[1.3] tracking-tight text-stone-900">
            "Wedding stationery should feel like holding a <span className="italic">keepsake</span>, not scrolling a form."
          </blockquote>
          <p className="mt-6 font-serif text-base text-stone-600 leading-relaxed">
            Every detail—from tactile opening animations to ambient ceremony music—is designed to evoke the warmth of a handwritten letter and the intimacy of a treasured moment.
          </p>
        </div>
      </div>
    </section>
  );
}
