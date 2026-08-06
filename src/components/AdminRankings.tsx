import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../store';
import { formatBRL } from '../utils';
import {
  TrendingUp,
  TrendingDown,
  Award,
  DollarSign,
  AlertTriangle,
  Flame,
  Layers,
  Tag,
  ShoppingBag,
} from 'lucide-react';

type Period = 'semana' | 'mes';

interface ProductAgg {
  productId: string;
  name: string;
  brand: string;
  qty: number;
  revenue: number;
  profit: number;
}

interface FlavorAgg {
  flavor: string;
  qty: number;
  revenue: number;
}

interface BrandAgg {
  brand: string;
  qty: number;
  revenue: number;
  profit: number;
}

export function AdminRankings() {
  const { products, sales, orders, fetchOrders } = useStore();
  const [period, setPeriod] = useState<Period>('semana');

  // Carrega o histórico de pedidos assim que a tela abre (se ainda não tiver sido carregado)
  useEffect(() => {
    if (!orders || orders.length === 0) {
      fetchOrders();
    }
  }, []);

  // Relatórios Automáticos (Diário, Semanal, Mensal)
  const { dailyTotal, weeklyTotal, monthlyTotal } = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    let daily = 0;
    let weekly = 0;
    let monthly = 0;

    (sales ?? []).forEach((s) => {
      const diff = now - s.timestamp;
      if (diff <= oneDay) daily += s.amount;
      if (diff <= oneWeek) weekly += s.amount;
      if (diff <= oneMonth) monthly += s.amount;
    });

    return { dailyTotal: daily, weeklyTotal: weekly, monthlyTotal: monthly };
  }, [sales]);

  // Resumo do dia (pedidos, ticket médio, lucro) a partir de "orders"
  const dailyReport = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const todayOrders = (orders ?? []).filter((o) => now - o.timestamp <= oneDay);
    const totalOrders = todayOrders.length;
    const totalProfit = todayOrders.reduce((s, o) => s + o.profit, 0);
    const avgTicket = totalOrders > 0 ? todayOrders.reduce((s, o) => s + o.totalAmount, 0) / totalOrders : 0;
    return { totalOrders, totalProfit, avgTicket };
  }, [orders]);

  // Agrega os itens vendidos (produto, sabor, marca) dentro do período escolhido
  const agg = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const since = now - (period === 'semana' ? 7 * oneDay : 30 * oneDay);

    const byProduct = new Map<string, ProductAgg>();
    const byFlavor = new Map<string, FlavorAgg>();
    const byBrand = new Map<string, BrandAgg>();

    (orders ?? [])
      .filter((o) => o.timestamp >= since)
      .forEach((o) => {
        o.items.forEach((i) => {
          const revenue = i.unitPrice * i.quantity;
          const cost = i.unitCost * i.quantity;
          const profit = revenue - cost;

          const p = byProduct.get(i.productId) || { productId: i.productId, name: i.productName, brand: i.brand, qty: 0, revenue: 0, profit: 0 };
          p.qty += i.quantity;
          p.revenue += revenue;
          p.profit += profit;
          byProduct.set(i.productId, p);

          const f = byFlavor.get(i.flavor) || { flavor: i.flavor, qty: 0, revenue: 0 };
          f.qty += i.quantity;
          f.revenue += revenue;
          byFlavor.set(i.flavor, f);

          const b = byBrand.get(i.brand) || { brand: i.brand, qty: 0, revenue: 0, profit: 0 };
          b.qty += i.quantity;
          b.revenue += revenue;
          b.profit += profit;
          byBrand.set(i.brand, b);
        });
      });

    const productList = Array.from(byProduct.values());
    const flavorList = Array.from(byFlavor.values());
    const brandList = Array.from(byBrand.values());

    const topSelling = [...productList].sort((a, b) => b.qty - a.qty).slice(0, 5);
    const mostProfitable = [...productList].sort((a, b) => b.profit - a.profit).slice(0, 5);

    // Menos vendidos: inclui produtos do catálogo que não venderam nada no período
    const soldQtyById = new Map(productList.map((p) => [p.productId, p.qty]));
    const leastSelling = [...(products ?? [])]
      .map((prod) => ({
        productId: prod.id,
        name: prod.name,
        brand: prod.brand,
        qty: soldQtyById.get(prod.id) ?? 0,
      }))
      .sort((a, b) => a.qty - b.qty)
      .slice(0, 5);

    const topFlavors = [...flavorList].sort((a, b) => b.qty - a.qty).slice(0, 8);
    const topBrands = [...brandList].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

    return { topSelling, mostProfitable, leastSelling, topFlavors, topBrands };
  }, [orders, products, period]);

  // Produtos ordenados por estoque (para identificar menor estoque / estoque crítico)
  const sortedByStock = useMemo(() => {
    return [...(products ?? [])].sort((a, b) => a.stock - b.stock);
  }, [products]);

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Rankings & Relatórios</h2>
          <p className="text-xs text-neutral-400 mt-1">Desempenho de vendas, faturamento e controle de estoque em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('semana')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${period === 'semana' ? 'bg-emerald-500 text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            Semana
          </button>
          <button
            onClick={() => setPeriod('mes')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${period === 'mes' ? 'bg-emerald-500 text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'}`}
          >
            Mês
          </button>
        </div>
      </div>

      {/* Cards de Faturamento Automático (Relatórios: diário / semanal / mensal) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturamento Hoje</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{formatBRL(dailyTotal)}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturamento na Semana</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white">{formatBRL(weeklyTotal)}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Faturamento no Mês</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{formatBRL(monthlyTotal)}</p>
        </div>
      </div>

      {/* Resumo automático do dia */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pedidos Hoje</span>
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{dailyReport.totalOrders}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Ticket Médio Hoje</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{formatBRL(dailyReport.avgTicket)}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lucro Hoje</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400">{formatBRL(dailyReport.totalProfit)}</p>
        </div>
      </div>

      {/* Ranking de Produtos: mais vendidos + mais lucrativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RankingCard
          icon={<Flame className="w-5 h-5 text-orange-400" />}
          title={`Mais Vendidos (${period === 'semana' ? 'Semana' : 'Mês'})`}
        >
          {agg.topSelling.length === 0 && <EmptyRow />}
          {agg.topSelling.map((p, idx) => (
            <RankRow
              key={p.productId}
              position={idx + 1}
              title={`${p.brand} ${p.name}`}
              subtitle={`${p.qty} un. vendida(s)`}
              value={formatBRL(p.revenue)}
            />
          ))}
        </RankingCard>

        <RankingCard
          icon={<Award className="w-5 h-5 text-purple-400" />}
          title={`Mais Lucrativos (${period === 'semana' ? 'Semana' : 'Mês'})`}
        >
          {agg.mostProfitable.length === 0 && <EmptyRow />}
          {agg.mostProfitable.map((p, idx) => (
            <RankRow
              key={p.productId}
              position={idx + 1}
              title={`${p.brand} ${p.name}`}
              subtitle={`${p.qty} un. vendida(s)`}
              value={formatBRL(p.profit)}
              valueClass="text-emerald-400"
            />
          ))}
        </RankingCard>

        <RankingCard
          icon={<TrendingDown className="w-5 h-5 text-red-400" />}
          title={`Menos Vendidos (${period === 'semana' ? 'Semana' : 'Mês'})`}
        >
          {agg.leastSelling.length === 0 && <EmptyRow />}
          {agg.leastSelling.map((p, idx) => (
            <RankRow
              key={p.productId}
              position={idx + 1}
              title={`${p.brand} ${p.name}`}
              subtitle={p.qty === 0 ? 'Não vendeu no período' : `${p.qty} un. vendida(s)`}
              value={`${p.qty} un.`}
              valueClass={p.qty === 0 ? 'text-red-400' : 'text-neutral-300'}
            />
          ))}
        </RankingCard>

        <RankingCard
          icon={<Layers className="w-5 h-5 text-cyan-400" />}
          title={`Ranking por Sabor (${period === 'semana' ? 'Semana' : 'Mês'})`}
        >
          {agg.topFlavors.length === 0 && <EmptyRow />}
          {agg.topFlavors.map((f, idx) => (
            <RankRow
              key={f.flavor}
              position={idx + 1}
              title={f.flavor}
              subtitle={`${f.qty} un. vendida(s)`}
              value={formatBRL(f.revenue)}
            />
          ))}
        </RankingCard>
      </div>

      {/* Ranking por Marca */}
      <RankingCard
        icon={<Tag className="w-5 h-5 text-blue-400" />}
        title={`Ranking por Marca (${period === 'semana' ? 'Semana' : 'Mês'})`}
      >
        {agg.topBrands.length === 0 && <EmptyRow />}
        {agg.topBrands.map((b, idx) => (
          <RankRow
            key={b.brand}
            position={idx + 1}
            title={b.brand}
            subtitle={`${b.qty} un. vendida(s) · lucro ${formatBRL(b.profit)}`}
            value={formatBRL(b.revenue)}
          />
        ))}
      </RankingCard>

      {/* Seção de Alertas e Menor Estoque */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Produtos com Estoque Baixo / Alerta</h3>
        </div>

        <div className="space-y-3">
          {sortedByStock.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase">{p.brand}</span>
                <p className="text-sm font-bold text-white">{p.name}</p>
                <p className="text-[11px] text-neutral-400">Sabores: {p.flavor}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${p.stock === 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {p.stock === 0 ? 'Esgotado' : `${p.stock} un. restantes`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RankingCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function RankRow({
  position,
  title,
  subtitle,
  value,
  valueClass = 'text-white',
}: {
  position: number;
  title: string;
  subtitle: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[11px] font-extrabold text-neutral-300">
          {position}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{title}</p>
          <p className="truncate text-[11px] text-neutral-400">{subtitle}</p>
        </div>
      </div>
      <span className={`shrink-0 text-sm font-extrabold ${valueClass}`}>{value}</span>
    </div>
  );
}

function EmptyRow() {
  return <p className="py-6 text-center text-xs text-neutral-500">Sem vendas registradas nesse período ainda.</p>;
}
