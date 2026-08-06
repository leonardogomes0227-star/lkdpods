import { Lock, Search, ShoppingBag, Star, Instagram } from 'lucide-react';
import { useStore } from '../store';

interface Props {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenPortal: () => void;
  search: string;
  setSearch: (v: string) => void;
}

export function Header({ onOpenCart, onOpenAdmin, onOpenPortal, search, setSearch }: Props) {
  const { cartCount } = useStore();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2.5 transition-transform duration-300 hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 border border-neutral-800 text-2xl shadow-md">
            🦍
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-base font-bold leading-none text-ink tracking-wide">
              LKD <span className="text-accent">Imports</span>
            </p>
            <p className="text-[10px] uppercase tracking-widest text-inkSoft font-semibold">
              Tabacaria &amp; Vapes
            </p>
          </div>
        </a>

        <div className="relative flex-1 sm:max-w-md sm:mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar marcas e sabores..."
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder-inkSoft outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Botão do Instagram */}
          <a
            href="https://www.instagram.com/lkd_importes?igsh=cm45M2VnMzQ2czhk&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-inkSoft transition-all duration-300 hover:scale-105 hover:border-pink-400 hover:text-pink-600 active:scale-95 shadow-sm"
            aria-label="Instagram"
            title="Siga no Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>

          {/* Botão do Clube de Fidelidade / Histórico */}
          <button
            onClick={onOpenPortal}
            className="flex items-center gap-1.5 h-10 px-3 rounded-xl border border-line bg-white text-ink transition-all duration-300 hover:scale-105 hover:border-accent/40 active:scale-95 text-xs font-semibold shadow-sm"
            aria-label="Clube de Fidelidade"
            title="Meus Pontos e Pedidos"
          >
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="hidden md:inline">Fidelidade</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-ink transition-all duration-300 hover:scale-105 hover:border-accent/40 active:scale-95"
            aria-label="Carrinho"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          
          <button
            onClick={onOpenAdmin}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-inkSoft transition-all duration-300 hover:scale-105 hover:border-ink/30 hover:text-ink active:scale-95"
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
