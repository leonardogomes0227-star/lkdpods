import React, { useMemo } from 'react';
import { useStore } from '../store';
import { RefreshCw, CheckCircle, AlertOctagon } from 'lucide-react';

export function AdminRestock() {
  const { products } = useStore();

  // Produtos que precisam de reposição (estoque menor ou igual a 3)
  const restockList = useMemo(() => {
    return products.filter((p) => p.stock <= 3);
  }, [products]);

  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">Reposição Inteligente</h2>
        <p className="text-xs text-neutral-400 mt-1">Sugestões automáticas de produtos e sabores que estão acabando para você repor no fornecedor.</p>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Itens recomendados para reposição imediata</h3>
        </div>

        {restockList.length === 0 ? (
          <div className="text-center py-8 text-neutral-400 text-sm flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
            <span>Tudo em ordem! Nenhum produto com estoque crítico no momento.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {restockList.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {p.brand}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{p.name}</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">Sabores: {p.flavor}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 ${p.stock === 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    <AlertOctagon className="w-3.5 h-3.5" />
                    {p.stock === 0 ? 'Esgotado' : `${p.stock} un. restantes`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
