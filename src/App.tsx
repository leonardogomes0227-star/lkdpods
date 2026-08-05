import { useState } from 'react';
import { Check, Flame, Instagram, MessageCircle, Truck } from 'lucide-react';
import { StoreProvider, useStore } from './store';
import { AnimatedBackground } from './components/AnimatedBackground';
import { FlashBanner } from './components/FlashBanner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { Reveal } from './components/Reveal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import type { Product } from './types';

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 animate-slide-up">
      <div className="flex items-center gap-2 rounded-xl border border-neon-500/40 bg-ink-900 px-4 py-3 shadow-2xl">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-500">
          <Check className="h-4 w-4 text-black" />
        </div>
        <p className="text-sm font-semibold text-white">{message}</p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-ink-700/40 bg-ink-975/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <Reveal>
            <div>
              <div className="flex items-center gap-2">
                {/* Ícone limpo, sem neon e sem brilho verde radioativo */}
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-850 border border-ink-700 font-display text-lg font-bold text-white">
                  L
                </div>
                <p className="font-display text-lg font-bold text-white">
                  LKD <span className="text-neon-400">Imports</span>
                </p>
              </div>
              <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-white/40">
                Tabacaria underground com os pods, vapes, essências e acessórios mais desejados.
                Entrega rápida e exclusiva para nossa cidade.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                Atendimento
              </p>
              <ul className="space-y-2 text-sm font-light text-white/50">
                <li className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-neon-400" /> Entrega local rápida
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-neon-400" /> Pedidos via WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-danger" /> Promoções relâmpago diárias
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                Redes
              </p>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-700 bg-ink-850 text-white/60 transition-all duration-300 hover:scale-110 hover:border-neon-500/40 hover:text-neon-400 active:scale-95"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-700 bg-ink-850 text-white/60 transition-all duration-300 hover:scale-110 hover:border-neon-500/40 hover:text-neon-400 active:scale-95"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-8 border-t border-ink-800 pt-6 text-center text-xs font-light text-white/30">
          LKD Imports — Tabacaria & Vapes. Produtos para maiores de 18 anos. &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}

function StoreFront() {
  const { flashDeadline, isAuthed, addToCart } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleAdd = (p: Product) => {
    addToCart(p);
    setToast(`${p.brand} ${p.name} adicionado ao carrinho!`);
    setTimeout(() => setToast(null), 2500);
  };

  if (isAuthed) {
    return <AdminDashboard onExit={() => window.location.reload()} />;
  }

  return (
    <div id="top" className="relative min-h-screen bg-ink-975">
      <AnimatedBackground />
      <div className="relative z-10">
        <FlashBanner deadline={flashDeadline} />
        <Header
          onOpenCart={() => setCartOpen(true)}
          onOpenAdmin={() => setAdminLoginOpen(true)}
          search={search}
          setSearch={setSearch}
        />
        <Hero />
        <ProductGrid onAdd={handleAdd} query={search} />
        <Footer />
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onDone={() => setCheckoutOpen(false)}
      />
      {adminLoginOpen && <AdminLogin onClose={() => setAdminLoginOpen(false)} />}

      {toast && <Toast message={toast} />}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreFront />
    </StoreProvider>
  );
}
