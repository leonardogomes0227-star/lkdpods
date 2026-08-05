import { Truck, ShieldCheck, Zap } from 'lucide-react';
import { Reveal } from './Reveal';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-bg">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="max-w-2xl">
          <Reveal delay={0}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accentSoft px-3.5 py-1.5 text-xs font-semibold text-accent">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Estoque rotativo — reposição semanal
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Sua tabacaria de <span className="text-accent">confiança</span>,<br />
              entrega rápida na cidade.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-inkSoft sm:text-lg">
              Pods descartáveis, vapes recarregáveis, essências e acessórios das marcas mais
              desejadas. Produtos originais, preços justos, pedido direto pelo WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap gap-3">
              
                href="#vitrine"
                className="rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-accent active:scale-95"
              >
                Ver produtos
              </a>
              
                href="#vitrine"
                className="rounded-xl border border-line bg-white px-6 py-3 text-sm font-semibold text-ink transition-all duration-300 hover:border-accent/40 active:scale-95"
              >
                Ofertas do dia
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap gap-6 border-t border-line pt-7 text-xs text-inkSoft">
              <span className="flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-accent" /> Entrega exclusiva na cidade
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-accent" /> Pedido via WhatsApp
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" /> Produtos originais
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <div className="relative rounded-2xl border border-line bg-gradient-to-br from-bgAlt to-white p-10 aspect-square flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[11px] tracking-wide text-accent">IGNITE</div>
                <div className="font-display font-bold text-[15px] text-ink">V15 — Mango Ice</div>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-inkSoft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                últimas unidades
              </div>
            </div>

            <div className="flex justify-center py-5">
              <svg width="64" height="140" viewBox="0 0 64 140" fill="none">
                <rect x="8" y="4" width="48" height="126" rx="20" stroke="#15181B" strokeWidth="2.5" />
                <rect x="20" y="0" width="24" height="14" rx="5" fill="#15181B" />
                <rect x="16" y="70" width="32" height="34" rx="6" stroke="#4C7A3F" strokeWidth="2" />
                <circle cx="32" cy="87" r="6" stroke="#4C7A3F" strokeWidth="2" />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-3.5 border-t border-line pt-5">
              {[
                ['PUFFS', '1500'],
                ['NICOTINA', '5%'],
                ['BATERIA', '550mAh'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] tracking-wide text-inkSoft mb-1">{k}</div>
                  <div className="font-mono font-semibold text-[13.5px] text-ink">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
