import { Lock, Search, ShoppingBag } from 'lucide-react';
import { useStore } from '../store';

interface Props {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  search: string;
  setSearch: (v: string) => void;
}

export function Header({ onOpenCart, onOpenAdmin, search, setSearch }: Props) {
  const { cartCount } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/50 glass">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        {/* Logo */}
        <a href="#top" className="flex shrink-0 items-center gap-2 transition-transform duration-300 hover:scale-105">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-500 font-display text-lg font-bold text-black shadow-[0_0_20px_-4px_rgba(57,255,20,0.5)]">
            L
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-base font-bold leading-none text-white">
              LKD <span className="text-neon-400">Imports</span>
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Tabacaria & Vapes
            </p>
          </div>
        </a>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-md sm:mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar marcas e sabores..."
            className="w-full rounded-xl border border-ink-700 bg-ink-850/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none transition focus:border-neon-500/50 focus:ring-1 focus:ring-neon-500/30"
          />
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={onOpenCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-ink-700 bg-ink-850 text-white transition-all duration-300 hover:scale-105 hover:border-neon-500/40 active:scale-95"
            aria-label="Carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-neon-500 px-1 text-[10px] font-bold text-black shadow-[0_0_12px_-2px_rgba(57,255,20,0.6)]">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenAdmin}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-700 bg-ink-850 text-white/60 transition-all duration-300 hover:scale-105 hover:border-danger/40 hover:text-danger active:scale-95"
            aria-label="Painel Admin"
            title="Painel Admin"
          >
            <Lock className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
