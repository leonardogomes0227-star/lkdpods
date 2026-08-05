import { ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { formatBRL } from '../utils';

interface Props {
  product: Product;
  onAdd: (p: Product) => void;
}

export function ProductCard({ product, onAdd }: Props) {
  return (
    <div 
      onClick={() => onAdd(product)} 
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-line bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Imagem Real ou Gradient com Emoji */}
      <div className={`relative mb-4 flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br ${product.gradient} overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]`}>
        
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <span className="text-6xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
            {product.emoji}
          </span>
        )}
        
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase text-red-600 shadow-sm">
            Últimas un.
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase text-gray-500 shadow-sm">
            Esgotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <span className="mb-1 text-xs font-bold uppercase tracking-wider text-inkSoft">{product.brand}</span>
        <h3 className="font-display text-lg font-bold leading-tight text-ink">{product.name}</h3>
        
        <p className="mt-1 line-clamp-1 text-xs font-medium text-inkSoft">
          {product.flavor.split(',').join(' • ')}
        </p>

        <div className="mt-4 flex items-end justify-between">
          <span className="text-xl font-bold text-accent">{formatBRL(product.price)}</span>
          <button 
            disabled={product.stock === 0}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-bgAlt text-ink transition-colors hover:bg-accent hover:text-white disabled:opacity-50 disabled:hover:bg-bgAlt disabled:hover:text-ink"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
