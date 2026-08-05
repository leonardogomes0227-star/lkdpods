export type Category = 'Pods Descartáveis' | 'Vapes Recarregáveis' | 'Essências' | 'Acessórios';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  flavor: string;
  description?: string;
  price: number;
  cost: number;
  stock: number;
  views: number;
  emoji: string;
  gradient: string;
  image?: string; // <--- AGORA O PRODUTO ACEITA FOTO REAL!
  featured?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFlavor: string;
}

export type PaymentMethod = 'PIX' | 'Cartão' | 'Dinheiro';

export interface CheckoutInfo {
  name: string;
  address: string;
  number: string;
  district: string;
  reference: string;
  payment: PaymentMethod | null;
  troco: string;
  deliveryFee: number;
}

export interface AdminUser {
  email: string;
  password: string;
}
