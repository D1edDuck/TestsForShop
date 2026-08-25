const BASE = "/api";

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (res.status === 204) return null as T;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Ошибка ${res.status}`);
  return data;
}

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      request<any>("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body: { email: string; password: string }) =>
      request<any>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    logout: () => request<any>("/auth/logout", { method: "POST" }),
    me: () => request<any>("/auth/me"),
  },
  products: {
    list: (params?: Record<string, string>) => {
      const q = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<any>(`/products${q}`);
    },
    categories: () => request<any>("/products/categories"),
    get: (id: number) => request<any>(`/products/${id}`),
    create: (body: any) =>
      request<any>("/products", { method: "POST", body: JSON.stringify(body) }),
    update: (id: number, body: any) =>
      request<any>(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: number) =>
      request<any>(`/products/${id}`, { method: "DELETE" }),
  },
  cart: {
    get: () => request<any>("/cart"),
    add: (productId: number, quantity = 1) =>
      request<any>("/cart", { method: "POST", body: JSON.stringify({ productId, quantity }) }),
    update: (itemId: number, quantity: number) =>
      request<any>(`/cart/${itemId}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
    remove: (itemId: number) =>
      request<any>(`/cart/${itemId}`, { method: "DELETE" }),
  },
  orders: {
    create: (body: { address: string; phone: string }) =>
      request<any>("/orders", { method: "POST", body: JSON.stringify(body) }),
    list: () => request<any>("/orders"),
    get: (id: number) => request<any>(`/orders/${id}`),
    updateStatus: (id: number, status: string) =>
      request<any>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },
  admin: {
    stats: () => request<any>("/admin/stats"),
    users: () => request<any>("/admin/users"),
    orders: () => request<any>("/admin/orders"),
  },
};
