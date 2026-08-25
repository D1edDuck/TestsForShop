import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { ShoppingCart, Star } from "./Icons";

const CATEGORY_COLORS: Record<string, string> = {
  Phones: "from-blue-500/20 to-indigo-500/20 text-blue-400",
  Laptops: "from-violet-500/20 to-purple-500/20 text-violet-400",
  Audio: "from-pink-500/20 to-rose-500/20 text-pink-400",
  Tablets: "from-cyan-500/20 to-teal-500/20 text-cyan-400",
  Gaming: "from-amber-500/20 to-orange-500/20 text-amber-400",
  Accessories: "from-emerald-500/20 to-green-500/20 text-emerald-400",
};

const CATEGORY_ICONS: Record<string, string> = {
  Phones: "📱", Laptops: "💻", Audio: "🎧", Tablets: "📟", Gaming: "🎮", Accessories: "🖱️",
};

export default function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { show } = useToast();
  const [adding, setAdding] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { show("Войдите, чтобы добавить в корзину", "error"); return; }
    setAdding(true);
    try {
      await addItem(product.id);
      show(`${product.name} добавлен в корзину`);
    } catch (err: any) {
      show(err.message, "error");
    } finally {
      setAdding(false);
    }
  };

  const colorClass = CATEGORY_COLORS[product.category] || "from-zinc-500/20 to-zinc-500/20 text-zinc-400";

  return (
    <Link
      to={`/product/${product.id}`}
      className="card group relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`aspect-square bg-gradient-to-br ${colorClass} flex items-center justify-center relative`}>
        <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-300">{CATEGORY_ICONS[product.category] || "📦"}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent" />
      </div>

      <div className="p-4 relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{product.category}</span>
          <div className="flex items-center gap-1 ml-auto">
            <Star size={12} className="text-amber-400" filled />
            <span className="text-xs font-medium text-zinc-400">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-semibold text-white group-hover:text-accent-light transition-colors truncate">{product.name}</h3>

        <div className="flex items-end justify-between mt-3">
          <span className="text-xl font-bold text-white">${product.price.toFixed(2)}</span>
          <span className="text-[11px] text-zinc-500">{product.stock > 0 ? `${product.stock} шт.` : "Нет"}</span>
        </div>

        {product.stock > 0 && user && (
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
              hovered
                ? "bg-accent text-white opacity-100"
                : "bg-surface-3 text-zinc-400 opacity-80"
            }`}
          >
            <ShoppingCart size={14} />
            {adding ? "..." : "В корзину"}
          </button>
        )}
      </div>
    </Link>
  );
}
