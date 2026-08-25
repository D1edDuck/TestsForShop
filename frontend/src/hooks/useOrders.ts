import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { Order } from "../types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const d = await api.orders.list();
      setOrders(d.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { orders, loading, refresh };
}
