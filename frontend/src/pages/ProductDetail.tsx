import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { Product } from "../types";
import { Spinner } from "../components/UI";
import { ArrowLeft, Star, ShoppingCart, Minus, Plus } from "../components/Icons";

const CATEGORY_ICONS: Record<string, string> = {
  Phones: "📱", Laptops: "💻", Audio: "🎧", Tablets: "📟", Gaming: "🎮", Accessories: "🖱️",
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { show } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.products.get(Number(id))
      .then((d) => setProduct(d.data))
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addItem(product.id, quantity);
      show(`${product.name} добавлен в корзину`);
    } catch (err: any) {
      show(err.message, "error");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Spinner />;
  if (!product) return null;

  const reviews = product.reviews || [];

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 text-sm transition-colors">
        <ArrowLeft size={16} /> Назад
      </button>

      <div className="card overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 aspect-square bg-surface-2 flex items-center justify-center text-7xl relative">
            <span className="opacity-40">{CATEGORY_ICONS[product.category] || "📦"}</span>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent" />
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{product.category}</span>
              <div className="flex items-center gap-1 ml-auto">
                <Star size={14} className="text-amber-400" filled />
                <span className="text-sm font-medium text-zinc-300">{product.rating}</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">{product.name}</h1>
            <p className="text-zinc-400 leading-relaxed flex-1">{product.description}</p>

            <div className="mt-6 pt-6 border-t border-white/5">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-bold text-white">${product.price.toFixed(2)}</span>
                <span className="text-sm text-zinc-500 mb-1">{product.stock > 0 ? `${product.stock} в наличии` : "Нет в наличии"}</span>
              </div>
            </div>

            {product.stock > 0 && user && (
              <div className="flex items-center gap-3 mt-6">
                <div className="flex items-center bg-surface-2 rounded-lg border border-white/5">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-surface-3 rounded-l-lg transition-colors text-zinc-400 hover:text-white" data-testid="product-decrease">
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold text-white min-w-[40px] text-center" data-testid="product-quantity">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2.5 hover:bg-surface-3 rounded-r-lg transition-colors text-zinc-400 hover:text-white" data-testid="product-increase">
                    <Plus size={16} />
                  </button>
                </div>
                <button onClick={addToCart} disabled={adding} className="btn-primary flex-1 flex items-center justify-center gap-2" data-testid="cart-add">
                  <ShoppingCart size={16} />
                  {adding ? "Добавляем..." : "В корзину"}
                </button>
              </div>
            )}
            {!user && product.stock > 0 && (
              <button onClick={() => navigate("/login")} className="btn-secondary mt-6 w-full">
                Войдите, чтобы купить
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-white mb-4">Отзывы ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-zinc-500 text-sm">Пока нет отзывов</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold text-accent-light">
                    {r.user.name[0]}
                  </div>
                  <span className="text-sm font-medium text-white">{r.user.name}</span>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400" filled />
                    <span className="text-xs text-zinc-400">{r.rating}</span>
                  </div>
                  <span className="text-xs text-zinc-600 ml-auto">{new Date(r.createdAt).toLocaleDateString("ru")}</span>
                </div>
                <p className="text-sm text-zinc-400 ml-11">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
