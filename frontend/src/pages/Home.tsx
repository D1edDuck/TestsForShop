import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import { Spinner, EmptyState } from "../components/UI";
import { Search, ChevronDown } from "../components/Icons";
import { Link } from "react-router-dom";

export default function Home() {
  const { products, categories, pagination, loading, filters, setFilters } = useProducts();

  const update = (patch: Record<string, string | number | undefined>) => {
    setFilters({ ...filters, ...patch, page: Number(patch.page) || 1 });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Каталог</h1>
        <p className="text-sm text-zinc-500">Лучшая электроника по доступным ценам</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Найти товар..."
            value={filters.search || ""}
            onChange={(e) => update({ search: e.target.value || undefined })}
            className="input-field pl-9"
          />
        </div>
        <div className="relative">
          <select value={filters.category || ""} onChange={(e) => update({ category: e.target.value || undefined })} className="input-field pr-9 appearance-none cursor-pointer min-w-[160px]">
            <option value="">Все категории</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={filters.sort || ""} onChange={(e) => update({ sort: e.target.value || undefined })} className="input-field pr-9 appearance-none cursor-pointer min-w-[160px]">
            <option value="">Сортировка</option>
            <option value="price_asc">Цена ↑</option>
            <option value="price_desc">Цена ↓</option>
            <option value="rating">Рейтинг</option>
            <option value="name">Название</option>
            <option value="newest">Новинки</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {loading ? <Spinner /> : products.length === 0 ? (
        <EmptyState title="Товары не найдены" description="Попробуйте изменить фильтры" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-1.5 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => update({ page: p })}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                    p === pagination.page
                      ? "bg-accent text-white shadow-lg shadow-accent/25"
                      : "bg-surface-2 text-zinc-400 hover:bg-surface-3 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
