export type Category =
  | 'Pods Descartáveis'
  | 'Vapes Recarregáveis'
  | 'Essências'
  | 'Acessórios';

export interface FlavorStock {
  name: string;
  stock: number;
  lastSoldAt?: number; // timestamp da última venda desse sabor (Controle Inteligente de Estoque)
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  flavors: FlavorStock[];
  description?: string;
  category: Category;
  price: number;
  cost: number;
  stock: number; // total (soma de todos os sabores) — calculado automaticamente
  emoji: string;
  gradient: string;
  image?: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFlavor: string;
}

export interface Sale {
  id: string;
  amount: number;
  timestamp: number;
}

// ===== Cadastro Inteligente de Clientes =====
export interface Customer {
  id: string; // usamos o telefone como id local
  phone: string;
  name: string;
  firstPurchase: number;
  lastPurchase: number;
  purchaseCount: number;
  totalSpent: number;
}

// ===== Histórico de Compras =====
export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  brand: string;
  flavor: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
}

export interface Order {
  id: string;
  customerPhone?: string;
  customerName?: string;
  timestamp: number;
  totalAmount: number;
  totalCost: number;
  profit: number;
  items: OrderItem[];
}

// Limite abaixo do qual um sabor é considerado "estoque baixo"
export const LOW_STOCK_THRESHOLD = 5;

// Quantos dias sem vender já acendem o alerta de "parado"
export const DAYS_WITHOUT_SALE_ALERT = 15;

// Retorna quantos dias se passaram desde a última venda de um sabor (null = nunca vendeu)
export function daysWithoutSelling(flavor: FlavorStock): number | null {
  if (!flavor.lastSoldAt) return null;
  const diffMs = Date.now() - flavor.lastSoldAt;
  return Math.floor(diffMs / (24 * 60 * 60 * 1000));
}

export function isLowStock(flavor: FlavorStock, threshold: number = LOW_STOCK_THRESHOLD): boolean {
  return flavor.stock <= threshold;
}
