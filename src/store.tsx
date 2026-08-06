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
import { supabase } from './supabase';
import { logSecurityEvent } from './security';

export const ADMIN_CREDENTIALS = {
  email: 'admin@lkdimports.com',
  password: 'admin123',
};

// Variáveis de controle de tentativa de força bruta (Rate Limiting)
let failedLoginAttempts = 0;
let lockoutUntil = 0;

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
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  resetFlash: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState<boolean>(() => storage.isAuthed());
  const [flashDeadline, setFlashDeadline] = useState<number>(() => storage.getFlashDeadline());

  useEffect(() => {
    async function loadDataFromCloud() {
      const { data: pData } = await supabase.from('products').select('*');
      if (pData) setProducts(pData);

      const { data: cData } = await supabase.from('coupons').select('*');
      if (cData) {
        setCoupons(
          cData.map((c) => ({
            id: c.id,
            code: c.code,
            discountPercent: c.discount_percent,
            active: c.active,
          }))
        );
      }

      const { data: sData } = await supabase.from('sales').select('*');
      if (sData) setSales(sData);
    }
    
    loadDataFromCloud();
  }, []);

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

  const recordSale = useCallback((amount: number) => {
    const timestamp = Date.now();
    const tempId = Math.random().toString();
    
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

  const addProduct = useCallback(async (p: Omit<Product, 'id' | 'views'>) => {
    supabase
      .from('products')
      .insert([{ ...p, views: Math.floor(Math.random() * 8) + 1, featured: false }])
      .select()
      .then(async ({ data, error }) => {
        if (error) {
          console.error('Erro detalhado do Supabase ao cadastrar:', error);
          alert('Erro ao salvar no banco: ' + error.message);
        } else if (data && data.length > 0) {
          setProducts((prev) => [data[0], ...prev]);
          await logSecurityEvent('PRODUCT_CREATED', `Produto criado: ${p.name} (Marca: ${p.brand})`);
        }
      });
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    supabase.from('products').update(patch).eq('id', id);
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    supabase.from('products').delete().eq('id', id);
    await logSecurityEvent('PRODUCT_DELETED', `Produto removido ID: ${id}`);
  }, []);

  const addCoupon = useCallback(async (code: string, discountPercent: number) => {
    const exists = coupons.some((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (exists) return { ok: false, message: 'Já existe um cupom com esse código.' };
    if (discountPercent <= 0 || discountPercent > 100)
      return { ok: false, message: 'Desconto deve ser entre 1% e 100%.' };

    const formattedCode = code.trim().toUpperCase();

    supabase
      .from('coupons')
      .insert([{ code: formattedCode, discount_percent: discountPercent, active: true }])
      .select()
      .single()
      .then(async ({ data }) => {
        if (data) {
          setCoupons((prev) => [
            ...prev,
            { id: data.id, code: data.code, discountPercent: data.discount_percent, active: data.active },
          ]);
          await logSecurityEvent('COUPON_CREATED', `Cupom criado: ${formattedCode} (${discountPercent}%)`);
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

  // === LOGIN BLINDADO COM RATE LIMITING E AUDITORIA ===
  const login = useCallback(async (email: string, password: string) => {
    const now = Date.now();
    
    if (now < lockoutUntil) {
      const waitSeconds = Math.ceil((lockoutUntil - now) / 1000);
      alert(`Muitas tentativas incorretas. Aguarde ${waitSeconds} segundos para tentar novamente.`);
      return false;
    }

    if (email.trim().toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      failedLoginAttempts = 0;
      lockoutUntil = 0;

      storage.setAuthed(true);
      setIsAuthed(true);

      await logSecurityEvent('ADMIN_LOGIN_SUCCESS', `Login bem-sucedido com o e-mail: ${email}`);
      return true;
    } else {
      failedLoginAttempts += 1;

      if (failedLoginAttempts >= 5) {
        lockoutUntil = Date.now() + 30 * 1000;
        failedLoginAttempts = 0;
        await logSecurityEvent('ADMIN_LOCKOUT', 'Painel bloqueado temporariamente por excesso de tentativas de login falhas.');
      } else {
        await logSecurityEvent('ADMIN_LOGIN_FAILED', `Tentativa de login falha com o e-mail: ${email} (Tentativa ${failedLoginAttempts}/5)`);
      }

      return false;
    }
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
