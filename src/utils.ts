import type { CartItem, CheckoutInfo, Coupon } from './types';
import { STORE_CITY, STORE_WHATSAPP } from './storage';

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function buildWhatsAppMessage(
  items: CartItem[],
  info: CheckoutInfo,
  coupon: Coupon | null,
  subtotal: number,
  discount: number,
  total: number,
): string {
  const lines: string[] = [];
  lines.push('*🛒 NOVO PEDIDO — LKD IMPORTS*');
  lines.push('');
  lines.push('*ITENS DO PEDIDO*');
  items.forEach((item, i) => {
    lines.push(
      `${i + 1}. ${item.product.brand} ${item.product.name} — ${item.product.flavor}`,
    );
    lines.push(
      `   ${item.quantity}x ${formatBRL(item.product.price)} = *${formatBRL(item.product.price * item.quantity)}*`,
    );
  });
  lines.push('');
  lines.push(`Subtotal: ${formatBRL(subtotal)}`);
  if (coupon && discount > 0) {
    lines.push(`Cupom aplicado: *${coupon.code}* (${coupon.discountPercent}% OFF)`);
    lines.push(`Desconto: -${formatBRL(discount)}`);
  }
  lines.push(`*TOTAL: ${formatBRL(total)}*`);
  lines.push('');
  lines.push('*DADOS DO CLIENTE*');
  lines.push(`Nome: ${info.name}`);
  lines.push(
    `Endereço: ${info.address}, ${info.number} — ${info.district}`,
  );
  if (info.reference) lines.push(`Referência: ${info.reference}`);
  lines.push('');
  lines.push('*PAGAMENTO*');
  lines.push(`Forma: ${info.payment}`);
  if (info.payment === 'Dinheiro' && info.troco) {
    lines.push(`Troco para: ${info.troco}`);
  }
  lines.push('');
  lines.push(`🚀 Entrega rápida e exclusiva para ${STORE_CITY}.`);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${STORE_WHATSAPP}?text=${text}`;
}
