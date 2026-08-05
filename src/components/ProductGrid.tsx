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
      <Reveal>
        <div className="mb-8">
          <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            Vitrine
          </p>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Produtos em destaque
          </h2>
          <p className="mt-1.5 text-sm text-inkSoft">
            Estoque rotativo — quando acaba, acaba. Garanta o seu.
          </p>
        </div>
      </Reveal>

      <Reveal delay={60}>
        <div className="mb-6 flex items-center justify-between gap-2">
          <p className="text-sm text-inkSoft">
            <span className="font-semibold text-ink">{filtered.length}</span> produto(s)
          </p>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-inkSoft" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent/50"
            >
              <option value="featured">Destaques</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mb-8 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                cat === c
                  ? 'bg-ink text-white'
                  : 'border border-line bg-white text-inkSoft hover:border-accent/40 hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-white py-20 text-center">
          <PackageSearch className="h-10 w-10 text-line" />
          <p className="text-sm text-inkSoft">
            Nenhum produto encontrado para sua busca.
          </p>
          <button
            onClick={() => { setCat('Todos'); }}
            className="mt-1 rounded-lg border border-line px-4 py-2 text-xs font-semibold text-inkSoft transition hover:border-accent/40 hover:text-ink"
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
