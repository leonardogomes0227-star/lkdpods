import { ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { formatBRL } from '../utils';
import { useRef, useState } from 'react';
import { useStore } from '../store';

interface Props {
  product: Product;
  onAdd?: (p: Product, qty: number, flavor: string) => void;
}

export function ProductCard({ product }: Props) {
  const { addToCart } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const flavorList =
    product.flavors && product.flavors.length > 0
      ? product.flavors.filter((f) => f.stock > 0).map((f) => f.name)
      : [];
  const displayFlavors = flavorList.length > 0 ? flavorList : ['Padrão'];
  const [selectedFlavor, setSelectedFlavor] = useState<string>(displayFlavors[0] || '');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock === 0) return;

    const success = addToCart(product, 1, selectedFlavor);
    if (success) {
      alert(`"${product.name}" (${selectedFlavor}) adicionado à sacola!`);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    setTilt({ x: (0.5 - py) * 10, y: (px - 0.5) * 10 });
    setGlare({ x: px * 100, y: py * 100, opacity: 0.35 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div style={{ perspective: '900px' }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${
            tilt.x || tilt.y ? -4 : 0
          }px)`,
          transformStyle: 'preserve-3d',
          transition: tilt.x || tilt.y ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        }}
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-[0_25px_45px_-15px_rgba(21,24,27,0.2)]"
      >
        {/* Glare que segue o mouse */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-200"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 140px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.6), transparent 70%)`,
          }}
        />

        <div
          style={{ transform: 'translateZ(25px)' }}
          className={`relative mb-4 flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${product.gradient} transition-transform duration-500 group-hover:scale-[1.02]`}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <span className="text-6xl drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
              {product.emoji}
            </span>
          )}

          {/* Vinheta suave dentro da imagem, dá profundidade sem escurecer o produto */}
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_10px_rgba(0,0,0,0.08)]" />

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

        <div style={{ transform: 'translateZ(15px)' }} className="flex flex-1 flex-col">
          <span className="mb-1 text-xs font-bold uppercase tracking-wider text-inkSoft">
            {product.brand}
          </span>
          <h3 className="font-display text-lg font-bold leading-tight text-ink">{product.name}</h3>

          <div className="mt-3">
            <label className="mb-1 block text-[11px] font-semibold uppercase text-inkSoft">
              Selecione o Sabor:
            </label>
            <select
              value={selectedFlavor}
              onChange={(e) => setSelectedFlavor(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-xl border border-line bg-neutral-50 px-3 py-2 text-xs font-medium text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
            >
              {displayFlavors.map((flav, idx) => (
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
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-bgAlt text-ink shadow-sm transition-all hover:bg-accent hover:text-white active:scale-95 disabled:opacity-50 disabled:hover:bg-bgAlt disabled:hover:text-ink"
            >
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
