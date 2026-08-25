import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useToast } from "../contexts/ToastContext";
import { useCart } from "../contexts/CartContext";
import { CreditCard, ArrowLeft } from "../components/Icons";

export default function Checkout() {
  const navigate = useNavigate();
  const { show } = useToast();
  const { refresh } = useCart();
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      await api.orders.create({ address, phone });
      await refresh();
      show("Заказ оформлен!");
      navigate("/orders");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/cart")} className="p-2 rounded-lg hover:bg-surface-3 text-zinc-400 hover:text-white transition-all">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-bold text-white">Оформление заказа</h1>
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg mb-4 text-sm animate-fade-in">{error}</div>
      )}

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
          <div className="p-2.5 bg-accent/10 rounded-lg">
            <CreditCard size={20} className="text-accent-light" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Данные доставки</h2>
            <p className="text-xs text-zinc-500">Заполните адрес и телефон</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Адрес</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-field"
              required
              placeholder="Город, улица, дом, квартира"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Телефон</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              required
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          <button type="submit" disabled={pending} className="btn-primary w-full mt-2">
            {pending ? "Оформляем..." : "Подтвердить заказ"}
          </button>
        </form>
      </div>
    </div>
  );
}
