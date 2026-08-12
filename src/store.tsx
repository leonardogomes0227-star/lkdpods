import { create } from 'zustand';
import { supabase } from './supabaseClient';
import type { Product, CartItem, Sale, FlavorStock, Customer, Order } from './types';

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
  customers: Customer[];
  orders: Order[];
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
  fetchCustomers: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  setProducts: (products: Product[]) => void;
  addToCart: (product: Product, qty?: number, flavor?: string) => boolean;
  recordSale: (amount: number, customerInfo?: { name: string; phone: string }) => Promise<void>;
  clearCart: () => void;
  setAuthed: (authed: boolean) => void;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, changes: Partial<Product>) => Promise<void>;
  addCoupon: (code: string, discountPercent: number) => { ok: boolean; message: string };
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  resetFlash: () => void;
}

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

function decrementFlavorStock(flavors: FlavorStock[] | undefined, flavorName: string, qty: number): FlavorStock[] {
  const list = Array.isArray(flavors) ? flavors : [];
  const now = Date.now();
  const safeFlavorName = flavorName.trim().toLowerCase();
  
  return list.map((f) =>
    f.name.trim().toLowerCase() === safeFlavorName
      ? { ...f, stock: Math.max(0, f.stock - qty), lastSoldAt: now }
      : f
  );
}

function mapOrderFromDb(row: any): Order {
  return {
    id: row.id,
    customerPhone: row.customer_phone,
    customerName: row.customer_name,
    timestamp: row.timestamp,
    totalAmount: row.total_amount,
    totalCost: row.total_cost,
    profit: row.profit,
    items: Array.isArray(row.order_items)
      ? row.order_items.map((i: any) => ({
          id: i.id,
          productId: i.product_id,
          productName: i.product_name,
          brand: i.brand,
          flavor: i.flavor,
          quantity: i.quantity,
          unitPrice: i.unit_price,
          unitCost: i.unit_cost,
        }))
      : [],
  };
}

function mapCustomerFromDb(row: any): Customer {
  return {
    id: row.phone,
    phone: row.phone,
    name: row.name,
    firstPurchase: row.first_purchase,
    lastPurchase: row.last_purchase,
    purchaseCount: row.purchase_count || 0,
    totalSpent: row.total_spent || 0,
  };
}

export const useStore = create<StoreState>((set, get) => ({
  products: [],
  cart: [],
  sales: [],
  coupons: [],
  customers: [],
  orders: [],
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

  fetchCustomers: async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('last_purchase', { ascending: false });
      if (!error && Array.isArray(data)) {
        set({ customers: data.map(mapCustomerFromDb) });
      } else {
        set({ customers: [] });
      }
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      set({ customers: [] });
    }
  },

  fetchOrders: async () => {
    try {
      const { data, error } = await supabase
        .from('customer_orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (!error && Array.isArray(data)) {
        set({ orders: data.map(mapOrderFromDb) });
      } else {
        set({ orders: [] });
      }
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      set({ orders: [] });
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
    const flavorEntry = (Array.isArray(product.flavors) ? product.flavors : []).find(
      (f) => f.name.trim().toLowerCase() === flavor.trim().toLowerCase()
    );
    
    if (flavorEntry && flavorEntry.stock <= 0) {
      alert('Esse sabor está esgotado.');
      return false;
    }
    
    let success = false;
    
    set((state) => {
      const prev = Array.isArray(state.cart) ? state.cart : [];
      const existing = prev.find(
        (c) => c.product.id === product.id && c.selectedFlavor === flavor
      );
      const currentQtyInCart = existing ? existing.quantity : 0;
      const requestedTotal = currentQtyInCart + qty;
      
      if (flavorEntry && requestedTotal > flavorEntry.stock) {
        alert(`Só temos ${flavorEntry.stock} unidade(s) desse sabor em estoque.`);
        success = false;
        return state;
      }
      
      success = true;
      const newCart = existing
        ? prev.map((c) =>
            c.product.id === product.id && c.selectedFlavor === flavor
              ? { ...c, quantity: requestedTotal }
              : c
          )
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
    const state = get();
    const cartItems = Array.isArray(state.cart) ? state.cart : [];
    const totalCost = cartItems.reduce((sum, item) => sum + item.product.cost * item.quantity, 0);
    const profit = amount - totalCost;
    const tempSaleId = Math.random().toString();

    set((prev) => {
      const newSales = [...(prev.sales || []), { id: tempSaleId, amount, timestamp }];
      return { sales: newSales, ...computeTotals(newSales) };
    });

    try {
      await supabase.from('sales').insert([{ amount, timestamp }]);
    } catch (e) {
      console.error('Erro ao salvar venda:', e);
    }

    let orderId: string | null = null;
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('customer_orders')
        .insert([{
          phone: customerInfo?.phone?.trim() || null,
          customer_name: customerInfo?.name?.trim() || null,
          total: amount,
          status: 'pendente',
        }])
        .select()
        .single();
      if (!orderError && orderData) orderId = orderData.id;
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
    }

    for (const item of cartItems) {
      const product = item.product;
      const updatedFlavors = decrementFlavorStock(product.flavors, item.selectedFlavor, item.quantity);
      const newTotalStock = updatedFlavors.reduce((sum, f) => sum + f.stock, 0);

      set((prev) => ({
        products: (Array.isArray(prev.products) ? prev.products : []).map((p) =>
          p.id === product.id ? { ...p, flavors: updatedFlavors, stock: newTotalStock } : p
        ),
      }));

      try {
        await supabase
          .from('products')
          .update({ flavors: updatedFlavors, stock: newTotalStock })
          .eq('id', product.id);
      } catch (e) {
        console.error('Erro ao atualizar estoque no banco:', e);
      }

      if (orderId) {
        try {
          await supabase.from('order_items').insert([{
            order_id: orderId,
            product_id: product.id,
            product_name: product.name,
            brand: product.brand,
            flavor: item.selectedFlavor,
            quantity: item.quantity,
            unit_price: product.price,
            unit_cost: product.cost,
          }]);
        } catch (e) {
          console.error('Erro ao salvar item do pedido:', e);
        }
      }
    }

    if (customerInfo && customerInfo.phone) {
      const phone = customerInfo.phone.trim();
      const name = customerInfo.name.trim();
      
      try {
        const { data: existing } = await supabase
          .from('customers')
          .select('*')
          .eq('phone', phone)
          .maybeSingle();

        if (existing) {
          await supabase
            .from('customers')
            .update({
              name,
              last_purchase: timestamp,
              purchase_count: (existing.purchase_count || 0) + 1,
              total_spent: (existing.total_spent || 0) + amount,
            })
            .eq('phone', phone);
        } else {
          await supabase.from('customers').insert([{
            phone,
            name,
            first_purchase: timestamp,
            last_purchase: timestamp,
            purchase_count: 1,
            total_spent: amount,
          }]);
        }
      } catch (err) {
        console.error('Erro ao atualizar cliente:', err);
      }

      set((prev) => {
        const customers = Array.isArray(prev.customers) ? prev.customers : [];
        const idx = customers.findIndex((c) => c.phone === phone);
        if (idx >= 0) {
          const updated = [...customers];
          updated[idx] = {
            ...updated[idx],
            name,
            lastPurchase: timestamp,
            purchaseCount: updated[idx].purchaseCount + 1,
            totalSpent: updated[idx].totalSpent + amount,
          };
          return { customers: updated };
        }
        return {
          customers: [
            { id: phone, phone, name, firstPurchase: timestamp, lastPurchase: timestamp, purchaseCount: 1, totalSpent: amount },
            ...customers,
          ],
        };
      });
    }

    if (orderId) {
      set((prev) => ({
        orders: [
          {
            id: orderId!,
            customerPhone: customerInfo?.phone,
            customerName: customerInfo?.name,
            timestamp,
            totalAmount: amount,
            totalCost,
            profit,
            items: cartItems.map((item) => ({
              id: Math.random().toString(),
              productId: item.product.id,
              productName: item.product.name,
              brand: item.product.brand,
              flavor: item.selectedFlavor,
              quantity: item.quantity,
              unitPrice: item.product.price,
              unitCost: item.product.cost,
            })),
          },
          ...(Array.isArray(prev.orders) ? prev.orders : []),
        ],
      }));
    }
  },

  addProduct: async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar produto no Supabase:', error);
        alert('Erro ao salvar no banco: ' + error.message);
        return;
      }

      if (data) {
        set((prev) => ({
          products: [...(Array.isArray(prev.products) ? prev.products : []), data],
        }));
      }
    } catch (err) {
      console.error('Erro inesperado ao cadastrar produto:', err);
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
    if (!cleanCode) return { ok: false, message: 'Digite um código válido.' };
    if (!discountPercent || discountPercent <= 0 || discountPercent > 100) return { ok: false, message: 'Informe um desconto entre 1 e 100.' };
    const exists = get().coupons.some((c) => c.code === cleanCode);
    if (exists) return { ok: false, message: 'Já existe um cupom com esse código.' };
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
