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
import { storage, uid, ADMIN_CREDENTIALS } from './storage';

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
  // cart
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  // coupon
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  // products CRUD
  addProduct: (p: Omit<Product, 'id' | 'views'>) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // coupons CRUD
  addCoupon: (code: string, discountPercent: number) => { ok: boolean; message: string };
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  // auth
  login: (email: string, password: string) => boolean;
  logout: () => void;
  resetFlash: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => storage.getProducts());
  const [coupons, setCoupons] = useState<Coupon[]>(() => storage.getCoupons());
  const [cart, setCart] = useState<CartItem[]>(() => {
    const raw = storage.getCart();
    const all = storage.getProducts();
    return raw
      .map((r) => {
        const p = all.find((x) => x.id === r.productId);
        return p ? { product: p, quantity: r.quantity } : null;
      })
      .filter((x): x is CartItem => x !== null);
  });
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState<boolean>(() => storage.isAuthed());
  const [flashDeadline, setFlashDeadline] = useState<number>(() => storage.getFlashDeadline());

  // persist products
  useEffect(() => {
    storage.saveProducts(products);
  }, [products]);

  // persist coupons
  useEffect(() => {
    storage.saveCoupons(coupons);
  }, [coupons]);

  // persist cart
  useEffect(() => {
    storage.saveCart(cart.map((c) => ({ productId: c.product.id, quantity: c.quantity })));
  }, [cart]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, quantity: c.quantity + qty } : c,
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.product.id === productId ? { ...c, quantity: Math.max(0, qty) } : c))
        .filter((c) => c.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode(null);
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0),
    [cart],
  );

  const appliedCoupon = useMemo(
    () => (couponCode ? coupons.find((c) => c.code === couponCode && c.active) ?? null : null),
    [couponCode, coupons],
  );

  const discount = useMemo(
    () => (appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0),
    [appliedCoupon, subtotal],
  );

  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);

  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.quantity, 0), [cart]);

  const applyCoupon = useCallback(
    (code: string) => {
      const found = coupons.find(
        (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
      );
      if (!found) return { ok: false, message: 'Cupom não encontrado.' };
      if (!found.active) return { ok: false, message: 'Este cupom está inativo.' };
      setCouponCode(found.code);
      return { ok: true, message: `Cupom ${found.code} aplicado: ${found.discountPercent}% OFF!` };
    },
    [coupons],
  );

  const removeCoupon = useCallback(() => setCouponCode(null), []);

  const addProduct = useCallback((p: Omit<Product, 'id' | 'views'>) => {
    setProducts((prev) => [
      { ...p, id: uid(), views: Math.floor(Math.random() * 8) + 1 },
      ...prev,
    ]);
  }, []);

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.product.id !== id));
  }, []);

  const addCoupon = useCallback(
    (code: string, discountPercent: number) => {
      const exists = coupons.some(
        (c) => c.code.toUpperCase() === code.trim().toUpperCase(),
      );
      if (exists) return { ok: false, message: 'Já existe um cupom com esse código.' };
      if (discountPercent <= 0 || discountPercent > 100)
        return { ok: false, message: 'Desconto deve ser entre 1% e 100%.' };
      setCoupons((prev) => [
        ...prev,
        { id: uid(), code: code.trim().toUpperCase(), discountPercent, active: true },
      ]);
      return { ok: true, message: 'Cupom criado com sucesso.' };
    },
    [coupons],
  );

  const toggleCoupon = useCallback((id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)),
    );
  }, []);

  const deleteCoupon = useCallback((id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const login = useCallback((email: string, password: string) => {
    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
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
    products,
    coupons,
    cart,
    cartCount,
    subtotal,
    appliedCoupon,
    discount,
    total,
    isAuthed,
    flashDeadline,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    applyCoupon,
    removeCoupon,
    addProduct,
    updateProduct,
    deleteProduct,
    addCoupon,
    toggleCoupon,
    deleteCoupon,
    login,
    logout,
    resetFlash,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
