export type Category =
  | 'Pods Descartáveis'
  | 'Vapes Recarregáveis'
  | 'Essências'
  | 'Acessórios';

export interface FlavorStock {
  name: string;
  stock: number;
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
