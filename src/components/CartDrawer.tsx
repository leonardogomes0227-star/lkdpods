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
    cart,
    subtotal,
    discount,
    total,
    appliedCoupon,
    setQty,
    removeFromCart,
    applyCoupon,
    removeCoupon,
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
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-ink-700/60 bg-ink-900/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-neon-400" />
            <h2 className="font-display text-lg font-bold text-white">Seu Carrinho</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-all duration-300 hover:scale-110 hover:bg-ink-800 hover:text-white active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-800">
                <ShoppingBag className="h-7 w-7 text-white/30" />
              </div>
              <p className="text-white/50">Seu carrinho está vazio.</p>
              <button
                onClick={onClose}
                className="shimmer-sweep rounded-xl bg-neon-500 px-5 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-neon-400 active:scale-95"
              >
                Explorar produtos
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 rounded-xl border border-ink-700 bg-ink-850 p-3"
                >
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.product.gradient} text-3xl`}
                  >
                    {item.product.emoji}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold leading-tight text-white">
                          {item.product.brand} {item.product.name}
                        </p>
                        <p className="text-xs text-white/50">{item.product.flavor}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-white/30 transition-all duration-300 hover:scale-110 hover:text-danger active:scale-95"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-900">
                        <button
                          onClick={() => setQty(item.product.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-white/60 transition-all duration-200 hover:scale-110 hover:text-white active:scale-95"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQty(item.product.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-white/60 transition-all duration-200 hover:scale-110 hover:text-white active:scale-95"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-display text-sm font-bold text-neon-400">
                        {formatBRL(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: coupon + totals + checkout */}
        {cart.length > 0 && (
          <div className="border-t border-ink-700 px-5 py-4">
            {/* Coupon */}
            <div className="mb-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-xl border border-neon-500/40 bg-neon-500/10 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-neon-400" />
                    <div>
                      <p className="text-sm font-bold text-neon-300">
                        {appliedCoupon.code} — {appliedCoupon.discountPercent}% OFF
                      </p>
                      <p className="text-xs text-white/50">Desconto aplicado</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-white/40 transition-all duration-300 hover:scale-110 hover:text-danger active:scale-95"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/60">
                    <Tag className="h-3.5 w-3.5" /> Possui cupom de desconto?
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                      placeholder="Ex: TABACARIA10"
                      className="flex-1 rounded-xl border border-ink-700 bg-ink-850 px-3 py-2.5 text-sm uppercase text-white placeholder-white/30 outline-none focus:border-neon-500/50"
                    />
                    <button
                      onClick={handleApply}
                      className="rounded-xl bg-ink-700 px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-ink-600 active:scale-95"
                    >
                      Aplicar
                    </button>
                  </div>
                  {feedback && !feedback.ok && (
                    <p className="mt-1.5 text-xs text-danger">{feedback.message}</p>
                  )}
                </>
              )}
            </div>

            {/* Totals */}
            <div className="mb-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span>{formatBRL(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-neon-400">
                  <span>Desconto</span>
                  <span>-{formatBRL(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-ink-700 pt-2 font-display text-lg font-bold text-white">
                <span>Total</span>
                <span>{formatBRL(total)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="shimmer-sweep w-full rounded-xl bg-neon-500 py-3.5 text-base font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-neon-400 active:scale-[0.98]"
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
