export function ProductCard({ product }: { product: any }) {
  // Puxa estritamente a imagem original do seu banco/sistema, caindo para uma padrão apenas se estiver vazia
  const productImage = product?.image || product?.thumbnail || product?.foto || product?.img || "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80";

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-[#0d1117] border border-[#21262d] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#39ff14]/50 hover:shadow-[0_10px_30px_rgba(57,255,20,0.12)] overflow-hidden">
      
      {/* Topo do Card: Categoria e Badge de Escassez */}
      <div className="flex items-center justify-between mb-4 z-10">
        <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-[#161b22] text-gray-300 border border-white/5">
          {product?.category || "Pods Descartáveis"}
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-orange-400 font-semibold bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
          🔥 Últimas unidades!
        </span>
      </div>

      {/* Área da Imagem Original do Produto */}
      <div className="relative w-full h-48 flex items-center justify-center rounded-xl bg-[#05070a] mb-4 overflow-hidden border border-white/5 group-hover:border-[#39ff14]/20 transition-colors z-10">
        <img 
          src={productImage} 
          alt={product?.name || "Produto"} 
          className="h-32 w-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-lg" 
        />
      </div>

      {/* Informações do Produto */}
      <div className="space-y-1 mb-5 z-10">
        <h3 className="text-[11px] uppercase tracking-widest text-[#39ff14] font-extrabold">
          {product?.brand || "LKD Imports"}
        </h3>
        <h4 className="text-base font-bold text-white leading-snug tracking-tight">
          {product?.name || "Produto em Destaque"}
        </h4>
        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {product?.description || "Estoque rotativo, produtos originais e entrega rápida na cidade."}
        </p>
      </div>

      {/* Preço e Botão de Ação */}
      <div className="flex items-center justify-between pt-4 border-t border-[#21262d] z-10">
        <div>
          <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-medium">Por apenas</span>
          <span className="text-lg font-black text-white tracking-tight">
            R$ {product?.price || "49,90"}
          </span>
        </div>
        
        <button className="bg-[#39ff14] hover:bg-[#2ecc0f] text-[#05070a] font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all transform active:scale-95 shadow-md shadow-[#39ff14]/20">
          Adicionar
        </button>
      </div>

    </div>
  );
}
