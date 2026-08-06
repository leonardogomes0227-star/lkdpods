import React from 'react';
import { useStore } from './store';

export const Hero: React.FC = () => {
  const { products } = useStore();

  // Acha o produto em destaque ou pega o primeiro da lista se nenhum estiver marcado
  const featuredProduct = products.find((p) => p.featured) || products[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-8 text-white shadow-2xl md:p-12">
      <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Destaque da Semana
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Sua tabacaria com estilo e confiança.
          </h1>
          <p className="text-neutral-400 text-base md:text-lg mb-8 leading-relaxed">
            Os melhores descartáveis, vapes recarregáveis, essências e acessórios das marcas mais desejadas. Qualidade garantida e atendimento rápido.
          </p>
        </div>

        {/* Card Dinâmico do Produto em Destaque */}
        {featuredProduct && (
          <div className="w-full md:w-80 bg-neutral-800/80 backdrop-blur border border-neutral-700/50 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {featuredProduct.brand}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {featuredProduct.name} {featuredProduct.flavor ? `— ${featuredProduct.flavor}` : ''}
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                em alta
              </span>
            </div>

            <div className="py-6 flex items-center justify-center bg-neutral-900/50 rounded-xl mb-6">
              <span className="text-6xl">{featuredProduct.emoji || '⚡'}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-700/50 text-center">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase">Preço</p>
                <p className="text-sm font-bold text-emerald-400">R$ {Number(featuredProduct.price).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase">Estoque</p>
                <p className="text-sm font-bold text-white">{featuredProduct.stock} un.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
