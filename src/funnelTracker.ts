// Rastreamento do Funil de Conversão:
// visualização -> clique em comprar -> conversa no WhatsApp -> compra concluída
//
// Por enquanto salva localmente (localStorage). Quando você tiver um backend,
// troque o bloco marcado abaixo por uma chamada de API (fetch/axios) pra
// persistir os eventos no banco e poder consultar de qualquer dispositivo.

export type FunnelStep = 'view' | 'click_buy' | 'whatsapp' | 'purchase';

export interface FunnelEvent {
  step: FunnelStep;
  productId: string;
  productName: string;
  quantity?: number;
  timestamp: number;
}

const STORAGE_KEY = 'funnel_events';

function readEvents(): FunnelEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function trackFunnelEvent(
  step: FunnelStep,
  productId: string,
  productName: string,
  quantity?: number
) {
  const event: FunnelEvent = {
    step,
    productId,
    productName,
    quantity,
    timestamp: Date.now(),
  };

  try {
    const events = readEvents();
    events.push(event);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Erro ao registrar evento do funil:', err);
  }

  // TODO: quando tiver backend, troque por:
  // fetch('/api/funnel', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(event),
  // });
}

// Resumo simples: quantos eventos de cada etapa aconteceram
export function getFunnelSummary(): Record<FunnelStep, number> {
  const events = readEvents();
  const counts: Record<FunnelStep, number> = {
    view: 0,
    click_buy: 0,
    whatsapp: 0,
    purchase: 0,
  };
  events.forEach((e) => {
    counts[e.step] = (counts[e.step] ?? 0) + 1;
  });
  return counts;
}

// Taxas de conversão entre etapas (em %)
export function getFunnelConversionRates() {
  const c = getFunnelSummary();
  const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);

  return {
    viewToClick: pct(c.click_buy, c.view),
    clickToWhatsapp: pct(c.whatsapp, c.click_buy),
    whatsappToPurchase: pct(c.purchase, c.whatsapp),
    viewToPurchase: pct(c.purchase, c.view),
    raw: c,
  };
}
