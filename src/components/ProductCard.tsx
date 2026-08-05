export function ProductCard({ product }: { product: any }) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white border border-line p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_14px_32px_rgba(20,20,15,0.07)] overflow-hidden w-full">

      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-bgAlt text-inkSoft border border-line truncate max-w-[110px]">
          {product?.category || "Pods Descartáveis"}
        </span>
        <span className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px] text-[#9A5B23] font-semibold bg-[#FBF3E8] px-2 py-0.5 rounded-full border border-[#EAD3B4] shrink-0">
          Últimas
        </span>
      </div>

      <div className="relative w-full h-36 sm:h-44 flex items-center justify-center rounded-xl bg-bgAlt mb-3 sm:mb-4 overflow-hidden border border-line group-hover:border-accent/30 transition-colors">
        {product?.image_url ? (
          <img
            src={product.image_url}
            alt={product?.name || 'Produto'}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg width="48" height="104" viewBox="0 0 64 140" fill="none">
            <rect x="8" y="4" width="48" height="126" rx="20" stroke="#C9C7C0" strokeWidth="2.5" />
            <rect x="20" y="0" width="24" height="14" rx="5" fill="#C9C7C0" />
          </svg>
        )}
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-accent font-bold truncate">
            {product?.brand || "LKD Imports"}
          </h3>
          {product?.flavor && product.flavor !== '—' && (
            <span className="text-[9px] sm:text-[10px] text-inkSoft bg-bgAlt px-1.5 py-0.5 rounded-md border border-line truncate max-w-[90px]">
              {product.flavor}
            </span>
          )}
        </div>

        <h4 className="font-display text-sm sm:text-base font-bold text-ink leading-snug tracking-tight line-clamp-1">
          {product?.name || "Produto em Destaque"}
        </h4>

        <p className="text-[11px] sm:text-xs text-inkSoft line-clamp-2 leading-relaxed">
          {product?.description || "Estoque rotativo, produtos originais e entrega rápida na cidade."}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-line gap-2">
        <div>
          <span className="text-[9px] sm:text-[10px] text-inkSoft block uppercase tracking-wider font-medium">Por apenas</span>
          <span className="font-display text-base sm:text-lg font-extrabold text-ink tracking-tight">
            R$ {Number(product?.price || 49.90).toFixed(2).replace('.', ',')}
          </span>
        </div>

        <button className="bg-ink hover:bg-accent text-white font-semibold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs transition-all transform active:scale-95 shrink-0">
          Adicionar
        </button>
      </div>
    </div>
  );
}
