import { useState, useEffect } from 'react';
import { X, Save, Camera, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import type { Product, Category, FlavorStock } from '../types';
import { useStore } from '../store';

interface Props {
  open: boolean;
  onClose: () => void;
  editing: Product | null;
}

const GRADIENTS = [
  'from-zinc-100 to-zinc-200',
  'from-orange-400 to-red-500',
  'from-emerald-400 to-emerald-600',
  'from-blue-400 to-indigo-500',
  'from-purple-400 to-pink-500',
  'from-zinc-800 to-black',
];

export function ProductForm({ open, onClose, editing }: Props) {
  const { addProduct, updateProduct } = useStore();

  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [flavors, setFlavors] = useState<FlavorStock[]>([{ name: '', stock: 0 }]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Pods Descartáveis');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');
  const [emoji, setEmoji] = useState('💨');
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    if (editing) {
      setBrand(editing.brand);
      setName(editing.name);
      setFlavors(
        Array.isArray(editing.flavors) && editing.flavors.length > 0
          ? editing.flavors
          : [{ name: '', stock: 0 }]
      );
      setDescription(editing.description || '');
      setCategory(editing.category);
      setPrice(String(editing.price));
      setCost(String(editing.cost));
      setEmoji(editing.emoji);
      setGradient(editing.gradient);
      setImage(editing.image || '');
    } else {
      setBrand('');
      setName('');
      setFlavors([{ name: '', stock: 0 }]);
      setDescription('');
      setCategory('Pods Descartáveis');
      setPrice('');
      setCost('');
      setEmoji('💨');
      setGradient(GRADIENTS[0]);
      setImage('');
    }
  }, [editing, open]);

  if (!open) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', 0.6);
          setImage(compressed);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFlavorNameChange = (index: number, value: string) => {
    setFlavors((prev) => prev.map((f, i) => (i === index ? { ...f, name: value } : f)));
  };

  const handleFlavorStockChange = (index: number, value: string) => {
    const parsed = parseInt(value, 10);
    setFlavors((prev) =>
      prev.map((f, i) => (i === index ? { ...f, stock: Number.isNaN(parsed) ? 0 : parsed } : f))
    );
  };

  const handleAddFlavorRow = () => {
    setFlavors((prev) => [...prev, { name: '', stock: 0 }]);
  };

  const handleRemoveFlavorRow = (index: number) => {
    setFlavors((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const totalStock = flavors.reduce((sum, f) => sum + (Number.isFinite(f.stock) ? f.stock : 0), 0);

  // Deixamos a função assíncrona para garantir que só feche depois de salvar!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanFlavors = flavors
      .map((f) => ({ name: f.name.trim(), stock: Math.max(0, f.stock || 0) }))
      .filter((f) => f.name.length > 0);

    if (cleanFlavors.length === 0) {
      alert('Cadastre pelo menos um sabor com nome.');
      return;
    }

    const productData = {
      brand,
      name,
      flavors: cleanFlavors,
      stock: cleanFlavors.reduce((sum, f) => sum + f.stock, 0),
      description,
      category,
      price: parseFloat(price.replace(',', '.')),
      cost: parseFloat(cost.replace(',', '.')),
      emoji,
      gradient,
      image,
    };

    try {
      if (editing) {
        await updateProduct(editing.id, productData);
      } else {
        await addProduct(productData);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[95vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-white shrink-0">
          <h2 className="font-display text-lg font-bold text-ink">
            {editing ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-inkSoft hover:bg-bgAlt hover:text-ink transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* O FORMULÁRIO AGORA ENGLOBA A TELA INTEIRA E OS BOTÕES */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-white space-y-6">
            
            {/* CÂMERA DO CELULAR */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Foto do Produto</label>
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-line bg-bgAlt p-6 transition-colors hover:border-accent">
                {image ? (
                  <div className="relative h-32 w-32 overflow-hidden rounded-xl shadow-md">
                    <img src={image} alt="Preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={() => setImage('')} className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="mb-2 h-8 w-8 text-inkSoft" />
                    <p className="text-sm font-medium text-inkSoft">Nenhuma foto selecionada</p>
                  </div>
                )}

                <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ink/90 active:scale-95">
                  <Camera className="h-4 w-4" />
                  {image ? 'Trocar Foto' : 'Tirar Foto / Galeria'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

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

            {/* SABORES COM ESTOQUE INDIVIDUAL */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wide text-inkSoft">Sabores e Estoque</label>
                <span className="text-xs font-semibold text-inkSoft">Total: {totalStock} un.</span>
              </div>

              <div className="space-y-2">
                {flavors.map((f, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      required
                      value={f.name}
                      onChange={(e) => handleFlavorNameChange(index, e.target.value)}
                      placeholder="Ex: Mango Ice"
                      className="flex-1 rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent"
                    />
                    <input
                      required
                      type="number"
                      min={0}
                      value={f.stock}
                      onChange={(e) => handleFlavorStockChange(index, e.target.value)}
                      placeholder="Qtd."
                      className="w-24 rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFlavorRow(index)}
                      disabled={flavors.length <= 1}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-inkSoft transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddFlavorRow}
                className="mt-2 flex items-center gap-1.5 rounded-xl border border-dashed border-line px-4 py-2 text-xs font-bold text-inkSoft transition hover:border-accent hover:text-accent"
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar Sabor
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Descrição do Produto</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Texto para convencer o cliente a comprar..." className="w-full rounded-xl border border-line bg-bg py-2.5 px-4 text-sm text-ink outline-none focus:border-accent resize-none" />
            </div>

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

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-inkSoft">Emoji (Opcional se tiver foto)</label>
              <input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="w-32 rounded-xl border border-line bg-bg py-2.5 px-4 text-center text-xl outline-none focus:border-accent" />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-inkSoft">Cor de Fundo do Card</label>
              <div className="flex flex-wrap gap-3">
                {GRADIENTS.map((g) => (
                  <button key={g} type="button" onClick={() => setGradient(g)} className={`h-10 w-10 rounded-full bg-gradient-to-br ${g} transition-transform ${gradient === g ? 'scale-110 ring-2 ring-ink ring-offset-2' : 'hover:scale-105'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* BOTÕES DE SALVAR E CANCELAR AGORA ESTÃO AQUI DENTRO DO FORMULÁRIO */}
          <div className="border-t border-line bg-bg px-6 py-4 flex justify-end gap-3 shrink-0">
            <button type="button" onClick={onClose} className="rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-inkSoft hover:bg-bgAlt hover:text-ink transition">
              Cancelar
            </button>
            <button type="submit" className="flex items-center gap-2 rounded-xl bg-ink px-6 py-2.5 text-sm font-bold text-white transition hover:bg-ink/90 active:scale-95 shadow-md">
              <Save className="h-4 w-4" />
              {editing ? 'Salvar Alterações' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
