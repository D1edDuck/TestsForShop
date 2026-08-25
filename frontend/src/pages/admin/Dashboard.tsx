import { useAdminStats } from "../../hooks/useAdmin";
import { Spinner, StatCard, StatusBadge } from "../../components/UI";
import { Users, Package, ClipboardList, DollarSign } from "../../components/Icons";

export default function AdminDashboard() {
  const { stats, loading } = useAdminStats();

  if (loading) return <Spinner />;
  if (!stats) return <p className="text-center text-zinc-500 py-20">Не удалось загрузить статистику</p>;

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Дашборд</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Пользователей" value={stats.totalUsers} icon={<Users size={20} />} />
        <StatCard label="Товаров" value={stats.totalProducts} icon={<Package size={20} />} />
        <StatCard label="Заказов" value={stats.totalOrders} icon={<ClipboardList size={20} />} />
        <StatCard label="Выручка" value={`$${stats.totalRevenue.toFixed(2)}`} icon={<DollarSign size={20} />} color="text-success" />
      </div>

      {stats.ordersByStatus.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">По статусу</h2>
          <div className="grid grid-cols-5 gap-2">
            {stats.ordersByStatus.map((s) => (
              <div key={s.status} className="text-center p-3 bg-surface-2 rounded-lg">
                <StatusBadge status={s.status} />
                <p className="text-lg font-bold text-white mt-2">{s.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.recentOrders.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Последние заказы</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500 bg-surface-2">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider">Пользователь</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider">Сумма</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider">Статус</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider">Дата</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((o) => (
                <tr key={o.id} className="border-t border-white/5 hover:bg-surface-2 transition-colors">
                  <td className="px-5 py-3 text-zinc-500 font-mono text-xs">#{o.id}</td>
                  <td className="px-5 py-3 text-white">{o.user?.name || "—"}</td>
                  <td className="px-5 py-3 font-semibold text-white">${o.total.toFixed(2)}</td>
                  <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-3 text-zinc-500">{new Date(o.createdAt).toLocaleDateString("ru")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
