import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Boxes,
  DollarSign,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
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
    addCoupon,
    toggleCoupon,
    deleteCoupon,
    logout,
    resetFlash,
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
    const totalProducts = products.length;
    const stockValue = products.reduce((s, p) => s + p.price * p.stock, 0);
    const costValue = products.reduce((s, p) => s + p.cost * p.stock, 0);
    const activeCoupons = coupons.filter((c) => c.active).length;
    const lowStock = products.filter((p) => p.stock <= 5).length;
    return { totalProducts, stockValue, costValue, activeCoupons, lowStock };
  }, [products, coupons]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
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

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-ink-700 glass">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-700 bg-ink-850 text-white/70 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="font-display text-base font-bold text-white">
                Painel <span className="text-neon-400">Admin</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-white/40">LKD Imports</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-2 text-xs font-semibold text-white/70 transition hover:border-danger/40 hover:text-danger"
          >
            <LogOut className="h-3.5 w-3.5" /> Sair
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          <MetricCard
            icon={<Package className="h-5 w-5" />}
            label="Produtos"
            value={String(metrics.totalProducts)}
            accent="neon"
          />
          <MetricCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Valor em estoque"
            value={formatBRL(metrics.stockValue)}
            accent="electric"
          />
          <MetricCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Custo do estoque"
            value={formatBRL(metrics.costValue)}
            accent="neon"
          />
          <MetricCard
            icon={<Tag className="h-5 w-5" />}
            label="Cupons ativos"
            value={String(metrics.activeCoupons)}
            accent="electric"
          />
          <MetricCard
            icon={<Boxes className="h-5 w-5" />}
            label="Estoque crítico"
            value={String(metrics.lowStock)}
            accent="danger"
          />
        </div>

        {/* Flash reset */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-ink-700 bg-ink-900 px-4 py-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-danger" />
            <p className="text-sm text-white/70">
              Reinicie o contador da Promoção Relâmpapo na vitrine.
            </p>
          </div>
          <button
            onClick={resetFlash}
            className="rounded-lg bg-danger/20 px-4 py-2 text-xs font-bold text-danger transition hover:bg-danger/30"
          >
            Reiniciar contador
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2">
          <TabButton active={tab === 'produtos'} onClick={() => setTab('produtos')}>
            <Package className="h-4 w-4" /> Produtos
          </TabButton>
          <TabButton active={tab === 'cupons'} onClick={() => setTab('cupons')}>
            <Tag className="h-4 w-4" /> Cupons
          </TabButton>
        </div>

        {/* Content */}
        {tab === 'produtos' ? (
          <div className="mt-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar produto..."
                  className="w-full rounded-xl border border-ink-700 bg-ink-850 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-neon-500/50"
                />
              </div>
              <button
                onClick={handleNew}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-neon-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-neon-400"
              >
                <Plus className="h-4 w-4" /> Adicionar Novo Item
              </button>
            </div>

            {/* Table (desktop) / cards (mobile) */}
            <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
              {/* Desktop table */}
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-ink-700 bg-ink-850 text-xs uppercase tracking-wide text-white/50">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Produto</th>
                      <th className="px-4 py-3 font-semibold">Categoria</th>
                      <th className="px-4 py-3 font-semibold">Preço</th>
                      <th className="px-4 py-3 font-semibold">Custo</th>
                      <th className="px-4 py-3 font-semibold">Estoque</th>
                      <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-ink-800 transition hover:bg-ink-850/50"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${p.gradient} text-xl`}
                            >
                              {p.emoji}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{p.brand} {p.name}</p>
                              <p className="text-xs text-white/40">{p.flavor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white/60">{p.category}</td>
                        <td className="px-4 py-3 font-semibold text-white">{formatBRL(p.price)}</td>
                        <td className="px-4 py-3 text-white/50">{formatBRL(p.cost)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                              p.stock === 0
                                ? 'bg-ink-700 text-white/40'
                                : p.stock <= 5
                                  ? 'bg-danger/20 text-danger'
                                  : 'bg-neon-500/15 text-neon-300'
                            }`}
                          >
                            {p.stock} un.
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(p)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-700 text-white/60 transition hover:border-neon-500/40 hover:text-neon-400"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmDelete(p)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-700 text-white/60 transition hover:border-danger/40 hover:text-danger"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <p className="py-12 text-center text-white/40">Nenhum produto encontrado.</p>
                )}
              </div>

              {/* Mobile cards */}
              <div className="divide-y divide-ink-800 md:hidden">
                {filtered.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${p.gradient} text-2xl`}
                    >
                      {p.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-semibold text-white">{p.brand} {p.name}</p>
                      <p className="truncate text-xs text-white/40">{p.flavor} · {p.category}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold text-neon-400">{formatBRL(p.price)}</span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                            p.stock === 0
                              ? 'bg-ink-700 text-white/40'
                              : p.stock <= 5
                                ? 'bg-danger/20 text-danger'
                                : 'bg-neon-500/15 text-neon-300'
                          }`}
                        >
                          {p.stock} un.
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-700 text-white/60 transition hover:text-neon-400"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-700 text-white/60 transition hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="py-12 text-center text-white/40">Nenhum produto encontrado.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {/* Add coupon */}
            <div className="mb-4 rounded-2xl border border-ink-700 bg-ink-900 p-4">
              <p className="mb-3 text-sm font-semibold text-white">Cadastrar novo cupom</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Código (ex: VERAO15)"
                  className="flex-1 rounded-xl border border-ink-700 bg-ink-850 px-3 py-2.5 text-sm uppercase text-white placeholder-white/30 outline-none focus:border-neon-500/50"
                />
                <input
                  value={couponPct}
                  onChange={(e) => setCouponPct(e.target.value)}
                  type="number"
                  placeholder="% desconto"
                  className="w-full rounded-xl border border-ink-700 bg-ink-850 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-neon-500/50 sm:w-32"
                />
                <button
                  onClick={handleAddCoupon}
                  className="rounded-xl bg-neon-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-neon-400"
                >
                  Criar Cupom
                </button>
              </div>
              {couponMsg && (
                <p
                  className={`mt-2 text-xs ${couponMsg.ok ? 'text-neon-400' : 'text-danger'}`}
                >
                  {couponMsg.message}
                </p>
              )}
            </div>

            {/* Coupon list */}
            <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-ink-700 bg-ink-850 text-xs uppercase tracking-wide text-white/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Código</th>
                    <th className="px-4 py-3 font-semibold">Desconto</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c.id} className="border-b border-ink-800 transition hover:bg-ink-850/50">
                      <td className="px-4 py-3">
                        <span className="font-display font-bold text-neon-400">{c.code}</span>
                      </td>
                      <td className="px-4 py-3 text-white">{c.discountPercent}%</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                            c.active
                              ? 'bg-neon-500/15 text-neon-300'
                              : 'bg-ink-700 text-white/40'
                          }`}
                        >
                          {c.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleCoupon(c.id)}
                            className="rounded-lg border border-ink-700 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-neon-500/40 hover:text-neon-400"
                          >
                            {c.active ? 'Desativar' : 'Ativar'}
                          </button>
                          <button
                            onClick={() => deleteCoupon(c.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-700 text-white/60 transition hover:border-danger/40 hover:text-danger"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {coupons.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-white/40">
                        Nenhum cupom cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product form modal */}
      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        editing={editing}
      />

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="relative w-full max-w-sm animate-scale-in rounded-2xl border border-ink-700 bg-ink-900 p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-danger/20">
              <Trash2 className="h-6 w-6 text-danger" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Excluir produto?</h3>
            <p className="mt-1 text-sm text-white/50">
              {confirmDelete.brand} {confirmDelete.name} será removido da vitrine e do estoque.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-ink-700 bg-ink-850 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-ink-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteProduct(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="flex-1 rounded-xl bg-danger py-2.5 text-sm font-bold text-white transition hover:bg-danger-600"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: 'neon' | 'electric' | 'danger';
}) {
  const colors = {
    neon: 'text-neon-400 bg-neon-500/10 border-neon-500/20',
    electric: 'text-electric-400 bg-electric-500/10 border-electric-500/20',
    danger: 'text-danger bg-danger/10 border-danger/20',
  };
  return (
    <div className="rounded-2xl border border-ink-700 bg-ink-900 p-4">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border ${colors[accent]}`}>
        {icon}
      </div>
      <p className="text-xs uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-0.5 font-display text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? 'bg-neon-500 text-black'
          : 'border border-ink-700 bg-ink-850 text-white/70 hover:border-neon-500/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
