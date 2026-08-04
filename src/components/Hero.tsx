import { Flame, Truck, ShieldCheck, Zap } from 'lucide-react';
import { Reveal } from './Reveal';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-700/40">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-neon-500/[0.08] blur-3xl" />
      <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-electric-500/[0.08] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="max-w-2xl">
          <Reveal delay={0}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon-500/30 bg-neon-500/10 px-3.5 py-1.5 text-xs font-semibold text-neon-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-neon-400 opacity-75 animate-live-pulse" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-400" />
              </span>
              Promoção Relâmpago ativa agora
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Sua tabacaria <span className="text-neon-400">underground</span>,<br />
              entrega rápida na cidade.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-lg text-base font-light leading-relaxed text-white/50 sm:text-lg">
              Pods descartáveis, vapes recarregáveis, essências e acessórios das marcas mais
              desejadas. Estoque rotativo, preços que valem a pena.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#vitrine"
                className="shimmer-sweep rounded-xl bg-neon-500 px-6 py-3 text-sm font-bold text-black transition-all duration-300 hover:scale-[1.03] hover:bg-neon-400 active:scale-95"
              >
                Ver produtos
              </a>
              <a
                href="#vitrine"
                className="rounded-xl border border-ink-600 bg-ink-850/80 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:border-neon-500/40 active:scale-95"
              >
                Ofertas do dia
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap gap-5 text-xs font-light text-white/40">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-neon-400" /> Entrega exclusiva na cidade
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-electric-400" /> Pedido via WhatsApp
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-neon-400" /> Produtos originais
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
