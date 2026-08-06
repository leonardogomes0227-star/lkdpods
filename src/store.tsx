import { create } from 'zustand';
import { supabase } from './supabaseClient';
import type { Product, CartItem, Sale } from './types';

interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  active: boolean;
}

interface StoreState {
  products: Product[];
  cart: CartItem[];
  sales: Sale[];
  coupons: Coupon[];
  cartCount: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: any;
  isAuthed: boolean;
  flashDeadline: number;
  dailyTotal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  fetchProducts: () => Promise<void>;
  fetchSales: () => Promise<void>;
  setProducts: (products: Product[]) => void;
  addToCart: (product: Product, qty?: number, flavor?: string) => boolean;
  recordSale: (amount: number, customerInfo?: { name: string; phone: string }) => Promise<void>;
  clearCart: () => void;
  setAuthed: (authed: boolean) => void;
  logout: () => void;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, changes: Partial<Product>) => Promise<void>;
  addCoupon: (code: string, discountPercent: number) => { ok: boolean; message: string };
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  resetFlash: () => void;
}

// Calcula os totais de faturamento (dia / semana / mês) a partir da lista de vendas
function computeTotals(sales: Sale[]) {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay;

  let daily = 0;
  let weekly = 0;
  let monthly = 0;

  (Array.isArray(sales) ? sales : []).forEach((s) => {
    const diff = now - s.timestamp;
    if (diff <= oneDay) daily += s.amount;
    if (diff <= oneWeek) weekly += s.amount;
    if (diff <= oneMonth) monthly += s.amount;
  });

  return { dailyTotal: daily, weeklyTotal: weekly, monthlyTotal: monthly };
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  cart: [],
  sales: [],
  coupons: [],
  cartCount: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
  appliedCoupon: null,
  isAuthed: false,
  flashDeadline: Date.now() + 24 * 60 * 60 * 1000,
  dailyTotal: 0,
  weeklyTotal: 0,
  monthlyTotal: 0,

  fetchProducts: async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && Array.isArray(data)) {
        set({ products: data });
      } else {
        set({ products: [] });
      }
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      set({ products: [] });
    }
  },

  fetchSales: async () => {
    try {
      const { data, error } = await supabase.from('sales').select('*');
      const sales = !error && Array.isArray(data) ? data : [];
      set({ sales, ...computeTotals(sales) });
    } catch (err) {
      console.error('Erro ao buscar vendas:', err);
      set({ sales: [], dailyTotal: 0, weeklyTotal: 0, monthlyTotal: 0 });
    }
  },

  setProducts: (products) => set({ products: Array.isArray(products) ? products : [] }),
  setAuthed: (authed) => set({ isAuthed: authed }),
  logout: () => set({ isAuthed: false }),

  addToCart: (product, qty = 1, flavor = '') => {
    if (qty <= 0) return false;
    if (!flavor) {
      alert('Por favor, selecione um sabor.');
      return false;
    }
    let success = false;
    set((state) => {
      const prev = Array.isArray(state.cart) ? state.cart : [];
      const existing = prev.find((c) => c.product.id === product.id && c.selectedFlavor === flavor);
      const currentQtyInCart = existing ? existing.quantity : 0;
      const requestedTotal = currentQtyInCart + qty;
      success = true;
      const newCart = existing
        ? prev.map((c) => (c.product.id === product.id && c.selectedFlavor === flavor ? { ...c, quantity: requestedTotal } : c))
        : [...prev, { product, quantity: qty, selectedFlavor: flavor }];

      const newCount = newCart.reduce((sum, item) => sum + item.quantity, 0);
      const newSubtotal = newCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      return {
        cart: newCart,
        cartCount: newCount,
        subtotal: newSubtotal,
        total: newSubtotal - (state.discount || 0),
      };
    });
    return success;
  },

  recordSale: async (amount, customerInfo) => {
    const timestamp = Date.now();
    const tempId = Math.random().toString();
    const state = get();

    set((prev) => {
      const newSales = [...(prev.sales || []), { id: tempId, amount, timestamp }];
      return { sales: newSales, ...computeTotals(newSales) };
    });

    await supabase
      .from('sales')
      .insert([{ amount, timestamp }]);

    for (const item of (Array.isArray(state.cart) ? state.cart : [])) {
      const product = item.product;
      const newStock = Math.max(0, product.stock - item.quantity);
      set((prev) => ({
        products: (Array.isArray(prev.products) ? prev.products : []).map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
      }));
      await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', product.id);
    }

    if (customerInfo && customerInfo.phone) {
      await supabase.from('customers').upsert([
        {
          phone: customerInfo.phone.trim(),
          name: customerInfo.name.trim(),
          last_purchase: timestamp,
          total_spent: amount,
        }
      ], { onConflict: 'phone' });
    }
  },

  deleteProduct: async (id) => {
    set((prev) => ({
      products: (Array.isArray(prev.products) ? prev.products : []).filter((p) => p.id !== id),
    }));
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
    }
  },

  updateProduct: async (id, changes) => {
    set((prev) => ({
      products: (Array.isArray(prev.products) ? prev.products : []).map((p) =>
        p.id === id ? { ...p, ...changes } : p
      ),
    }));
    try {
      await supabase.from('products').update(changes).eq('id', id);
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
    }
  },

  addCoupon: (code, discountPercent) => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { ok: false, message: 'Digite um código válido.' };
    }
    if (!discountPercent || discountPercent <= 0 || discountPercent > 100) {
      return { ok: false, message: 'Informe um desconto entre 1 e 100.' };
    }
    const exists = get().coupons.some((c) => c.code === cleanCode);
    if (exists) {
      return { ok: false, message: 'Já existe um cupom com esse código.' };
    }
    const newCoupon: Coupon = {
      id: Math.random().toString(36).slice(2),
      code: cleanCode,
      discountPercent,
      active: true,
    };
    set((prev) => ({ coupons: [...(prev.coupons || []), newCoupon] }));
    return { ok: true, message: 'Cupom criado com sucesso!' };
  },

  toggleCoupon: (id) => {
    set((prev) => ({
      coupons: (prev.coupons || []).map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    }));
  },

  deleteCoupon: (id) => {
    set((prev) => ({
      coupons: (prev.coupons || []).filter((c) => c.id !== id),
    }));
  },

  resetFlash: () => set({ flashDeadline: Date.now() + 24 * 60 * 60 * 1000 }),

  clearCart: () => set({ cart: [], cartCount: 0, subtotal: 0, total: 0, discount: 0, appliedCoupon: null }),
}));
