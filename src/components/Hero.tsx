import { Truck, ShieldCheck, Zap } from 'lucide-react';
import { Reveal } from './Reveal';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-800 bg-transparent">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 grid md:grid-cols-2 gap-16 items-center">
        
        {/* Lado Esquerdo - Textos */}
        <div className="max-w-2xl">
          <Reveal delay={0}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon-500/30 bg-neon-500/10 px-4 py-1.5 text-xs font-semibold text-neon-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-500" />
              </span>
              Estoque rotativo — reposição semanal
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Sua tabacaria de <span className="text-neon-400">confiança</span>,<br />
              entrega rápida na cidade.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
              Pods descartáveis, vapes recarregáveis, essências e acessórios das marcas mais
              desejadas. Produtos originais, preços justos, pedido direto pelo WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#vitrine"
                className="rounded-xl bg-neon-500 px-8 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-neon-400 active:scale-95"
              >
                Ver produtos
              </a>
              <a
                href="#vitrine"
                className="rounded-xl border border-ink-700 bg-ink-850 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:border-neon-500/50 hover:bg-ink-800 active:scale-95"
              >
                Ofertas do dia
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-12 flex flex-wrap gap-6 border-t border-ink-800 pt-7 text-xs text-white/60">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-neon-400" /> Entrega exclusiva na cidade
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-neon-400" /> Pedido via WhatsApp
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-neon-400" /> Produtos originais
              </span>
            </div>
          </Reveal>
        </div>

        {/* Lado Direito - Card do Produto */}
        <Reveal delay={160}>
          <div className="group relative rounded-3xl border border-ink-800 bg-ink-900 p-10 aspect-square flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 hover:border-neon-500/30">
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="font-mono text-[11px] tracking-widest text-neon-400 font-semibold uppercase">IGNITE</div>
                <div className="font-display font-bold text-lg text-white mt-1">V15 — Mango Ice</div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-white/60 bg-ink-950 px-3 py-1.5 rounded-full border border-ink-800">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                últimas unidades
              </div>
            </div>

            <div className="relative z-10 flex justify-center py-5 transition-transform duration-700 group-hover:scale-105">
              <svg width="80" height="170" viewBox="0 0 64 140" fill="none">
                <rect x="8" y="4" width="48" height="126" rx="20" stroke="#3F3F46" strokeWidth="2.5" fill="#18181B" />
                <rect x="20" y="0" width="24" height="14" rx="5" fill="#3F3F46" />
                <rect x="16" y="70" width="32" height="34" rx="6" stroke="#4ade80" strokeWidth="2" />
                <circle cx="32" cy="87" r="6" stroke="#4ade80" strokeWidth="2" fill="#4ade80" fillOpacity="0.2" />
              </svg>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3.5 border-t border-ink-800 pt-6">
              {[
                ['PUFFS', '1500'],
                ['NICOTINA', '5%'],
                ['BATERIA', '550mAh'],
              ].map(([k, v]) => (
                <div key={k} className="text-center bg-ink-950 rounded-xl py-2 border border-ink-800 transition-colors group-hover:border-ink-700">
                  <div className="text-[9px] tracking-widest text-white/50 mb-1 uppercase">{k}</div>
                  <div className="font-mono font-semibold text-[14px] text-white">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
