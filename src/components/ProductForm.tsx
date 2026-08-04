import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Category, Product } from '../types';
import { useStore } from '../store';

const CATEGORIES: Category[] = [
  'Pods Descartáveis',
  'Vapes Recarregáveis',
  'Essências',
  'Acessórios',
];

const EMOJIS = ['🥭', '🍉', '🍇', '🍓', '🫐', '🍍', '🌿', '🍋', '🍑', '🥥', '⚙️', '🔋', '🔌', '💨', '🔥', '❄️'];
const GRADIENTS = [
  'from-amber-500/20 to-orange-600/10',
  'from-pink-500/20 to-rose-600/10',
  'from-violet-500/20 to-purple-600/10',
  'from-blue-500/20 to-indigo-600/10',
  'from-green-500/20 to-emerald-600/10',
  'from-cyan-500/20 to-blue-600/10',
  'from-red-500/20 to-rose-600/10',
  'from-teal-500/20 to-cyan-600/10',
  'from-slate-500/20 to-zinc-600/10',
];

interface Props {
  open: boolean;
  onClose: () => void;
  editing: Product | null;
}

interface FormState {
  name: string;
  brand: string;
  category: Category;
  flavor: string;
  description: string;
  price: string;
  cost: string;
  stock: string;
  emoji: string;
  gradient: string;
  featured: boolean;
}

const empty: FormState = {
  name: '',
  brand: '',
  category: 'Pods Descartáveis',
  flavor: '',
  description: '',
  price: '',
  cost: '',
  stock: '',
  emoji: '💨',
  gradient: GRADIENTS[0],
  featured: false,
};

export function ProductForm({ open, onClose, editing }: Props) {
  const { addProduct, updateProduct } = useStore();
  const [form, setForm] = useState<FormState>(empty);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        brand: editing.brand,
        category: editing.category,
        flavor: editing.flavor,
        description: editing.description,
        price: String(editing.price),
        cost: String(editing.cost),
        stock: String(editing.stock),
        emoji: editing.emoji,
        gradient: editing.gradient,
        featured: !!editing.featured,
      });
    } else {
      setForm(empty);
    }
    setError('');
  }, [editing, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.name.trim() || !form.brand.trim()) {
      setError('Nome e marca são obrigatórios.');
      return;
    }
    const price = parseFloat(form.price);
    const cost = parseFloat(form.cost || '0');
    const stock = parseInt(form.stock || '0', 10);
    if (isNaN(price) || price <= 0) {
      setError('Informe um preço válido.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      flavor: form.flavor.trim() || '—',
      description: form.description.trim() || 'Produto premium LKD Imports.',
      price,
      cost,
      stock,
      emoji: form.emoji,
      gradient: form.gradient,
      featured: form.featured,
    };

    if (editing) updateProduct(editing.id, payload);
    else addProduct(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-ink-700 bg-ink-900 shadow-2xl animate-slide-up sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4">
          <h2 className="font-display text-lg font-bold text-white">
            {editing ? 'Editar Produto' : 'Adicionar Novo Item'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:bg-ink-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome do produto" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Marca" value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
                Categoria
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="w-full rounded-xl border border-ink-700 bg-ink-850 px-3 py-2.5 text-sm text-white outline-none focus:border-neon-500/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Input label="Sabor / Detalhes" value={form.flavor} onChange={(v) => setForm({ ...form, flavor: v })} />
          </div>

          <div className="mt-3">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
              Descrição
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Breve descrição do produto..."
              className="w-full resize-none rounded-xl border border-ink-700 bg-ink-850 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-neon-500/50"
            />
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <Input label="Preço (R$)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
            <Input label="Custo (R$)" type="number" value={form.cost} onChange={(v) => setForm({ ...form, cost: v })} />
            <Input label="Estoque" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
          </div>

          {/* Emoji picker */}
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
              Ícone (emoji)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  onClick={() => setForm({ ...form, emoji: em })}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
                    form.emoji === em ? 'bg-neon-500/20 ring-1 ring-neon-500' : 'bg-ink-850 hover:bg-ink-800'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Gradient picker */}
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
              Cor do card
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GRADIENTS.map((g) => (
                <button
                  key={g}
                  onClick={() => setForm({ ...form, gradient: g })}
                  className={`h-9 w-9 rounded-lg bg-gradient-to-br ${g} transition ${
                    form.gradient === g ? 'ring-2 ring-neon-500' : 'ring-1 ring-ink-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Featured */}
          <label className="mt-4 flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 accent-neon-500"
            />
            <span className="text-sm text-white/70">Destacar na vitrine (em alta)</span>
          </label>

          {error && (
            <p className="mt-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs text-danger">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 border-t border-ink-700 px-5 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-ink-700 bg-ink-850 py-3 text-sm font-semibold text-white/70 transition hover:bg-ink-800"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-neon-500 py-3 text-sm font-bold text-black transition hover:bg-neon-400"
          >
            {editing ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/60">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink-700 bg-ink-850 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-neon-500/50"
      />
    </div>
  );
}
