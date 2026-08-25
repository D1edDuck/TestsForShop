import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, ClipboardList } from "../components/Icons";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h1 className="text-xl font-bold text-white mb-6">Профиль</h1>

      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
          <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-xl font-bold text-accent-light">
            {user.name[0]}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{user.name}</h2>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 text-zinc-400">
              <User size={16} />
              <span className="text-sm">Роль</span>
            </div>
            <span className={`badge ${user.role === "ADMIN" ? "bg-accent/15 text-accent-light" : "bg-zinc-500/15 text-zinc-400"}`}>
              {user.role}
            </span>
          </div>
        </div>

        <button onClick={() => navigate("/orders")} className="btn-secondary w-full mt-6 flex items-center justify-center gap-2">
          <ClipboardList size={16} /> Мои заказы
        </button>
      </div>
    </div>
  );
}
