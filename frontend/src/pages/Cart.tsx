import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Spinner, EmptyState } from "../components/UI";
import { Minus, Plus, X, ArrowLeft } from "../components/Icons";
import { Link } from "react-router-dom";

const CATEGORY_ICONS: Record<string, string> = {
  Phones: "📱", Laptops: "💻", Audio: "🎧", Tablets: "📟", Gaming: "🎮", Accessories: "🖱️",
};

export default function Cart() {
  const { items, total, count, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (count === 0 && items.length === 0) {
    return (
      <EmptyState
        title="Корзина пуста"
        description="Добавьте товары из каталога"
        action={<Link to="/" className="btn-primary text-sm" data-testid="cart-empty-catalog-link">Перейти в каталог</Link>}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-surface-3 text-zinc-400 hover:text-white transition-all">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-white">Корзина <span className="text-zinc-500 font-normal">({count})</span></h1>
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="card p-4 flex items-center gap-4 animate-fade-in"
            style={{ animationDelay: `${i * 50}ms` }}
            data-testid="cart-item"
          >
            <div className="w-12 h-12 bg-surface-3 rounded-lg flex items-center justify-center text-xl shrink-0">
              {CATEGORY_ICONS[item.product.category] || "📦"}
            </div>

            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-white hover:text-accent-light transition-colors truncate block">
                {item.product.name}
              </Link>
              <p className="text-xs text-zinc-500 mt-0.5">${item.product.price.toFixed(2)}</p>
            </div>

            <div className="flex items-center bg-surface-2 rounded-lg border border-white/5">
              <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))} className="p-1.5 hover:bg-surface-3 rounded-l-lg transition-colors text-zinc-400 hover:text-white" data-testid="cart-decrease">
                <Minus size={14} />
              </button>
              <span className="px-3 text-sm font-medium text-white" data-testid="cart-quantity">{item.quantity}</span>
              <button onClick={() => updateItem(item.id, item.quantity + 1)} className="p-1.5 hover:bg-surface-3 rounded-r-lg transition-colors text-zinc-400 hover:text-white" data-testid="cart-increase">
                <Plus size={14} />
              </button>
            </div>

            <span className="text-sm font-semibold text-white w-20 text-right">${(item.product.price * item.quantity).toFixed(2)}</span>

            <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all" data-testid="cart-remove">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="card p-5 mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Итого</p>
          <p className="text-xl font-bold text-white">${total.toFixed(2)}</p>
        </div>
        <button onClick={() => navigate("/checkout")} className="btn-primary px-8" data-testid="cart-checkout">
          Оформить заказ
        </button>
      </div>
    </div>
  );
}
