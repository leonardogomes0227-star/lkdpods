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
