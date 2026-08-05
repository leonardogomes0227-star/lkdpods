import { Truck, ShieldCheck, Zap } from 'lucide-react';
import { Reveal } from './Reveal';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-ink-800 bg-ink-950">
      
      {/* Elemento de fundo animado (Aura Neon pulsante) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 grid md:grid-cols-2 gap-16 items-center">
        
        {/* Lado Esquerdo - Textos */}
        <div className="max-w-2xl">
          <Reveal delay={0}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neon-500/20 bg-neon-500/10 px-4 py-1.5 text-xs font-semibold text-neon-400 backdrop-blur-sm shadow-[0_0_15px_rgba(74,222,128,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-500" />
              </span>
              Estoque rotativo — reposição semanal
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Sua tabacaria de <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-400 to-emerald-300">confiança</span>,<br />
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
                className="rounded-xl bg-neon-500 px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-neon-400 hover:shadow-[0_0_30px_rgba(74,222,128,0.5)] active:scale-95"
              >
                Ver produtos
              </a>
              <a
                href="#vitrine"
                className="rounded-xl border border-ink-700 bg-ink-900/50 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-neon-500/50 hover:bg-ink-800 active:scale-95"
              >
                Ofertas do dia
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-12 flex flex-wrap gap-6 border-t border-ink-800/60 pt-7 text-xs text-white/50">
              <span className="flex items-center gap-2 transition-colors hover:text-neon-400">
                <Truck className="h-4 w-4 text-neon-500" /> Entrega exclusiva na cidade
              </span>
              <span className="flex items-center gap-2 transition-colors hover:text-neon-400">
                <Zap className="h-4 w-4 text-neon-500" /> Pedido via WhatsApp
              </span>
              <span className="flex items-center gap-2 transition-colors hover:text-neon-400">
                <ShieldCheck className="h-4 w-4 text-neon-500" /> Produtos originais
              </span>
            </div>
          </Reveal>
        </div>

        {/* Lado Direito - Card do Produto Animado */}
        <Reveal delay={160}>
          <div className="group relative rounded-3xl border border-ink-800 bg-gradient-to-br from-ink-900 to-ink-950 p-10 aspect-square flex flex-col justify-between shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:border-neon-500/30 hover:shadow-[0_20px_50px_rgba(74,222,128,0.15)]">
            
            {/* Brilho interno sutil no hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-neon-500/0 via-neon-500/0 to-neon-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="font-mono text-[11px] tracking-widest text-neon-500 font-semibold">IGNITE</div>
                <div className="font-display font-bold text-lg text-white mt-1">V15 — Mango Ice</div>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-white/50 bg-ink-950/50 px-3 py-1.5 rounded-full border border-ink-800">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                últimas unidades
              </div>
            </div>

            <div className="relative z-10 flex justify-center py-5 transition-transform duration-700 group-hover:scale-110">
              <svg width="80" height="170" viewBox="0 0 64 140" fill="none" className="drop-shadow-2xl">
                <rect x="8" y="4" width="48" height="126" rx="20" stroke="#3F3F46" strokeWidth="2.5" fill="#18181B" />
                <rect x="20" y="0" width="24" height="14" rx="5" fill="#3F3F46" />
                <rect x="16" y="70" width="32" height="34" rx="6" stroke="#4ade80" strokeWidth="2" />
                <circle cx="32" cy="87" r="6" stroke="#4ade80" strokeWidth="2" fill="#4ade80" fillOpacity="0.2" />
              </svg>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3.5 border-t border-ink-800/80 pt-6">
              {[
                ['PUFFS', '1500'],
                ['NICOTINA', '5%'],
                ['BATERIA', '550mAh'],
              ].map(([k, v]) => (
                <div key={k} className="text-center bg-ink-950/50 rounded-xl py-2 border border-ink-800/50 transition-colors group-hover:border-ink-700">
                  <div className="text-[9px] tracking-widest text-white/40 mb-1">{k}</div>
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
