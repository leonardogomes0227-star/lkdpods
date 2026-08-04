import type { Product, Coupon } from './types';

const PRODUCTS_KEY = 'lkd_products_v1';
const COUPONS_KEY = 'lkd_coupons_v1';
const CART_KEY = 'lkd_cart_v1';
const AUTH_KEY = 'lkd_admin_auth_v1';
const FLASH_KEY = 'lkd_flash_deadline_v1';

export const ADMIN_CREDENTIALS = {
  email: 'admin@lkdimports.com',
  password: 'admin123',
};

export const STORE_WHATSAPP = '5567999999999';
export const STORE_CITY = 'nossa cidade';

const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Ignite V15',
    brand: 'Ignite',
    category: 'Pods Descartáveis',
    flavor: 'Mango Ice',
    description: '1500 puffs, bateria recarregável, sabor tropical intenso com final gelado.',
    price: 49.9,
    cost: 28,
    stock: 24,
    views: 12,
    emoji: '🥭',
    gradient: 'from-amber-500/20 to-orange-600/10',
    featured: true,
  },
  {
    id: 'p2',
    name: 'Elf Bar BC5000',
    brand: 'Elf Bar',
    category: 'Pods Descartáveis',
    flavor: 'Watermelon Bubblegum',
    description: '5000 puffs, display de bateria, melancia com toque de chiclete.',
    price: 89.9,
    cost: 52,
    stock: 4,
    views: 7,
    emoji: '🍉',
    gradient: 'from-pink-500/20 to-rose-600/10',
    featured: true,
  },
  {
    id: 'p3',
    name: 'Lost Mary BM600',
    brand: 'Lost Mary',
    category: 'Pods Descartáveis',
    flavor: 'Triple Mango',
    description: '600 puffs compacto, manga pura sem adições. Tamanho de bolso.',
    price: 39.9,
    cost: 22,
    stock: 15,
    views: 4,
    emoji: '🥭',
    gradient: 'from-yellow-500/20 to-amber-600/10',
  },
  {
    id: 'p4',
    name: 'HQD Cuvie Plus',
    brand: 'HQD',
    category: 'Pods Descartáveis',
    flavor: 'Grapey',
    description: '1200 puffs, uva doce com leve azedinho. Acabamento premium.',
    price: 44.9,
    cost: 25,
    stock: 2,
    views: 9,
    emoji: '🍇',
    gradient: 'from-violet-500/20 to-purple-600/10',
  },
  {
    id: 'p5',
    name: 'Voopoo Drag X2',
    brand: 'Voopoo',
    category: 'Vapes Recarregáveis',
    flavor: 'Kit Completo',
    description: 'Mod 80W com tanque PnP, ideal para essências. Bateria dupla 18650.',
    price: 289.9,
    cost: 190,
    stock: 6,
    views: 3,
    emoji: '⚙️',
    gradient: 'from-slate-500/20 to-zinc-600/10',
    featured: true,
  },
  {
    id: 'p6',
    name: 'OXVA Xlim Pro',
    brand: 'OXVA',
    category: 'Vapes Recarregáveis',
    flavor: 'Pod System',
    description: 'Pod compacto com ajuste de potência, bateria 1000mAh, display OLED.',
    price: 199.9,
    cost: 130,
    stock: 9,
    views: 5,
    emoji: '🔋',
    gradient: 'from-cyan-500/20 to-blue-600/10',
  },
  {
    id: 'p7',
    name: 'Naked 100',
    brand: 'Naked 100',
    category: 'Essências',
    flavor: 'Lava Flow',
    description: '30ml, morango com abacaxi e coco. Sabor de praia em cada drag.',
    price: 59.9,
    cost: 35,
    stock: 18,
    views: 6,
    emoji: '🍓',
    gradient: 'from-red-500/20 to-rose-600/10',
  },
  {
    id: 'p8',
    name: 'Ice Lush',
    brand: 'Ice Lush',
    category: 'Essências',
    flavor: 'Blueberry Ice',
    description: '60ml, mirtilo gelado com toque cremoso. Alta produção de vapor.',
    price: 64.9,
    cost: 38,
    stock: 3,
    views: 8,
    emoji: '🫐',
    gradient: 'from-blue-500/20 to-indigo-600/10',
  },
  {
    id: 'p9',
    name: 'Coil Mesh PnP',
    brand: 'Voopoo',
    category: 'Acessórios',
    flavor: '0.6Ω / 5pcs',
    description: 'Pack com 5 resistências mesh para tanques PnP. Sabor duradouro.',
    price: 29.9,
    cost: 14,
    stock: 30,
    views: 2,
    emoji: '🔌',
    gradient: 'from-emerald-500/20 to-green-600/10',
  },
  {
    id: 'p10',
    name: 'Carregador USB-C',
    brand: 'LKD',
    category: 'Acessórios',
    flavor: 'Cabo 1m',
    description: 'Cabo USB-C trançado para recarregar pods. Compatível universal.',
    price: 19.9,
    cost: 7,
    stock: 40,
    views: 1,
    emoji: '🔌',
    gradient: 'from-teal-500/20 to-cyan-600/10',
  },
  {
    id: 'p11',
    name: 'Juice Head',
    brand: 'Juice Head',
    category: 'Essências',
    flavor: 'Pineapple Grapefruit',
    description: '100ml, abacaxi com toranja. Refrescante e cítrico para o dia todo.',
    price: 79.9,
    cost: 48,
    stock: 7,
    views: 5,
    emoji: '🍍',
    gradient: 'from-yellow-500/20 to-orange-600/10',
  },
  {
    id: 'p12',
    name: 'Geek Bar Pulse',
    brand: 'Geek Bar',
    category: 'Pods Descartáveis',
    flavor: 'Miami Mint',
    description: '15000 puffs, modo duplo, menta intensa com display LED.',
    price: 119.9,
    cost: 72,
    stock: 5,
    views: 11,
    emoji: '🌿',
    gradient: 'from-green-500/20 to-emerald-600/10',
    featured: true,
  },
];

const SEED_COUPONS: Coupon[] = [
  { id: 'c1', code: 'TABACARIA10', discountPercent: 10, active: true },
  { id: 'c2', code: 'LKD15', discountPercent: 15, active: true },
  { id: 'c3', code: 'VAPOR20', discountPercent: 20, active: true },
];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export const storage = {
  getProducts(): Product[] {
    const items = read<Product[] | null>(PRODUCTS_KEY, null);
    if (items && items.length > 0) return items;
    write(PRODUCTS_KEY, SEED_PRODUCTS);
    return SEED_PRODUCTS;
  },
  saveProducts(items: Product[]): void {
    write(PRODUCTS_KEY, items);
  },
  getCoupons(): Coupon[] {
    const items = read<Coupon[] | null>(COUPONS_KEY, null);
    if (items && items.length > 0) return items;
    write(COUPONS_KEY, SEED_COUPONS);
    return SEED_COUPONS;
  },
  saveCoupons(items: Coupon[]): void {
    write(COUPONS_KEY, items);
  },
  getCart(): { productId: string; quantity: number }[] {
    return read(CART_KEY, []);
  },
  saveCart(items: { productId: string; quantity: number }[]): void {
    write(CART_KEY, items);
  },
  isAuthed(): boolean {
    return read(AUTH_KEY, false);
  },
  setAuthed(v: boolean): void {
    write(AUTH_KEY, v);
  },
  getFlashDeadline(): number {
    let d = read<number | null>(FLASH_KEY, null);
    if (!d || d < Date.now()) {
      d = Date.now() + 8 * 60 * 60 * 1000;
      write(FLASH_KEY, d);
    }
    return d;
  },
  resetFlashDeadline(): number {
    const d = Date.now() + 8 * 60 * 60 * 1000;
    write(FLASH_KEY, d);
    return d;
  },
};

export function uid(): string {
  return 'id_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
