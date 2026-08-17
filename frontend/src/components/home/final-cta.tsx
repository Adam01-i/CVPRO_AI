import Link from 'next/link';

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#0B1220] py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2B4EFF]/20 blur-[150px]" />
      </div>
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-8">
        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
          Le prochain recruteur ne vous connaît pas encore.
          <br />
          <span className="text-[#7C9CFF]">Votre CV peut lui donner envie de vous découvrir.</span>
        </h2>
        <Link
          href="/create"
          className="mt-10 inline-flex rounded-full bg-white px-8 py-4 text-sm font-semibold text-[#0B1220] shadow-[0_16px_40px_-10px_rgba(255,255,255,0.35)] transition hover:-translate-y-0.5 hover:bg-slate-100"
        >
          Créer mon CV gratuitement
        </Link>
      </div>
    </section>
  );
}