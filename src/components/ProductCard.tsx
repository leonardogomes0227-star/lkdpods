import { Flame, Eye, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../types';
import { formatBRL } from '../utils';

interface Props {
  product: Product;
  onAdd: (p: Product) => void;
}

const CATEGORY_GLOW: Record<string, string> = {
  'Pods Descartáveis': 'glow-neon',
  'Vapes Recarregáveis': 'glow-electric',
  'Essências': 'glow-pink',
  'Acessórios': 'glow-amber',
};

const CATEGORY_BORDER: Record<string, string> = {
  'Pods Descartáveis': 'hover:border-neon-500/40',
  'Vapes Recarregáveis': 'hover:border-electric-500/40',
  'Essências': 'hover:border-pink-500/40',
  'Acessórios': 'hover:border-amber-500/40',
};

export function ProductCard({ product, onAdd }: Props) {
  const [added, setAdded] = useState(false);

  // Bulletproof: guard against missing/empty product data
  if (!product || !product.id) return null;

  const stock: number = typeof product.stock === 'number' ? product.stock : 0;
  const price: number = typeof product.price === 'number' ? product.price : 0;
  const views: number = typeof product.views === 'number' ? product.views : 0;
  const name: string = product.name ?? 'Produto';
  const brand: string = product.brand ?? '';
  const flavor: string = product.flavor ?? '';
  const description: string = product.description ?? '';
  const emoji: string = product.emoji ?? '💨';
  const gradient: string = product.gradient ?? 'from-ink-800 to-ink-900';
  const category: string = product.category ?? '';

  const lowStock = stock <= 5 && stock > 0;
  const outOfStock = stock === 0;
  const glow = CATEGORY_GLOW[category] ?? 'glow-neon';
  const border = CATEGORY_BORDER[category] ?? 'hover:border-neon-500/40';

  const handleAdd = () => {
    if (outOfStock) return;
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article
      className={`card-3d group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700/60 bg-ink-925/90 ${border} ${glow}`}
    >
      {/* Visual area */}
      <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />

        {/* Centered emoji with zoom */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="product-visual text-6xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:text-7xl">
            {emoji}
          </span>
        </div>

        {/* Top gradient fade for badge legibility */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent" />

        {/* Category chip */}
        {category && (
          <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-md">
            {category}
          </span>
        )}

        {/* Scarcity badge — pulsing */}
        {lowStock && (
          <div className="absolute right-3 top-3 animate-badge-pulse rounded-full bg-danger px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_0_18px_-4px_rgba(255,45,45,0.6)]">
            🔥 Últimas {stock}!
          </div>
        )}
        {outOfStock && (
          <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white/50 backdrop-blur-md">
            Esgotado
          </div>
        )}

        {/* Viewers */}
        {views > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-[10px] font-medium text-white/70 backdrop-blur-md">
            <Eye className="h-3 w-3" />
            {views} olhando
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="space-y-0.5">
          {brand && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neon-400/70">
              {brand}
            </p>
          )}
          <h3 className="font-display text-base font-bold leading-tight text-white">
            {name}
          </h3>
          {flavor && (
            <p className="text-sm font-light text-white/45">{flavor}</p>
          )}
        </div>

        {description && (
          <p className="line-clamp-2 text-xs font-light leading-relaxed text-white/35">
            {description}
          </p>
        )}

        {/* Price + action */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <p className="font-display text-2xl font-extrabold leading-none tracking-tight text-white">
              {formatBRL(price)}
            </p>
            {lowStock && (
              <p className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-danger">
                <Flame className="h-3 w-3 animate-pulse" />
                Restam apenas {stock}
              </p>
            )}
          </div>

          <button
            disabled={outOfStock}
            onClick={handleAdd}
            aria-label={`Adicionar ${name} ao carrinho`}
            className={`shimmer-sweep btn-pop flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              added
                ? 'bg-emerald-500 text-black'
                : outOfStock
                  ? 'bg-ink-700 text-white/30'
                  : 'bg-neon-500 text-black hover:bg-neon-400 hover:shadow-[0_0_24px_-6px_rgba(57,255,20,0.6)]'
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                <span className="hidden sm:inline">Adicionado!</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Adicionar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
