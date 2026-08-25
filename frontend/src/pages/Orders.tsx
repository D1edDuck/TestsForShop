import { useOrders } from "../hooks/useOrders";
import { Spinner, EmptyState, StatusBadge } from "../components/UI";
import { Link } from "react-router-dom";

export default function Orders() {
  const { orders, loading } = useOrders();

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-white mb-6">Мои заказы</h1>
      {orders.length === 0 ? (
        <EmptyState
          title="Заказов пока нет"
          description="Сделайте первый заказ в каталоге"
          action={<Link to="/" className="btn-primary text-sm">Перейти в каталог</Link>}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => (
            <div key={order.id} className="card p-5 animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">#{order.id}</span>
                  <span className="text-xs text-zinc-600">{new Date(order.createdAt).toLocaleDateString("ru", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="space-y-1.5 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{item.product.name} × {item.quantity}</span>
                    <span className="text-zinc-300 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-zinc-500 truncate max-w-[60%]">{order.address}</span>
                <span className="font-bold text-white">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
