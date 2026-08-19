import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { ShoppingBag, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { products, addToCart } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const featuredProduct = products.find((p) => p.featured) || products[0];

  const flavorList = featuredProduct?.flavor
    ? featuredProduct.flavor.split(',').map((f) => f.trim()).filter(Boolean)
    : ['Padrão'];
  const [selectedFlavor, setSelectedFlavor] = useState<string>(flavorList[0] || '');

  // se o produto em destaque mudar (ex: dados chegam depois do carregamento), atualiza o sabor padrão
  useEffect(() => {
    setSelectedFlavor(flavorList[0] || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredProduct?.id]);

  const handleQuickBuy = () => {
    if (!featuredProduct) return;
    const success = addToCart(featuredProduct, 1, selectedFlavor);
    if (success) {
      alert(`"${featuredProduct.name}" (${selectedFlavor}) adicionado à sacola!`);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    // rotação máxima de 10deg, invertida pro efeito seguir o mouse naturalmente
    const rotateY = (px - 0.5) * 20;
    const rotateX = (0.5 - py) * 20;

    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: px * 100, y: py * 100, opacity: 0.5 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare((g) => ({ ...g, opacity: 0 }));
  };

  return (
    <div className="relative mx-4 my-4 overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-[0_20px_60px_-15px_rgba(21,24,27,0.12)] sm:mx-6 sm:p-8 md:p-12">
      {/* Vinheta radial de fundo, sutil, cor accent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_20%_20%,rgba(76,122,63,0.06),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_75%_75%_at_50%_40%,transparent_40%,black_100%)] bg-ink/[0.025]" />

      {/* Blobs decorativos flutuantes */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-accentSoft blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-accent/10 blur-3xl animate-floatSlow" />

      <div className="relative z-10 flex flex-col items-center justify-between gap-10 md:flex-row">
        <div className="max-w-xl animate-fadeUp">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accentSoft px-3 py-1 text-xs font-semibold text-accent shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <Sparkles className="h-3.5 w-3.5" />
            DESTAQUE DA SEMANA
          </div>
          <h1 className="mb-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl md:text-6xl">
            Sua tabacaria com{' '}
            <span className="relative inline-block">
              estilo
              <svg
                className="absolute -bottom-1 left-0 w-full text-accent"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C40 2 160 2 198 9"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>{' '}
            e confiança.
          </h1>
          <p className="mb-6 text-sm font-light leading-relaxed text-inkSoft md:text-lg">
            Os melhores descartáveis, vapes recarregáveis, essências e acessórios das marcas mais
            desejadas. Qualidade garantida e atendimento rápido.
          </p>
        </div>

        {/* Card com tilt 3D real no hover */}
        {featuredProduct && (
          <div style={{ perspective: '1000px' }} className="w-full md:w-80">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${
                  tilt.x || tilt.y ? 1.02 : 1
                })`,
                transformStyle: 'preserve-3d',
                transition: tilt.x || tilt.y ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
              }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-bg p-5 shadow-[0_25px_50px_-12px_rgba(21,24,27,0.18)] sm:p-6"
            >
              {/* Glare que segue o mouse — dá a sensação de superfície 3D real */}
              <div
                className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
                style={{
                  opacity: glare.opacity,
                  background: `radial-gradient(circle 180px at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.55), transparent 70%)`,
                }}
              />

              <div style={{ transform: 'translateZ(30px)' }}>
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <span className="rounded-md border border-accent/20 bg-accentSoft px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-accent">
                      {featuredProduct.brand}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-extrabold text-ink transition-colors sm:text-xl">
                      {featuredProduct.name}
                    </h3>
                    {featuredProduct.flavor && (
                      <p className="mt-1 line-clamp-2 text-xs text-inkSoft">
                        {featuredProduct.flavor}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-gradient-to-r from-accent to-emerald-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-accent/20 animate-pulse">
                    Em Alta
                  </span>
                </div>

                <div
                  style={{ transform: 'translateZ(50px)' }}
                  className="my-4 flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-line bg-white shadow-inner transition-transform duration-300 group-hover:scale-[1.03]"
                >
                  {featuredProduct.image ? (
                    <img
                      src={featuredProduct.image}
                      alt={featuredProduct.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)] sm:text-7xl">
                      {featuredProduct.emoji || '⚡'}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-[11px] font-semibold uppercase text-inkSoft">
                    Selecione o Sabor:
                  </label>
                  <select
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                    className="w-full rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
                  >
                    {flavorList.map((flav, idx) => (
                      <option key={idx} value={flav}>
                        {flav}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3 border-t border-line pt-3 text-center">
                  <div className="rounded-xl border border-line bg-white p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-inkSoft">
                      Preço
                    </p>
                    <p className="mt-0.5 text-sm font-black text-accent sm:text-base">
                      R$ {Number(featuredProduct.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-white p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-inkSoft">
                      Estoque
                    </p>
                    <p className="mt-0.5 text-sm font-extrabold text-ink sm:text-base">
                      {featuredProduct.stock} un.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleQuickBuy}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-accent active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Comprar Agora
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
