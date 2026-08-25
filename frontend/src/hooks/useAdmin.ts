import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { AdminStats, User, Order } from "../types";

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const d = await api.admin.stats();
      setStats(d.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { stats, loading, refresh };
}

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.users().then((d) => setUsers(d.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return { users, loading };
}

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.orders().then((d) => setOrders(d.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return { orders, loading };
}
