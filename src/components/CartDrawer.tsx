import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Tag, Trash2, X, Check } from 'lucide-react';
import { useStore } from '../store';
import { formatBRL } from '../utils';

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onClose, onCheckout }: Props) {
  const {
    cart, subtotal, discount, total, appliedCoupon,
    setQty, removeFromCart, applyCoupon, removeCoupon,
  } = useStore();

  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const handleApply = () => {
    if (!code.trim()) return;
    const res = applyCoupon(code);
    setFeedback(res);
    if (res.ok) setCode('');
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setFeedback(null);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-accent" />
            <h2 className="font-display text-lg font-bold text-ink">Seu Carrinho</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-inkSoft transition-all duration-300 hover:scale-110 hover:bg-bgAlt hover:text-ink active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bgAlt">
                <ShoppingBag className="h-7 w-7 text-inkSoft" />
              </div>
              <p className="text-inkSoft">Seu carrinho está vazio.</p>
              <button
                onClick={onClose}
                className="rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-accent active:scale-95"
              >
                Explorar produtos
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 rounded-xl border border-line bg-white p-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-bgAlt border border-line overflow-hidden">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : (
                      <svg width="20" height="44" viewBox="0 0 64 140" fill="none">
                        <rect x="8" y="4" width="48" height="126" rx="20" stroke="#C9C7C0" strokeWidth="3" />
                        <rect x="20" y="0" width="24" height="14" rx="5" fill="#C9C7C0" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold leading-tight text-ink">
                          {item.product.brand} {item.product.name}
                        </p>
                        <p className="text-xs text-inkSoft">{item.product.flavor}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-inkSoft transition-all duration-300 hover:scale-110 hover:text-red-500 active:scale-95"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 rounded-lg border border-line bg-bgAlt">
                        <button onClick={() => setQty(item.product.id, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center text-inkSoft transition-all duration-200 hover:scale-110 hover:text-ink active:scale-95">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                        <button onClick={() => setQty(item.product.id, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center text-inkSoft transition-all duration-200 hover:scale-110 hover:text-ink active:scale-95">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-display text-sm font-bold text-ink">
                        {formatBRL(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-line px-5 py-4">
            <div className="mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl border border-accent/30 bg-accentSoft px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-sm font-bold text-accent">
                        {appliedCoupon.code} — {appliedCoupon.discountPercent}% OFF
                      </p>
                      <p className="text-xs text-inkSoft">Desconto aplicado</p>
                    </div>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-inkSoft transition-all duration-300 hover:scale-110 hover:text-red-500 active:scale-95">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-inkSoft">
                    <Tag className="h-3.5 w-3.5" /> Possui cupom de desconto?
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                      placeholder="Ex: TABACARIA10"
                      className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5 text-sm uppercase text-ink placeholder-inkSoft outline-none focus:border-accent/50"
                    />
                    <button onClick={handleApply} className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-accent active:scale-95">
                      Aplicar
                    </button>
                  </div>
                  {feedback && !feedback.ok && <p className="mt-1.5 text-xs text-red-500">{feedback.message}</p>}
                </>
              )}
            </div>

            <div className="mb-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-inkSoft">
                <span>Subtotal</span>
                <span>{formatBRL(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Desconto</span>
                  <span>-{formatBRL(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-2 font-display text-lg font-bold text-ink">
                <span>Total</span>
                <span>{formatBRL(total)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full rounded-xl bg-ink py-3.5 text-base font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-accent active:scale-[0.98]"
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
