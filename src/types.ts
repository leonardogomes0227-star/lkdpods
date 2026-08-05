export type Category = 'Pods Descartáveis' | 'Vapes Recarregáveis' | 'Essências' | 'Acessórios';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  flavor: string;
  description?: string; // Adicionado para suportar a descrição do painel
  price: number;
  cost: number;
  stock: number;
  views: number;
  emoji: string;
  gradient: string;
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
  selectedFlavor: string; // O carrinho agora sabe qual foi o sabor escolhido
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
}

export interface AdminUser {
  email: string;
  password: string;
}
