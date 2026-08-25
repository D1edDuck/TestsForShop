import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, ClipboardList } from "./Icons";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="bg-surface-1/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <Package size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white hidden sm:block">TechShop</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link to="/" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-3 transition-all">
            <Package size={16} /> Каталог
          </Link>
          {user && (
            <Link to="/orders" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-3 transition-all">
              <ClipboardList size={16} /> Заказы
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <>
              <Link to="/admin" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-3 transition-all">
                <LayoutDashboard size={16} /> Дашборд
              </Link>
              <Link to="/admin/products" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-3 transition-all">
                <Package size={16} /> Товары
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/cart" className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-3 transition-all">
                <ShoppingCart size={18} />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold px-1 animate-fade-in" data-testid="cart-badge">
                    {count}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-surface-3 transition-all">
                <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
                  <User size={14} className="text-accent-light" />
                </div>
                <span className="text-sm hidden sm:block">{user.name}</span>
              </Link>
              <button onClick={logout} className="p-2 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Войти</Link>
              <Link to="/register" className="btn-primary text-sm">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
