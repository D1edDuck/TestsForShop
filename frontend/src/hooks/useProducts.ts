import { useState, useEffect, useCallback } from "react";
import { api } from "../api/client";
import { Product, PaginatedResponse } from "../types";

interface ProductFilters {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
}

interface ProductsState {
  products: Product[];
  categories: string[];
  pagination: PaginatedResponse<Product>["pagination"] | null;
  loading: boolean;
  filters: ProductFilters;
  setFilters: (f: ProductFilters) => void;
  refresh: () => Promise<void>;
}

export function useProducts(): ProductsState {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Product>["pagination"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({ page: 1 });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(filters.page || 1), limit: "12" };
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;
      const d = await api.products.list(params);
      setProducts(d.data || []);
      setPagination(d.pagination || null);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    api.products.categories().then((d) => setCategories(d.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { products, categories, pagination, loading, filters, setFilters, refresh };
}
