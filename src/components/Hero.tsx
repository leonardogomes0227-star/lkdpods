import React from 'react';
import { useStore } from '../store';

export const Hero: React.FC = () => {
  const { products } = useStore();

  const featuredProduct = products.find((p) => p.featured) || products[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-6 sm:p-8 md:p-12 text-white shadow-2xl border border-neutral-800 my-4 mx-4 sm:mx-6">
      {/* Luz de fundo dinâmica baseada no gradiente do produto */}
      <div className={`absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-[350px] h-[350px] bg-gradient-to-br ${featuredProduct?.gradient || 'from-emerald-500/20 to-cyan-500/20'} rounded-full blur-3xl pointer-events-none transition-all duration-700`} />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            🔥 DESTAQUE DA SEMANA
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
            Sua tabacaria com estilo e confiança.
          </h1>
          <p className="text-neutral-300 text-sm md:text-lg mb-6 leading-relaxed font-normal">
            Os melhores descartáveis, vapes recarregáveis, essências e acessórios das marcas mais desejadas. Qualidade garantida e atendimento rápido.
          </p>
        </div>

        {/* Card Dinâmico Reformulado e Estilizado */}
        {featuredProduct && (
          <div className="w-full md:w-80 bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all hover:border-emerald-500/50 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  {featuredProduct.brand}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mt-2 group-hover:text-emerald-300 transition-colors">
                  {featuredProduct.name}
                </h3>
                {featuredProduct.flavor && (
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                    {featuredProduct.flavor}
                  </p>
                )}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/20 animate-pulse">
                Em Alta
              </span>
            </div>

            {/* Caixa do Emoji com Fundo Escuro Perfeito */}
            <div className={`py-6 sm:py-8 my-4 flex items-center justify-center bg-neutral-900 rounded-2xl shadow-inner border border-neutral-800 group-hover:scale-105 transition-transform duration-300`}>
              <span className="text-6xl sm:text-7xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                {featuredProduct.emoji || '⚡'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-800 text-center">
              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800/50">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Preço</p>
                <p className="text-sm sm:text-base font-black text-emerald-400 mt-0.5">R$ {Number(featuredProduct.price).toFixed(2)}</p>
              </div>
              <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800/50">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Estoque</p>
                <p className="text-sm sm:text-base font-extrabold text-white mt-0.5">{featuredProduct.stock} un.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
