import { create } from 'zustand';
import { supabase } from './supabaseClient'; // ou o caminho do seu cliente supabase
import type { Product, CartItem, Sale } from './types';

interface StoreState {
  products: Product[];
  cart: CartItem[];
  sales: Sale[];
  cartCount: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedCoupon: any;
  addToCart: (product: Product, qty?: number, flavor?: string) => boolean;
  recordSale: (amount: number, customerInfo?: { name: string; phone: string }) => Promise<void>;
  clearCart: () => void;
  // ... outras funções e estados do seu projeto ...
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  cart: [],
  sales: [],
  cartCount: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
  appliedCoupon: null,

  // Cole aqui a sua função addToCart
  addToCart: (product, qty = 1, flavor = '') => {
    if (qty <= 0) return false;
    if (!flavor) {
      alert('Por favor, selecione um sabor.');
      return false;
    }

    let success = false;
    set((state) => {
      const prev = state.cart;
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
        total: newSubtotal - state.discount,
      };
    });
    return success;
  },

  // Cole aqui a sua função recordSale
  recordSale: async (amount, customerInfo) => {
    const timestamp = Date.now();
    const tempId = Math.random().toString();
    const state = get();
    
    set((prev) => ({ sales: [...prev.sales, { id: tempId, amount, timestamp }] }));

    await supabase
      .from('sales')
      .insert([{ amount, timestamp }]);

    for (const item of state.cart) {
      const product = item.product;
      const newStock = Math.max(0, product.stock - item.quantity);

      set((prev) => ({
        products: prev.products.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
      }));

      await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', product.id);

      if (newStock === 0) {
        await supabase.from('audit_logs').insert([{
          action: 'OUT_OF_STOCK',
          details: `O produto "${product.name}" (Sabor: ${item.selectedFlavor}) esgotou totalmente!`,
          timestamp: Date.now()
        }]);
      }
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

  clearCart: () => set({ cart: [], cartCount: 0, subtotal: 0, total: 0, discount: 0, appliedCoupon: null }),
}));
