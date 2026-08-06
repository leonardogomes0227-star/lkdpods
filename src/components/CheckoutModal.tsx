import { useState } from 'react';
import { X, MapPin, User, CreditCard, MessageCircle } from 'lucide-react';
import { useStore } from '../store';
import { formatBRL, buildWhatsAppMessage } from '../utils';
import { trackFunnelEvent } from '../funnelTracker';

export interface CheckoutInfo {
  name: string;
  phone: string;
  address: string;
  number: string;
  district: string;
  reference?: string;
  deliveryFee: number;
  payment: 'Pix' | 'Cartão' | 'Dinheiro';
  troco?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  deliveryFee: number;
}

const emptyInfo: CheckoutInfo = {
  name: '',
  phone: '',
  address: '',
  number: '',
  district: '',
  reference: '',
  deliveryFee: 0,
  payment: 'Pix',
  troco: '',
};

export function CheckoutModal({ isOpen, onClose, deliveryFee }: Props) {
  const cart = useStore((s) => s.cart);
  const subtotal = useStore((s) => s.subtotal);
  const discount = useStore((s) => s.discount);
  const appliedCoupon = useStore((s) => s.appliedCoupon);
  const recordSale = useStore((s) => s.recordSale);
  const clearCart = useStore((s) => s.clearCart);

  const [info, setInfo] = useState<CheckoutInfo>({ ...emptyInfo, deliveryFee });
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const total = subtotal - discount + info.deliveryFee;
  const isValid = info.name.trim() && info.phone.trim() && info.address.trim() && info.district.trim();

  const handleField = (field: keyof CheckoutInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinish = async () => {
    if (!isValid) {
      alert('Preencha nome, telefone, endereço e bairro pra continuar.');
      return;
    }
    if (sending) return;
    setSending(true);

    try {
      // Salva o pedido de verdade: cria order + order_items no Supabase,
      // baixa o estoque do sabor vendido e atualiza o cadastro do cliente.
      await recordSale(total, { name: info.name, phone: info.phone });

      // FUNIL — etapa 3: cliente foi direcionado ao WhatsApp
      cart.forEach((item) => {
        trackFunnelEvent('whatsapp', item.product.id, item.product.name, item.quantity);
      });

      // FUNIL — etapa 4: consideramos "compra concluída" no momento do envio.
      // Se preferir só confirmar quando o pagamento cair de fato, mova esta
      // chamada pra um botão manual no painel admin (ex: "Marcar como pago").
      cart.forEach((item) => {
        trackFunnelEvent('purchase', item.product.id, item.product.name, item.quantity);
      });

      const link = buildWhatsAppMessage(cart, info, appliedCoupon, subtotal, discount, total);
      window.open(link, '_blank');

      clearCart();
      onClose();
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      alert('Deu um erro ao registrar o pedido. Tenta de novo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative flex w-full max-w-lg max-h-[90vh] flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="font-display text-xl font-bold text-ink">Finalizar Pedido</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-bgAlt text-inkSoft transition hover:bg-line"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <div className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-inkSoft">
              <User className="h-4 w-4" /> Seus Dados
            </div>
            <div className="space-y-3">
              <input
                className="w-full rounded-xl border border-line px-4 py-3 text-sm"
                placeholder="Nome completo"
                value={info.name}
                onChange={(e) => handleField('name', e.target.value)}
              />
              <input
                className="w-full rounded-xl border border-line px-4 py-3 text-sm"
                placeholder="WhatsApp (com DDD)"
                value={info.phone}
                onChange={(e) => handleField('phone', e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-inkSoft">
              <MapPin className="h-4 w-4" /> Entrega
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-xl border border-line px-4 py-3 text-sm"
                  placeholder="Endereço"
                  value={info.address}
                  onChange={(e) => handleField('address', e.target.value)}
                />
                <input
                  className="w-24 rounded-xl border border-line px-4 py-3 text-sm"
                  placeholder="Nº"
                  value={info.number}
                  onChange={(e) => handleField('number', e.target.value)}
                />
              </div>
              <input
                className="w-full rounded-xl border border-line px-4 py-3 text-sm"
                placeholder="Bairro"
                value={info.district}
                onChange={(e) => handleField('district', e.target.value)}
              />
              <input
                className="w-full rounded-xl border border-line px-4 py-3 text-sm"
                placeholder="Ponto de referência (opcional)"
                value={info.reference}
                onChange={(e) => handleField('reference', e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-inkSoft">
              <CreditCard className="h-4 w-4" /> Pagamento
            </div>
            <div className="flex gap-2">
              {(['Pix', 'Cartão', 'Dinheiro'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => handleField('payment', method)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                    info.payment === method
                      ? 'border-accent bg-accent text-white'
                      : 'border-line bg-bg text-ink'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
            {info.payment === 'Dinheiro' && (
              <input
                className="mt-3 w-full rounded-xl border border-line px-4 py-3 text-sm"
                placeholder="Troco para quanto?"
                value={info.troco}
                onChange={(e) => handleField('troco', e.target.value)}
              />
            )}
          </div>

          <div className="border-t border-line pt-4 space-y-1 text-sm">
            <div className="flex justify-between text-inkSoft">
              <span>Subtotal</span>
              <span>{formatBRL(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-accent">
                <span>Cupom {appliedCoupon?.code ? `(${appliedCoupon.code})` : ''}</span>
                <span>-{formatBRL(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-inkSoft">
              <span>Entrega</span>
              <span>{formatBRL(info.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-ink pt-2">
              <span>Total</span>
              <span>{formatBRL(total)}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-line bg-bg p-4 sm:p-6">
          <button
            onClick={handleFinish}
            disabled={!isValid || sending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
          >
            <MessageCircle className="h-4 w-4" />
            {sending ? 'Enviando...' : 'Enviar Pedido pelo WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  );
}
