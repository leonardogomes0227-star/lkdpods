import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Boxes,
  Calendar,
  DollarSign,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  Star, // <-- Ícone de estrela adicionado
  Tag,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../store';
import { formatBRL } from '../utils';
import { ProductForm } from './ProductForm';

interface Props {
  onExit: () => void;
}

type Tab = 'produtos' | 'cupons';

export function AdminDashboard({ onExit }: Props) {
  const {
    products,
    coupons,
    deleteProduct,
    updateProduct, // <-- ADICIONADO AQUI PARA PODER MARCAR O DESTAQUE
    addCoupon,
    toggleCoupon,
    deleteCoupon,
    logout,
    resetFlash,
    dailyTotal,
    weeklyTotal,
    monthlyTotal,
  } = useStore();

  const [tab, setTab] = useState<Tab>('produtos');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  // coupon form
  const [couponCode, setCouponCode] = useState('');
  const [couponPct, setCouponPct] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; message: string } | null>(null);

  const metrics = useMemo(() => {
    const safeProducts = products ?? [];
    const safeCoupons = coupons ?? [];
    const totalProducts = safeProducts.length;
    const stockValue = safeProducts.reduce((s, p) => s + p.price * p.stock, 0);
    const costValue = safeProducts.reduce((s, p) => s + p.cost * p.stock, 0);
    const activeCoupons = safeCoupons.filter((c) => c.active).length;
    const lowStock = safeProducts.filter((p) => p.stock <= 5).length;
    return { totalProducts, stockValue, costValue, activeCoupons, lowStock };
  }, [products, coupons]);

  const filtered = useMemo(() => {
    const list = products ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.flavor.toLowerCase().includes(q),
    );
  }, [products, search]);

  const handleEdit = (p: Product) => {
    setEditing(p);
    setFormOpen(true);
  };

  const handleNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleAddCoupon = () => {
    if (!couponCode.trim() || !couponPct.trim()) return;
    const res = addCoupon(couponCode, parseFloat(couponPct));
    setCouponMsg(res);
    if (res.ok) {
      setCouponCode('');
      setCouponPct('');
    }
    setTimeout(() => setCouponMsg(null), 3000);
  };

  const handleLogout = () => {
    logout();
    onExit();
  };

  // FUNÇÃO PARA DEFINIR O PRODUTO EM DESTAQUE NA HOME
  const handleToggleFeatured = (productId: string) => {
    (products ?? []).forEach((p) => {
      if (p.id === productId) {
        updateProduct(p.id, { featured: !p.featured });
      } else if (p.featured) {
        updateProduct(p.id, { featured: false }); // Garante apenas um em destaque
      }
    });
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-line bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-inkSoft transition hover:text-ink hover:shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="font-display text-base font-bold text-ink">
                Painel <span className="text-accent">Admin</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-inkSoft">LKD Imports</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-inkSoft transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut className="h-3.5 w-3.5" /> Sair
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        
        {/* VISÃO GERAL DE VENDAS */}
        <div className="mb-6">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Visão Geral (Fechamento)</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-inkSoft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider">Fechamento do Dia</p>
                </div>
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-ink">{formatBRL(dailyTotal)}</p>
              <p className="mt-1 text-xs text-inkSoft">Hoje</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-inkSoft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider">Esta Semana</p>
                </div>
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-ink">{formatBRL(weeklyTotal)}</p>
              <p className="mt-1 text-xs text-inkSoft">Últimos 7 dias</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-inkSoft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider">Neste Mês</p>
                </div>
              </div>
              <p className="mt-4 font-display text-3xl font-bold text-ink">{formatBRL(monthlyTotal)}</p>
              <p className="mt-1 text-xs text-inkSoft">Mês Atual</p>
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          <MetricCard icon={<Package className="h-5 w-5" />} label="Produtos" value={String(metrics.totalProducts)} accent="neon" />
          <MetricCard icon={<DollarSign className="h-5 w-5" />} label="Valor em estoque" value={formatBRL(metrics.stockValue)} accent="electric" />
          <MetricCard icon={<TrendingUp className="h-5 w-5" />} label="Custo do estoque" value={formatBRL(metrics.costValue)} accent="neon" />
          <MetricCard icon={<Tag className="h-5 w-5" />} label="Cupons ativos" value={String(metrics.activeCoupons)} accent="electric" />
          <MetricCard icon={<Boxes className="h-5 w-5" />} label="Estoque crítico" value={String(metrics.lowStock)} accent="danger" />
        </div>

        {/* FLASH RESET */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-red-500" />
            <p className="text-sm text-inkSoft">
              Reinicie o contador da Promoção Relâmpago na vitrine.
            </p>
          </div>
          <button onClick={resetFlash} className="rounded-lg bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100">
            Reiniciar contador
          </button>
        </div>

        {/* TABS */}
        <div className="mt-6 flex gap-2">
          <TabButton active={tab === 'produtos'} onClick={() => setTab('produtos')}>
            <Package className="h-4 w-4" /> Produtos
          </TabButton>
          <TabButton active={tab === 'cupons'} onClick={() => setTab('cupons')}>
            <Tag className="h-4 w-4" /> Cupons
          </TabButton>
        </div>

        {/* CONTENT */}
        {tab === 'produtos' ? (
          <div className="mt-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar produto..."
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder-inkSoft/60 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <button
                onClick={handleNew}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ink/90 active:scale-95"
              >
                <Plus className="h-4 w-4" /> Adicionar Novo Item
              </button>
            </div>

            {/* TABELA DE PRODUTOS */}
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-bgAlt text-xs uppercase tracking-wide text-inkSoft">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Produto</th>
                      <th className="px-4 py-3 font-semibold">Categoria</th>
                      <th className="px-4 py-3 font-semibold">Preço</th>
                      <th className="px-4 py-3 font-semibold">Custo</th>
                      <th className="px-4 py-3 font-semibold">Estoque</th>
                      <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
