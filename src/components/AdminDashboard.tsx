import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Boxes,
  Calendar,
  ChevronDown,
  ChevronUp,
  DollarSign,
  LogOut,
  Package,
  Pencil,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Star, // <-- Ícone de estrela adicionado
  Tag,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../store';
import { formatBRL } from '../utils';
import { ProductForm } from './ProductForm';

interface Props {
  onExit: () => void;
}

type Tab = 'produtos' | 'cupons' | 'clientes' | 'pedidos';

function formatDate(ts?: number) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(ts?: number) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function AdminDashboard({ onExit }: Props) {
  const {
    products,
    coupons,
    customers,
    orders,
    fetchCustomers,
    fetchOrders,
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

  // clientes / pedidos
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Carrega clientes e pedidos só quando a aba é aberta pela primeira vez
  useEffect(() => {
    if (tab === 'clientes' && (!customers || customers.length === 0)) {
      fetchCustomers();
    }
    if (tab === 'pedidos' && (!orders || orders.length === 0)) {
      fetchOrders();
    }
  }, [tab]);

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

  const filteredCustomers = useMemo(() => {
    const list = customers ?? [];
    const q = customerSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q),
    );
  }, [customers, customerSearch]);

  const filteredOrders = useMemo(() => {
    const list = orders ?? [];
    const q = orderSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (o) =>
        (o.customerName ?? '').toLowerCase().includes(q) ||
        (o.customerPhone ?? '').toLowerCase().includes(q) ||
        o.items.some((i) => i.productName.toLowerCase().includes(q) || i.flavor.toLowerCase().includes(q)),
    );
  }, [orders, orderSearch]);

  const safeCoupons = coupons ?? [];

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
        <div className="mt-6 flex flex-wrap gap-2">
          <TabButton active={tab === 'produtos'} onClick={() => setTab('produtos')}>
            <Package className="h-4 w-4" /> Produtos
          </TabButton>
          <TabButton active={tab === 'cupons'} onClick={() => setTab('cupons')}>
            <Tag className="h-4 w-4" /> Cupons
          </TabButton>
          <TabButton active={tab === 'clientes'} onClick={() => setTab('clientes')}>
            <Users className="h-4 w-4" /> Clientes
          </TabButton>
          <TabButton active={tab === 'pedidos'} onClick={() => setTab('pedidos')}>
            <ShoppingBag className="h-4 w-4" /> Pedidos
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
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-b border-line transition hover:bg-bgAlt/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${p.gradient} text-xl shadow-sm`}>
                              {p.emoji}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-ink">{p.brand} {p.name}</p>
                                {p.featured && (
                                  <span className="rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-700">
                                    ⭐ Destaque
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-inkSoft">{p.flavor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-inkSoft">{p.category}</td>
                        <td className="px-4 py-3 font-semibold text-ink">{formatBRL(p.price)}</td>
                        <td className="px-4 py-3 text-inkSoft">{formatBRL(p.cost)}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.stock === 0 ? 'bg-gray-100 text-gray-500' : p.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {p.stock} un.
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {/* Botão de Estrela (Destacar na Home) */}
                            <button
                              onClick={() => handleToggleFeatured(p.id)}
                              title={p.featured ? 'Remover destaque da Home' : 'Destacar na Home'}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                                p.featured
                                  ? 'border-amber-300 bg-amber-50 text-amber-500'
                                  : 'border-line text-inkSoft hover:border-amber-200 hover:text-amber-500 hover:bg-amber-50/50'
                              }`}
                            >
                              <Star className={`h-3.5 w-3.5 ${p.featured ? 'fill-amber-500' : ''}`} />
                            </button>

                            <button onClick={() => handleEdit(p)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-inkSoft transition hover:border-accent hover:text-accent hover:bg-accentSoft">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setConfirmDelete(p)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-inkSoft transition hover:border-red-200 hover:text-red-500 hover:bg-red-50">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && <p className="py-12 text-center text-inkSoft">Nenhum produto encontrado.</p>}
              </div>

              {/* MOBILE CARDS */}
              <div className="divide-y divide-line md:hidden">
                {filtered.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-4 hover:bg-bgAlt/50 transition">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${p.gradient} text-2xl shadow-sm`}>
                      {p.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-semibold text-ink">{p.brand} {p.name}</p>
                        {p.featured && (
                          <span className="rounded-full bg-amber-100 px-1 py-0.2 text-[9px] font-bold text-amber-700">
                            ⭐
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-inkSoft">{p.flavor} · {p.category}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-bold text-accent">{formatBRL(p.price)}</span>
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${p.stock === 0 ? 'bg-gray-100 text-gray-500' : p.stock <= 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {p.stock} un.
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleToggleFeatured(p.id)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                          p.featured
                            ? 'border-amber-300 bg-amber-50 text-amber-500'
                            : 'border-line text-inkSoft'
                        }`}
                      >
                        <Star className={`h-3.5 w-3.5 ${p.featured ? 'fill-amber-500' : ''}`} />
                      </button>
                      <button onClick={() => handleEdit(p)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-inkSoft transition hover:bg-accentSoft hover:text-accent">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setConfirmDelete(p)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-inkSoft transition hover:bg-red-50 hover:text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && <p className="py-12 text-center text-inkSoft">Nenhum produto encontrado.</p>}
              </div>
            </div>
          </div>
        ) : tab === 'cupons' ? (
          <div className="mt-4">
            {/* CUPONS */}
            <div className="mb-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
              <p className="mb-3 text-sm font-semibold text-ink">Cadastrar novo cupom</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Código (ex: VERAO15)"
                  className="flex-1 rounded-xl border border-line bg-bg px-3 py-2.5 text-sm uppercase text-ink placeholder-inkSoft/60 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <input
                  value={couponPct}
                  onChange={(e) => setCouponPct(e.target.value)}
                  type="number"
                  placeholder="% desconto"
                  className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder-inkSoft/60 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent sm:w-32"
                />
                <button onClick={handleAddCoupon} className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white transition hover:bg-ink/90 active:scale-95">
                  Criar Cupom
                </button>
              </div>
              {couponMsg && (
                <p className={`mt-2 text-xs font-medium ${couponMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
                  {couponMsg.message}
                </p>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line bg-bgAlt text-xs uppercase tracking-wide text-inkSoft">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Código</th>
                    <th className="px-4 py-3 font-semibold">Desconto</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {safeCoupons.map((c) => (
                    <tr key={c.id} className="border-b border-line transition hover:bg-bgAlt/50">
                      <td className="px-4 py-3"><span className="font-display font-bold text-accent">{c.code}</span></td>
                      <td className="px-4 py-3 font-semibold text-ink">{c.discountPercent}%</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${c.active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          {c.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => toggleCoupon(c.id)} className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-inkSoft transition hover:border-accent hover:bg-accentSoft hover:text-accent">
                            {c.active ? 'Desativar' : 'Ativar'}
                          </button>
                          <button onClick={() => deleteCoupon(c.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-inkSoft transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {safeCoupons.length === 0 && <tr><td colSpan={4} className="py-12 text-center text-inkSoft">Nenhum cupom cadastrado.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        ) : tab === 'clientes' ? (
          <div className="mt-4">
            {/* CLIENTES */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
                <input
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Buscar por nome ou telefone..."
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder-inkSoft/60 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <p className="text-xs font-semibold text-inkSoft">{filteredCustomers.length} cliente(s)</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-bgAlt text-xs uppercase tracking-wide text-inkSoft">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Cliente</th>
                      <th className="px-4 py-3 font-semibold">1ª Compra</th>
                      <th className="px-4 py-3 font-semibold">Última Compra</th>
                      <th className="px-4 py-3 font-semibold">Compras</th>
                      <th className="px-4 py-3 text-right font-semibold">Total Gasto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((c) => (
                      <tr key={c.id} className="border-b border-line transition hover:bg-bgAlt/50">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-ink">{c.name}</p>
                          <p className="flex items-center gap-1 text-xs text-inkSoft"><Phone className="h-3 w-3" /> {c.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-inkSoft">{formatDate(c.firstPurchase)}</td>
                        <td className="px-4 py-3 text-inkSoft">{formatDate(c.lastPurchase)}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-accentSoft px-2 py-0.5 text-xs font-bold text-accent">
                            {c.purchaseCount}x
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-ink">{formatBRL(c.totalSpent)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredCustomers.length === 0 && <p className="py-12 text-center text-inkSoft">Nenhum cliente encontrado.</p>}
              </div>

              {/* MOBILE CARDS */}
              <div className="divide-y divide-line md:hidden">
                {filteredCustomers.map((c) => (
                  <div key={c.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-ink">{c.name}</p>
                      <span className="rounded-full bg-accentSoft px-2 py-0.5 text-xs font-bold text-accent">{c.purchaseCount}x</span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-inkSoft"><Phone className="h-3 w-3" /> {c.phone}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-inkSoft">
                      <span>1ª: {formatDate(c.firstPurchase)} · Última: {formatDate(c.lastPurchase)}</span>
                    </div>
                    <p className="mt-1 text-right text-sm font-bold text-ink">{formatBRL(c.totalSpent)}</p>
                  </div>
                ))}
                {filteredCustomers.length === 0 && <p className="py-12 text-center text-inkSoft">Nenhum cliente encontrado.</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            {/* PEDIDOS (HISTÓRICO DE COMPRAS) */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-inkSoft" />
                <input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Buscar por cliente, produto ou sabor..."
                  className="w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder-inkSoft/60 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <p className="text-xs font-semibold text-inkSoft">{filteredOrders.length} pedido(s)</p>
            </div>

            <div className="space-y-3">
              {filteredOrders.map((o) => {
                const expanded = expandedOrderId === o.id;
                return (
                  <div key={o.id} className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                    <button
                      onClick={() => setExpandedOrderId(expanded ? null : o.id)}
                      className="flex w-full items-center justify-between gap-3 p-4 text-left transition hover:bg-bgAlt/50"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{o.customerName || 'Cliente não identificado'}</p>
                        <p className="text-xs text-inkSoft">
                          {formatDateTime(o.timestamp)} {o.customerPhone ? `· ${o.customerPhone}` : ''}
                        </p>
                        <p className="mt-0.5 text-xs text-inkSoft">
                          {o.items.length} item(ns) · {o.items.map((i) => `${i.quantity}x ${i.productName} (${i.flavor})`).join(', ')}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <div className="text-right">
                          <p className="font-display text-base font-bold text-ink">{formatBRL(o.totalAmount)}</p>
                          <p className="text-[11px] font-semibold text-emerald-600">lucro {formatBRL(o.profit)}</p>
                        </div>
                        {expanded ? <ChevronUp className="h-4 w-4 text-inkSoft" /> : <ChevronDown className="h-4 w-4 text-inkSoft" />}
                      </div>
                    </button>

                    {expanded && (
                      <div className="border-t border-line bg-bgAlt/40 p-4">
                        <table className="w-full text-left text-xs">
                          <thead className="text-inkSoft">
                            <tr>
                              <th className="py-1 font-semibold">Produto</th>
                              <th className="py-1 font-semibold">Sabor</th>
                              <th className="py-1 font-semibold">Qtd</th>
                              <th className="py-1 text-right font-semibold">Valor unit.</th>
                              <th className="py-1 text-right font-semibold">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {o.items.map((item, idx) => (
                              <tr key={idx} className="border-t border-line/60">
                                <td className="py-1.5 text-ink">{item.brand} {item.productName}</td>
                                <td className="py-1.5 text-inkSoft">{item.flavor}</td>
                                <td className="py-1.5 text-inkSoft">{item.quantity}</td>
                                <td className="py-1.5 text-right text-inkSoft">{formatBRL(item.unitPrice)}</td>
                                <td className="py-1.5 text-right font-semibold text-ink">{formatBRL(item.unitPrice * item.quantity)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredOrders.length === 0 && <p className="py-12 text-center text-inkSoft">Nenhum pedido encontrado.</p>}
            </div>
          </div>
        )}
      </div>

      <ProductForm open={formOpen} onClose={() => setFormOpen(false)} editing={editing} />

      {confirmDelete && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm animate-scale-in rounded-3xl border border-line bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-display text-lg font-bold text-ink">Excluir produto?</h3>
            <p className="mt-1 text-sm text-inkSoft">
              <strong className="text-ink">{confirmDelete.brand} {confirmDelete.name}</strong> será removido da vitrine e do estoque.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 rounded-xl border border-line bg-bg py-2.5 text-sm font-semibold text-inkSoft transition hover:bg-bgAlt hover:text-ink">
                Cancelar
              </button>
              <button
                onClick={() => {
                  deleteProduct(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 active:scale-95"
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

function MetricCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: 'neon' | 'electric' | 'danger' }) {
  const colors = {
    neon: 'text-accent bg-accentSoft border-accent/20',
    electric: 'text-blue-600 bg-blue-50 border-blue-200',
    danger: 'text-red-500 bg-red-50 border-red-200',
  };
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border ${colors[accent]}`}>
        {icon}
      </div>
      <p className="text-[11px] font-bold uppercase tracking-wide text-inkSoft">{label}</p>
      <p className="mt-1 font-display text-lg font-bold text-ink">{value}</p>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all active:scale-95 ${
        active ? 'bg-ink text-white shadow-md' : 'border border-line bg-white text-inkSoft hover:border-accent/40 hover:bg-bgAlt hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}
