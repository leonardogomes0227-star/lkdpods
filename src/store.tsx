import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, Coupon, Product } from './types';
import { storage } from './storage';
import { supabase } from './supabase'; // <-- NOSSA CONEXÃO COM A NUVEM AQUI!

export const ADMIN_CREDENTIALS = {
  email: 'admin@lkdimports.com',
  password: 'admin123',
};

export interface Sale {
  id: string;
  amount: number;
  timestamp: number;
}

interface StoreContextValue {
  products: Product[];
  coupons: Coupon[];
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  appliedCoupon: Coupon | null;
  discount: number;
  total: number;
  isAuthed: boolean;
  flashDeadline: number;
  
  dailyTotal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  recordSale: (amount: number) => void;

  addToCart: (product: Product, qty?: number, flavor?: string) => void;
  removeFromCart: (productId: string, flavor: string) => void;
  setQty: (productId: string, flavor: string, qty: number) => void;
  clearCart: () => void;
  
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  
  addProduct: (p: Omit<Product, 'id' | 'views'>) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCoupon: (code: string, discountPercent: number) => { ok: boolean; message: string };
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  
  login: (email: string, password: string) => boolean;
  logout: () => void;
  resetFlash: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Começamos com as listas vazias enquanto o Supabase baixa tudo
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState<boolean>(() => storage.isAuthed());
  const [flashDeadline, setFlashDeadline] = useState<number>(() => storage.getFlashDeadline());

  // === MAGIA DA NUVEM: BAIXANDO OS DADOS AO ABRIR O SITE ===
  useEffect(() => {
    async function loadDataFromCloud() {
      // 1. Baixa os produtos
      const { data: pData } = await supabase.from('products').select('*');
      if (pData) setProducts(pData);

      // 2. Baixa os cupons (traduzindo o nome da coluna do banco para o código)
      const { data: cData } = await supabase.from('coupons').select('*');
      if (cData) {
        setCoupons(
          cData.map((c) => ({
            id: c.id,
            code: c.code,
            discountPercent: c.discount_percent, // Tradução mágica aqui
            active: c.active,
          }))
        );
      }

      // 3. Baixa o histórico de vendas para o fechamento
      const { data: sData } = await supabase.from('sales').select('*');
      if (sData) setSales(sData);
    }
    
    loadDataFromCloud();
  }, []);

  // === CÁLCULO DE FECHAMENTO (Agora roda com os dados da nuvem) ===
  const { dailyTotal, weeklyTotal, monthlyTotal } = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfDay - 6 * 24 * 60 * 60 * 1000; 
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let daily = 0;
    let weekly = 0;
    let monthly = 0;

    sales.forEach((sale) => {
      if (sale.timestamp >= startOfDay) daily += Number(sale.amount);
      if (sale.timestamp >= startOfWeek) weekly += Number(sale.amount);
      if (sale.timestamp >= startOfMonth) monthly += Number(sale.amount);
    });

    return { dailyTotal: daily, weeklyTotal: weekly, monthlyTotal: monthly };
  }, [sales]);

  // === MUTAÇÕES NO BANCO DE DADOS ===

  const recordSale = useCallback((amount: number) => {
    const timestamp = Date.now();
    const tempId = Math.random().toString(); // ID temporário pra tela atualizar na hora
    
    setSales((prev) => [...prev, { id: tempId, amount, timestamp }]);

    supabase
      .from('sales')
      .insert([{ amount, timestamp }])
      .select()
      .single()
      .then(({ data }) => {
        if (data) setSales((prev) => prev.map((s) => (s.id === tempId ? data : s)));
      });
  }, []);

  const addProduct = useCallback((p: Omit<Product, 'id' | 'views'>) => {
    supabase
      .from('products')
      .insert([{ ...p, views: Math.floor(Math.random() * 8) + 1, featured: false }])
      .select()
      .then(({ data, error }) => {
        if (error) {
          console.error('Erro detalhado do Supabase ao cadastrar:', error);
          alert('Erro ao salvar no banco: ' + error.message);
        } else if (data && data.length > 0) {
          setProducts((prev) => [data[0], ...prev]);
        }
      });
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    // Atualiza a tela primeiro (UI Otimista)
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    // Manda pro banco no fundo
    supabase.from('products').update(patch).eq('id', id);
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    supabase.from('products').delete().eq('id', id);
  }, []);

  const addCoupon = useCallback((code: string, discountPercent: number) => {
    const exists = coupons.some((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (exists) return { ok: false, message: 'Já existe um cupom com esse código.' };
    if (discountPercent <= 0 || discountPercent > 100)
      return { ok: false, message: 'Desconto deve ser entre 1% e 100%.' };

    supabase
      .from('coupons')
      .insert([{ code: code.trim().toUpperCase(), discount_percent: discountPercent, active: true }])
      .select()
      .single()
      .then(({ data }) => {
        if (data) {
          setCoupons((prev) => [
            ...prev,
            { id: data.id, code: data.code, discountPercent: data.discount_percent, active: data.active },
          ]);
        }
      });
      
    return { ok: true, message: 'Cupom criado com sucesso.' };
  }, [coupons]);

  const toggleCoupon = useCallback((id: string) => {
    setCoupons((prev) => prev.map((c) => {
      if (c.id === id) {
        const newActive = !c.active;
        supabase.from('coupons').update({ active: newActive }).eq('id', id);
        return { ...c, active: newActive };
      }
      return c;
    }));
  }, []);

  const deleteCoupon = useCallback((id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    supabase.from('coupons').delete().eq('id', id);
  }, []);

  // === LÓGICA DO CARRINHO E COMPRAS ===

  const addToCart = useCallback((product: Product, qty = 1, flavor = '') => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id && c.selectedFlavor === flavor);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id && c.selectedFlavor === flavor 
            ? { ...c, quantity: c.quantity + qty } 
            : c,
        );
      }
      return [...prev, { product, quantity: qty, selectedFlavor: flavor }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, flavor: string) => {
    setCart((prev) => prev.filter((c) => !(c.product.id === productId && c.selectedFlavor === flavor)));
  }, []);

  const setQty = useCallback((productId: string, flavor: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.product.id === productId && c.selectedFlavor === flavor ? { ...c, quantity: Math.max(0, qty) } : c))
        .filter((c) => c.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode(null);
  }, []);

  const subtotal = useMemo(() => cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0), [cart]);

  const appliedCoupon = useMemo(
    () => (couponCode ? coupons.find((c) => c.code === couponCode && c.active) ?? null : null),
    [couponCode, coupons]
  );

  const discount = useMemo(() => (appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0), [appliedCoupon, subtotal]);

  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);

  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.quantity, 0), [cart]);

  const applyCoupon = useCallback((code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) return { ok: false, message: 'Cupom não encontrado.' };
    if (!found.active) return { ok: false, message: 'Este cupom está inativo.' };
    setCouponCode(found.code);
    return { ok: true, message: `Cupom ${found.code} aplicado: ${found.discountPercent}% OFF!` };
  }, [coupons]);

  const removeCoupon = useCallback(() => setCouponCode(null), []);

  const login = useCallback((email: string, password: string) => {
    if (email.trim().toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      storage.setAuthed(true);
      setIsAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    storage.setAuthed(false);
    setIsAuthed(false);
  }, []);

  const resetFlash = useCallback(() => {
    setFlashDeadline(storage.resetFlashDeadline());
  }, []);

  const value: StoreContextValue = {
    products, coupons, cart, cartCount, subtotal, appliedCoupon, discount, total, isAuthed, flashDeadline,
    dailyTotal, weeklyTotal, monthlyTotal, recordSale,
    addToCart, removeFromCart, setQty, clearCart, applyCoupon, removeCoupon, addProduct, updateProduct, deleteProduct,
    addCoupon, toggleCoupon, deleteCoupon, login, logout, resetFlash,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
