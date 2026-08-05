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
      {/* Fundo escurecido e desfocado */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in transition-opacity"
        onClick={handleClose}
      />
      
      {/* Container Principal Claro */}
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-line bg-white shadow-2xl animate-slide-up sm:rounded-3xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-white">
          <h2 className="font-display text-lg font-bold text-ink">
            {sent ? 'Pedido Enviado' : 'Finalizar Pedido'}
          </h2>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-inkSoft transition-all duration-300 hover:scale-110 hover:bg-bgAlt hover:text-ink active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 px-6 py-12 text-center bg-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accentSoft">
              <Check className="h-8 w-8 text-accent" />
            </div>
            <h3 className="font-display text-xl font-bold text-ink">
              Pedido enviado ao WhatsApp!
            </h3>
            <p className="max-w-sm text-sm text-inkSoft">
              Abrimos o WhatsApp da loja com seu pedido já formatado. É só enviar a mensagem e
              nosso atendente confirma a entrega em minutos.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 rounded-xl bg-ink px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-ink/90 active:scale-95 shadow-md"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-5 bg-white">
            
            {/* Aviso de Entrega Local */}
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-3">
              <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <p className="text-xs text-blue-800">
                <strong className="text-blue-900">Entrega rápida e exclusiva para nossa cidade</strong>{' '}
                (consulte taxa local se houver). Não atendemos outras localidades.
              </p>
            </div>

            {/* Nome */}
            <Field label="Nome Completo" icon={<User className="h-3.5 w-3.5" />} error={errors.name}>
              <input
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
                placeholder="Seu nome completo"
                className={inputCls(errors.name)}
              />
            </Field>

            {/* Endereço */}
            <div className="mb-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-inkSoft">
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
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
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
                  {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
                </div>
                <input
                  value={info.reference}
                  onChange={(e) => setInfo({ ...info, reference: e.target.value })}
                  placeholder="Ponto de referência"
                  className={inputCls()}
                />
              </div>
            </div>

            {/* Pagamento */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-inkSoft">
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
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                        active
                          ? 'border-accent bg-accent text-white shadow-md'
                          : 'border-line bg-white text-ink hover:border-accent/40 hover:bg-bgAlt'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {p.label}
                    </button>
                  );
                })}
              </div>
              {errors.payment && <p className="mt-1 text-xs text-red-500">{errors.payment}</p>}
            </div>

            {/* Troco */}
            {info.payment === 'Dinheiro' && (
              <div className="mb-4 animate-slide-up">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-inkSoft">
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

            {/* Resumo do Pedido */}
            <div className="rounded-xl border border-line bg-bg p-4 mt-2">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-inkSoft">
                Resumo do Pedido
              </p>
              <div className="space-y-2 text-sm">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedFlavor}`} className="flex justify-between items-start text-ink">
                    <div className="pr-2">
                      <span className="font-semibold block">
                        {item.quantity}x {item.product.brand} {item.product.name}
                      </span>
                      {/* Aqui mostramos o sabor escolhido! */}
                      <span className="text-xs text-inkSoft">Sabor: {item.selectedFlavor}</span>
                    </div>
                    <span className="shrink-0 font-medium">{formatBRL(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between border-t border-line pt-3 text-inkSoft">
                  <span>Subtotal</span>
                  <span className="font-medium text-ink">{formatBRL(subtotal)}</span>
                </div>
                {appliedCoupon && discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Cupom {appliedCoupon.code} ({appliedCoupon.discountPercent}%)</span>
                    <span>-{formatBRL(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-display text-lg font-bold text-ink pt-1">
                  <span>Total</span>
                  <span className="text-accent">{formatBRL(total)}</span>
                </div>
              </div>
            </div>

            {/* Botão Enviar */}
            <button
              onClick={handleSubmit}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-4 text-base font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-ink/90 active:scale-95 shadow-xl shadow-ink/10"
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

// Função de estilo dos inputs atualizada para o tema claro
function inputCls(error?: string): string {
  return `w-full rounded-xl border bg-bg px-4 py-3 text-sm text-ink placeholder-inkSoft/50 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent ${
    error ? 'border-red-500' : 'border-line'
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
      <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-inkSoft">
        {icon} {label}
      </p>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
