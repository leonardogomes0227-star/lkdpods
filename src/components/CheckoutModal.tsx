import { useState } from 'react';
import { ArrowRight, Check, Landmark, Banknote, CreditCard, MapPin, Rocket, User, X } from 'lucide-react';
import type { CheckoutInfo, PaymentMethod } from '../types';
import { useStore } from '../store';
import { buildWhatsAppMessage, formatBRL } from '../utils';

interface Props {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}

const PAYMENTS: { key: PaymentMethod; label: string; icon: typeof Landmark }[] = [
  { key: 'PIX', label: 'PIX', icon: Landmark },
  { key: 'Cartão', label: 'Cartão', icon: CreditCard },
  { key: 'Dinheiro', label: 'Dinheiro', icon: Banknote },
];

export function CheckoutModal({ open, onClose, onDone }: Props) {
  const { cart, subtotal, discount, total, appliedCoupon, clearCart } = useStore();
  const [info, setInfo] = useState<CheckoutInfo>({
    name: '',
    address: '',
    number: '',
    district: '',
    reference: '',
    payment: null,
    troco: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!info.name.trim()) e.name = 'Informe seu nome.';
    if (!info.address.trim()) e.address = 'Informe a rua.';
    if (!info.number.trim()) e.number = 'Informe o número.';
    if (!info.district.trim()) e.district = 'Informe o bairro.';
    if (!info.payment) e.payment = 'Escolha a forma de pagamento.';
    if (info.payment === 'Dinheiro' && info.troco && !info.troco.trim())
      e.troco = 'Informe o valor do troco.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const url = buildWhatsAppMessage(
      cart,
      info,
      appliedCoupon,
      subtotal,
      discount,
      total,
    );
    window.open(url, '_blank');
    setSent(true);
  };

  const handleClose = () => {
    if (sent) {
      clearCart();
      setInfo({
        name: '',
        address: '',
        number: '',
        district: '',
        reference: '',
        payment: null,
        troco: '',
      });
      setSent(false);
      onDone();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-ink-700 bg-ink-900 shadow-2xl animate-slide-up sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-700 px-5 py-4">
          <h2 className="font-display text-lg font-bold text-white">
            {sent ? 'Pedido Enviado' : 'Finalizar Pedido'}
          </h2>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-all duration-300 hover:scale-110 hover:bg-ink-800 hover:text-white active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neon-500/20">
              <Check className="h-8 w-8 text-neon-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              Pedido enviado ao WhatsApp!
            </h3>
            <p className="max-w-sm text-sm text-white/60">
              Abrimos o WhatsApp da loja com seu pedido já formatado. É só enviar a mensagem e
              nosso atendente confirma a entrega em minutos.
            </p>
            <button
              onClick={handleClose}
              className="shimmer-sweep mt-2 rounded-xl bg-neon-500 px-6 py-3 text-sm font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-neon-400 active:scale-95"
            >
              Continuar
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {/* Local delivery notice */}
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-electric-500/30 bg-electric-500/10 px-3.5 py-3">
              <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-electric-400" />
              <p className="text-xs text-electric-100">
                <strong className="text-electric-300">Entrega rápida e exclusiva para nossa cidade</strong>{' '}
                (consulte taxa local se houver). Não atendemos outras localidades.
              </p>
            </div>

            {/* Name */}
            <Field label="Nome Completo" icon={<User className="h-3.5 w-3.5" />} error={errors.name}>
              <input
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                placeholder="Seu nome completo"
                className={inputCls(errors.name)}
              />
            </Field>

            {/* Address */}
            <div className="mb-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/60">
                <MapPin className="h-3.5 w-3.5" /> Endereço Completo
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <input
                    value={info.address}
                    onChange={(e) => setInfo({ ...info, address: e.target.value })}
                    placeholder="Rua"
                    className={inputCls(errors.address)}
                  />
                  {errors.address && <p className="mt-1 text-xs text-danger">{errors.address}</p>}
                </div>
                <input
                  value={info.number}
                  onChange={(e) => setInfo({ ...info, number: e.target.value })}
                  placeholder="Nº"
                  className={inputCls(errors.number)}
                />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <input
                    value={info.district}
                    onChange={(e) => setInfo({ ...info, district: e.target.value })}
                    placeholder="Bairro"
                    className={inputCls(errors.district)}
                  />
                  {errors.district && <p className="mt-1 text-xs text-danger">{errors.district}</p>}
                </div>
                <input
                  value={info.reference}
                  onChange={(e) => setInfo({ ...info, reference: e.target.value })}
                  placeholder="Ponto de referência"
                  className={inputCls()}
                />
              </div>
            </div>

            {/* Payment */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                Forma de Pagamento
              </p>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENTS.map((p) => {
                  const active = info.payment === p.key;
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setInfo({ ...info, payment: p.key })}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 ${
                        active
                          ? 'border-neon-500 bg-neon-500/15 text-neon-300'
                          : 'border-ink-700 bg-ink-850 text-white/70 hover:border-neon-500/40'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {p.label}
                    </button>
                  );
                })}
              </div>
              {errors.payment && <p className="mt-1 text-xs text-danger">{errors.payment}</p>}
            </div>

            {/* Troco conditional */}
            {info.payment === 'Dinheiro' && (
              <div className="mb-4 animate-slide-up">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                  Precisa de troco? Para quanto?
                </p>
                <input
                  value={info.troco}
                  onChange={(e) => setInfo({ ...info, troco: e.target.value })}
                  placeholder="Ex: R$ 100,00 (deixe vazio se não precisar)"
                  className={inputCls()}
                />
              </div>
            )}

            {/* Order summary */}
            <div className="rounded-xl border border-ink-700 bg-ink-850 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/60">
                Resumo do Pedido
              </p>
              <div className="space-y-1.5 text-sm">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-white/70">
                    <span className="truncate pr-2">
                      {item.quantity}x {item.product.brand} {item.product.name}
                    </span>
                    <span className="shrink-0">{formatBRL(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-ink-700 pt-2 text-white/60">
                  <span>Subtotal</span>
                  <span>{formatBRL(subtotal)}</span>
                </div>
                {appliedCoupon && discount > 0 && (
                  <div className="flex justify-between text-neon-400">
                    <span>Cupom {appliedCoupon.code} ({appliedCoupon.discountPercent}%)</span>
                    <span>-{formatBRL(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-lg font-bold text-white">
                  <span>Total</span>
                  <span>{formatBRL(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="shimmer-sweep mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-neon-500 py-3.5 text-base font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:bg-neon-400 active:scale-[0.98]"
            >
              Enviar Pedido via WhatsApp
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function inputCls(error?: string): string {
  return `w-full rounded-xl border bg-ink-850 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-neon-500/50 focus:ring-1 focus:ring-neon-500/30 ${
    error ? 'border-danger/50' : 'border-ink-700'
  }`;
}

function Field({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/60">
        {icon} {label}
      </p>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
