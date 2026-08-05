import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import type { Product, Category } from '../types';
import { useStore } from '../store';

interface Props {
  open: boolean;
  onClose: () => void;
  editing: Product | null;
}

const GRADIENTS = [
  'from-orange-400 to-red-500',
  'from-emerald-400 to-emerald-600',
  'from-blue-400 to-indigo-500',
  'from-purple-400 to-pink-500',
  'from-yellow-400 to-orange-500',
  'from-zinc-400 to-zinc-600',
];

export function ProductForm({ open, onClose, editing }: Props) {
  const { addProduct, updateProduct } = useStore();
  
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [flavor, setFlavor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Pods Descartáveis');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [stock, setStock] = useState('');
  const [emoji, setEmoji] = useState('💨');
  const [gradient, setGradient] = useState(GRADIENTS[0]);

  useEffect(() => {
    if (editing) {
      setBrand(editing.brand);
      setName(editing.name);
      setFlavor(editing.flavor);
      setDescription(editing.description || '');
      setCategory(editing.category);
      setPrice(String(editing.price));
      setCost(String(editing.cost));
      setStock(String(editing.stock));
      setEmoji(editing.emoji);
      setGradient(editing.gradient);
    } else {
      setBrand('');
      setName('');
      setFlavor('');
      setDescription('');
      setCategory('Pods Descartáveis');
      setPrice('');
      setCost('');
      setStock('');
      setEmoji('💨');
      setGradient(GRADIENTS[0]);
    }
  }, [editing, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      brand,
      name,
      flavor, // Aqui fica a mágica dos sabores separados por vírgula!
      description,
      category,
      price: parseFloat(price.replace(',', '.')),
      cost: parseFloat(cost.replace(',', '.')),
      stock: parseInt(stock, 10),
      emoji,
      gradient,
    };

    if (editing) {
      updateProduct(editing.id, productData);
    } else {
      addProduct(productData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Fundo escurecido */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal do Formulário - Agora com fundo branco e visível! */}
      <div className="relative w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-white">
          <h2 className="font-display text-lg font-bold text-ink">
            {editing ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-inkSoft hover:bg-bgAlt hover:text-ink transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-white">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Info Básica */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Marca</label>
                <input required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex: Ignite" className="w-full rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Modelo</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: V15" className="w-full rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent" />
              </div>
            </div>

            {/* A SOLUÇÃO DOS SABORES AQUI */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">
                Sabores Disponíveis (Separe por vírgula)
              </label>
              <input required value={flavor} onChange={(e) => setFlavor(e.target.value)} placeholder="Ex: Mango Ice, Mint, Watermelon" className="w-full rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent" />
              <p className="mt-1 text-xs text-inkSoft">Na vitrine, o cliente poderá clicar e escolher um desses sabores.</p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Descrição do Produto</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Texto para convencer o cliente a comprar..." className="w-full rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent resize-none" />
            </div>

            {/* Valores */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Categoria</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent">
                  <option value="Pods Descartáveis">Pods Descartáveis</option>
                  <option value="Vapes Recarregáveis">Vapes Recarregáveis</option>
                  <option value="Essências">Essências</option>
                  <option value="Acessórios">Acessórios</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Preço</label>
                <input required type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Custo</label>
                <input required type="number" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="0.00" className="w-full rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent" />
              </div>
            </div>

            {/* Estoque e Visual */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Estoque Total</label>
                <input required type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" className="w-full rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Emoji do Card</label>
                <input required value={emoji} onChange={(e) => setEmoji(e.target.value)} className="w-full rounded-xl border border-line bg-bg py-2.5 px-4 text-center text-xl outline-none focus:border-accent" />
              </div>
            </div>

            {/* Cores do Card */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-inkSoft">Cor de Fundo do Card</label>
              <div className="flex flex-wrap gap-3">
                {GRADIENTS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGradient(g)}
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${g} transition-transform ${gradient === g ? 'scale-110 ring-2 ring-ink ring-offset-2' : 'hover:scale-105'}`}
                  />
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-line bg-bg px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-inkSoft hover:bg-bgAlt hover:text-ink transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="product-form"
            className="flex items-center gap-2 rounded-xl bg-ink px-6 py-2.5 text-sm font-bold text-white transition hover:bg-ink/90 active:scale-95 shadow-md"
          >
            <Save className="h-4 w-4" />
            {editing ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </div>

      </div>
    </div>
  );
}
