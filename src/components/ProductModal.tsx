import { useState, useEffect } from 'react';
import { X, ShoppingBag, FileText, Droplets, Minus, Plus } from 'lucide-react';
import type { Product } from '../types';
import { formatBRL } from '../utils';

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedFlavor: string, quantity: number) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: Props) {
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Valores simulados para o Modal. 
  // O ideal é adicionar 'description' e 'flavors' (array) no seu arquivo types.ts futuramente.
  const mockFlavors = product?.flavor 
    ? [product.flavor, 'Mint Ice', 'Strawberry Kiwi', 'Blue Razz'] 
    : ['Padrão'];
    
  const mockDescription = 'Experimente o máximo de sabor e praticidade com este pod descartável. Design premium, bateria de longa duração e essências exclusivas que garantem uma experiência suave e satisfatória do primeiro ao último puff.';

  useEffect(() => {
    if (product) {
      setSelectedFlavor(product.flavor || mockFlavors[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedFlavor, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
      {/* Fundo escurecido com desfoque */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Container do Modal */}
      <div className="relative flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl animate-slide-up">
        
        {/* Cabeçalho Visual (Imagem/Emoji) */}
        <div className={`relative flex h-48 sm:h-56 w-full items-center justify-center bg-gradient-to-br ${product.gradient}`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-white backdrop-blur-md transition hover:bg-black/30"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="text-7xl drop-shadow-lg transition-transform duration-500 hover:scale-110">
            {product.emoji}
          </span>
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-inkSoft">{product.brand}</p>
            <span className="rounded-full bg-accentSoft px-2.5 py-0.5 text-[10px] font-bold uppercase text-accent">
              Em Estoque
            </span>
          </div>
          
          <h2 className="font-display text-2xl font-bold text-ink">{product.name}</h2>
          <p className="mt-2 text-2xl font-bold text-accent">{formatBRL(product.price)}</p>

          {/* Seção de Descrição */}
          <div className="mt-6">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-inkSoft">
              <FileText className="h-4 w-4" /> Descrição
            </div>
            <p className="text-sm leading-relaxed text-ink/70">
              {mockDescription}
            </p>
          </div>

          {/* Seletor de Sabores */}
          <div className="mt-6 border-t border-line pt-6">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-inkSoft">
              <Droplets className="h-4 w-4" /> Escolha o Sabor
            </div>
            <div className="flex flex-wrap gap-2">
              {mockFlavors.map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => setSelectedFlavor(flavor)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                    selectedFlavor === flavor
                      ? 'border-accent bg-accent text-white shadow-md'
                      : 'border-line bg-bg text-ink hover:border-accent/50'
                  }`}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé de Ação (Quantidade e Botão Comprar) */}
        <div className="border-t border-line bg-bg p-4 sm:p-6 flex items-center gap-4">
          <div className="flex h-12 items-center rounded-xl border border-line bg-white">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-full w-10 items-center justify-center text-inkSoft transition hover:text-ink disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-ink">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-full w-10 items-center justify-center text-inkSoft transition hover:text-ink"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-ink px-4 text-sm font-bold text-white transition-all hover:bg-ink/90 hover:shadow-lg active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            Adicionar à Sacola
          </button>
        </div>
      </div>
    </div>
  );
}
