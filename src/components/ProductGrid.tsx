import { useMemo, useState } from 'react';
import { PackageSearch, SlidersHorizontal } from 'lucide-react';
import type { Category, Product } from '../types';
import { useStore } from '../store';
import { ProductCard } from './ProductCard';
import { Reveal } from './Reveal';

const CATEGORIES: (Category | 'Todos')[] = [
  'Todos',
  'Pods Descartáveis',
  'Vapes Recarregáveis',
  'Essências',
  'Acessórios',
];

interface Props {
  onAdd: (p: Product) => void;
  query: string;
}

export function ProductGrid({ onAdd, query }: Props) {
  const { products } = useStore();
  const [cat, setCat] = useState<Category | 'Todos'>('Todos');
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filtered = useMemo(() => {
    // Guard against undefined/empty products array
    const safe = Array.isArray(products) ? products : [];
    let list = safe.filter((p) => {
      if (!p) return false;
      const matchesCat = cat === 'Todos' || p.category === cat;
      const q = (query ?? '').trim().toLowerCase();
      const matchesQuery =
        !q ||
        (p.name ?? '').toLowerCase().includes(q) ||
        (p.brand ?? '').toLowerCase().includes(q) ||
        (p.flavor ?? '').toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'featured')
      list = [...list].sort(
        (a, b) => Number(!!b.featured) - Number(!!a.featured) || b.views - a.views,
      );
    return list;
  }, [products, query, cat, sort]);

  return (
    <section id="vitrine" className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Section heading */}
      <Reveal>
        <div className="mb-8">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-neon-400/60">
            Vitrine
          </p>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Produtos em destaque
          </h2>
          <p className="mt-1.5 text-sm font-light text-white/40">
            Estoque rotativo — quando acaba, acaba. Garanta o seu.
          </p>
        </div>
      </Reveal>

      {/* Toolbar: count + sort */}
      <Reveal delay={60}>
        <div className="mb-6 flex items-center justify-between gap-2">
          <p className="text-sm font-light text-white/50">
            <span className="font-semibold text-white">{filtered.length}</span> produto(s)
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-white/40" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-xl border border-ink-700/60 bg-ink-925 px-3 py-2.5 text-sm text-white outline-none transition focus:border-neon-500/50"
            >
              <option value="featured">Destaques</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>
        </div>
      </Reveal>

      {/* Category pills */}
      <Reveal delay={100}>
        <div className="mb-8 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                cat === c
                  ? 'bg-neon-500 text-black shadow-[0_0_20px_-6px_rgba(57,255,20,0.5)]'
                  : 'border border-ink-700/60 bg-ink-925 text-white/60 hover:border-neon-500/40 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Grid — staggered reveal */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink-700/50 bg-ink-925/60 py-20 text-center">
          <PackageSearch className="h-10 w-10 text-white/20" />
          <p className="text-sm font-light text-white/40">
            Nenhum produto encontrado para sua busca.
          </p>
          <button
            onClick={() => {
              setCat('Todos');
            }}
            className="mt-1 rounded-lg border border-ink-700 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-neon-500/40 hover:text-white"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <Reveal key={p.id ?? i} delay={Math.min(i * 60, 480)}>
              <ProductCard product={p} onAdd={onAdd} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
