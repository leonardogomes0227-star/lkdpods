import type { CartItem, CheckoutInfo, Coupon } from './types';

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function buildWhatsAppMessage(
  cart: CartItem[],
  info: CheckoutInfo,
  coupon: Coupon | null,
  subtotal: number,
  discount: number,
  total: number
): string {
  
  // O seu número oficial do WhatsApp já configurado com DDI (55) e DDD (67)
  const PHONE_NUMBER = "556796422689"; 

  let text = `*NOVO PEDIDO - LKD IMPORTS* 🚀\n\n`;
  
  text += `*🛍️ ITENS DO PEDIDO:*\n`;
  cart.forEach((item) => {
    text += `▪️ ${item.quantity}x ${item.product.brand} ${item.product.name} (${item.selectedFlavor})\n`;
  });
  
  text += `\n*🚚 DADOS DE ENTREGA:*\n`;
  text += `👤 Nome: ${info.name}\n`;
  text += `📱 WhatsApp: ${info.phone}\n`;
  text += `📍 Endereço: ${info.address}, Nº ${info.number}\n`;
  text += `🏘️ Bairro: ${info.district}\n`;
  if (info.reference) text += `📌 Ref: ${info.reference}\n`;
  
  text += `\n*💳 PAGAMENTO E VALORES:*\n`;
  text += `Subtotal: ${formatBRL(subtotal)}\n`;
  
  if (coupon && discount > 0) {
    text += `Cupom (${coupon.code}): -${formatBRL(discount)}\n`;
  }
  
  text += `Taxa de Entrega: ${formatBRL(info.deliveryFee)}\n`;
  text += `*TOTAL A PAGAR: ${formatBRL(total)}*\n\n`;
  
  text += `Forma de Pagamento: ${info.payment}\n`;
  if (info.payment === 'Dinheiro' && info.troco) {
    text += `Troco para: ${info.troco}\n`;
  }
  
  // Transforma o texto para o formato de link do WhatsApp
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${PHONE_NUMBER}?text=${encoded}`;
}
