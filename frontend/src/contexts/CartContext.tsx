import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "../api/client";
import { CartItem } from "../types";

interface CartCtx {
  items: CartItem[];
  total: number;
  count: number;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

const Ctx = createContext<CartCtx>({} as CartCtx);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const d = await api.cart.get();
      setItems(d.data || []);
      setTotal(d.total || 0);
      setCount(d.count || 0);
    } catch {
      setItems([]);
      setTotal(0);
      setCount(0);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addItem = useCallback(async (productId: number, quantity = 1) => {
    await api.cart.add(productId, quantity);
    await refresh();
  }, [refresh]);

  const updateItem = useCallback(async (itemId: number, quantity: number) => {
    await api.cart.update(itemId, quantity);
    await refresh();
  }, [refresh]);

  const removeItem = useCallback(async (itemId: number) => {
    await api.cart.remove(itemId);
    await refresh();
  }, [refresh]);

  return (
    <Ctx.Provider value={{ items, total, count, refresh, addItem, updateItem, removeItem }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => useContext(Ctx);
