export function ProductCard({ product }: { product: any }) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-[#0d1117] border border-[#21262d] p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#39ff14]/50 hover:shadow-[0_10px_30px_rgba(57,255,20,0.12)] overflow-hidden w-full">
      
      {/* Detalhe de luz de fundo dinâmica */}
      <div className={`absolute inset-0 bg-gradient-to-br ${product?.gradient || 'from-amber-500/10 to-orange-600/5'} opacity-40 pointer-events-none transition-opacity group-hover:opacity-75`} />

      {/* Topo do Card: Categoria e Badge de Escassez */}
      <div className="flex items-center justify-between mb-3 z-10">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#161b22] text-gray-300 border border-white/5 truncate max-w-[110px]">
          {product?.category || "Pods Descartáveis"}
        </span>
        <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-orange-400 font-semibold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20 shrink-0">
          🔥 Últimas
        </span>
      </div>

      {/* Área do Emoji Centralizada para Celular */}
      <div className="relative w-full h-36 sm:h-44 flex items-center justify-center rounded-xl bg-[#05070a]/80 mb-3 sm:mb-4 overflow-hidden border border-white/5 group-hover:border-[#39ff14]/30 transition-colors z-10 shadow-inner">
        <span className="text-5xl sm:text-6xl filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform transition-transform duration-500 group-hover:scale-110">
          {product?.emoji || '💨'}
        </span>
      </div>

      {/* Informações do Produto Compactas para Mobile */}
      <div className="space-y-1 mb-4 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#39ff14] font-extrabold truncate">
            {product?.brand || "LKD Imports"}
          </h3>
          {product?.flavor && product.flavor !== '—' && (
            <span className="text-[9px] sm:text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5 truncate max-w-[90px]">
              {product.flavor}
            </span>
          )}
        </div>
        
        <h4 className="text-sm sm:text-base font-bold text-white leading-snug tracking-tight line-clamp-1">
          {product?.name || "Produto em Destaque"}
        </h4>
        
        <p className="text-[11px] sm:text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {product?.description || "Estoque rotativo, produtos originais e entrega rápida na cidade."}
        </p>
      </div>

      {/* Preço e Botão Otimizados para Toque no Celular */}
      <div className="flex items-center justify-between pt-3 border-t border-[#21262d] z-10 gap-2">
        <div>
          <span className="text-[9px] sm:text-[10px] text-gray-500 block uppercase tracking-wider font-medium">Por apenas</span>
          <span className="text-base sm:text-lg font-black text-white tracking-tight">
            R$ {Number(product?.price || 49.90).toFixed(2).replace('.', ',')}
          </span>
        </div>
        
        <button className="bg-[#39ff14] hover:bg-[#2ecc0f] text-[#05070a] font-extrabold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs transition-all transform active:scale-95 shadow-md shadow-[#39ff14]/20 shrink-0">
          Adicionar
        </button>
      </div>

    </div>
  );
}
