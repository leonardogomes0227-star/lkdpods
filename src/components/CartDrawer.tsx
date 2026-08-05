import { ShoppingBag, Trash2, X, Plus, Minus } from 'lucide-react';
import { useStore } from '../store';
import { formatBRL } from '../utils';

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, onClose, onCheckout }: Props) {
  const { cart, removeFromCart, setQty, total, subtotal, discount } = useStore();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative flex w-full max-w-md flex-col bg-bg shadow-2xl animate-slide-left">
        <div className="flex items-center justify-between border-b border-line bg-white px-6 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <ShoppingBag className="h-5 w-5 text-accent" />
            Sua Sacola
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-inkSoft transition-colors hover:bg-bgAlt hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-white shadow-sm">
                <ShoppingBag className="h-8 w-8 text-inkSoft" />
              </div>
              <p className="font-display text-lg font-bold text-ink">Sua sacola está vazia</p>
              <p className="mt-1 text-sm text-inkSoft">Adicione alguns produtos para continuar.</p>
              <button onClick={onClose} className="mt-6 rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-ink/90 active:scale-95">
                Explorar Produtos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.selectedFlavor}`} className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.product.gradient} text-3xl`}>
                    {item.product.emoji}
                  </div>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="font-semibold leading-tight text-ink">{item.product.brand} {item.product.name}</p>
                      <p className="mt-1 text-xs text-inkSoft">Sabor: <span className="font-semibold text-accent">{item.selectedFlavor}</span></p>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <p className="font-bold text-ink">{formatBRL(item.product.price)}</p>
                      
                      <div className="flex items-center rounded-lg border border-line bg-bg">
                        <button onClick={() => setQty(item.product.id, item.selectedFlavor, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-l-lg text-inkSoft transition hover:bg-line/50 hover:text-ink">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-ink">{item.quantity}</span>
                        <button onClick={() => setQty(item.product.id, item.selectedFlavor, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-r-lg text-inkSoft transition hover:bg-line/50 hover:text-ink">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={() => removeFromCart(item.product.id, item.selectedFlavor)} className="self-start rounded-lg p-1.5 text-inkSoft transition hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-line bg-white p-6 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
            <div className="space-y-2 text-sm text-inkSoft">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{formatBRL(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span className="font-semibold">- {formatBRL(discount)}</span>
                </div>
              )}
              <div className="mt-3 flex justify-between border-t border-line pt-3 font-display text-lg font-bold text-ink">
                <span>Total</span>
                <span className="text-accent">{formatBRL(total)}</span>
              </div>
            </div>
            <button onClick={onCheckout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-4 text-sm font-bold text-white shadow-lg shadow-ink/20 transition hover:bg-ink/90 active:scale-95">
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
