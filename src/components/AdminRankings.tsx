import React, { useMemo } from 'react';
import { useStore } from '../store';
import { formatBRL } from '../utils';
import { TrendingUp, Award, DollarSign, AlertTriangle } from 'lucide-react';

export function AdminRankings() {
  const { products, sales } = useStore();

  // Relatórios Automáticos (Diário, Semanal, Mensal)
  const { dailyTotal, weeklyTotal, monthlyTotal } = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    let daily = 0;
    let weekly = 0;
    let monthly = 0;

    sales.forEach((s) => {
      const diff = now - s.timestamp;
      if (diff <= oneDay) daily += s.amount;
      if (diff <= oneWeek) weekly += s.amount;
      if (diff <= oneMonth) monthly += s.amount;
    });

    return { dailyTotal: daily, weeklyTotal: weekly, monthlyTotal: monthly };
  }, [sales]);

  // Produtos ordenados por estoque (para identificar menor estoque / menos vendidos)
  const sortedByStock = useMemo(() => {
    return [...products].sort((a, b) => a.stock - b.stock);
  }, [products]);

  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight">Rankings & Relatórios</h2>
        <p className="text-xs text-neutral-400 mt-1">Desempenho de vendas, faturamento e controle de estoque em tempo real.</p>
      </div>

      {/* Cards de Faturamento Automático */}
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
