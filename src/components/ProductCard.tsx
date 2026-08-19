import { ShoppingBag, Box } from 'lucide-react';
import type { Product } from '../types';
import { formatBRL } from '../utils';
import { useState } from 'react';
import { useStore } from '../store';

interface Props {
  product: Product;
  onAdd?: (p: Product, qty: number, flavor: string) => void;
}

export function ProductCard({ product }: Props) {
  const { addToCart } = useStore();
  
  // Divide os sabores separados por vírgula para montar as opções
  const flavorList = product.flavor ? product.flavor.split(',').map((f) => f.trim()).filter(Boolean) : ['Padrão'];
  const [selectedFlavor, setSelectedFlavor] = useState<string>(flavorList[0] || '');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita conflito com o clique do card geral
    if (product.stock === 0) return;
    
    const success = addToCart(product, 1, selectedFlavor);
    if (success) {
      alert(`"${product.name}" (${selectedFlavor}) adicionado à sacola!`);
    }
  };

  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Estilos do elemento 3D flutuante — escopado por classe única */}
      <style>{`
        @keyframes floatSpin3d {
          0% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
          50% { transform: translateY(-6px) rotateX(180deg) rotateY(160deg); }
          100% { transform: translateY(0px) rotateX(360deg) rotateY(360deg); }
        }
        .card-3d-perspective {
          perspective: 600px;
        }
        .card-3d-icon {
          transform-style: preserve-3d;
          animation: floatSpin3d 6s ease-in-out infinite;
          transition: animation-duration 0.3s;
        }
        .group:hover .card-3d-icon {
          animation-duration: 2.5s;
        }
        @media (prefers-reduced-motion: reduce) {
          .card-3d-icon {
            animation: none;
          }
        }
      `}</style>

      {/* Imagem Real ou Gradient com Emoji */}
      <div className={`relative mb-4 flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br ${product.gradient} overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]`}>
        
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <span className="text-6xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
            {product.emoji}
          </span>
        )}

        {/* Elemento 3D flutuante decorativo */}
        <div className="card-3d-perspective pointer-events-none absolute bottom-3 right-3 h-9 w-9">
          <div className="card-3d-icon flex h-9 w-9 items-center justify-center rounded-lg bg-white/25 text-white shadow-lg backdrop-blur-sm ring-1 ring-white/40">
            <Box className="h-4 w-4 drop-shadow" strokeWidth={2.2} />
          </div>
        </div>
        
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase text-red-600 shadow-sm">
            Últimas un.
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase text-gray-500 shadow-sm">
            Esgotado
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <span className="mb-1 text-xs font-bold uppercase tracking-wider text-inkSoft">{product.brand}</span>
        <h3 className="font-display text-lg font-bold leading-tight text-ink">{product.name}</h3>
        
        {/* Seletor de Sabores */}
        <div className="mt-3">
          <label className="block text-[11px] font-semibold text-inkSoft uppercase mb-1">
            Selecione o Sabor:
          </label>
          <select
            value={selectedFlavor}
            onChange={(e) => setSelectedFlavor(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-xl border border-line bg-neutral-50 py-2 px-3 text-xs text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/30 font-medium"
          >
            {flavorList.map((flav, idx) => (
              <option key={idx} value={flav}>
                {flav}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <span className="text-xl font-bold text-accent">{formatBRL(product.price)}</span>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            title={product.stock === 0 ? 'Produto Esgotado' : 'Adicionar à Sacola'}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-bgAlt text-ink transition-colors hover:bg-accent hover:text-white disabled:opacity-50 disabled:hover:bg-bgAlt disabled:hover:text-ink shadow-sm active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
