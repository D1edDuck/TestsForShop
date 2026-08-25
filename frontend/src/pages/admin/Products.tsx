import { useState, useEffect, FormEvent } from "react";
import { api } from "../../api/client";
import { Product } from "../../types";
import { Spinner, EmptyState } from "../../components/UI";
import { Plus, Pencil, Trash, X } from "../../components/Icons";

const CATEGORIES = ["Phones", "Laptops", "Audio", "Tablets", "Gaming", "Accessories"];

interface FormData {
  name: string; description: string; price: string; category: string; stock: string; image: string;
}
const emptyForm: FormData = { name: "", description: "", price: "", category: "Phones", stock: "", image: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    const d = await api.products.list({ limit: "100" });
    setProducts(d.data || []);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setError(""); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category, stock: String(p.stock), image: p.image });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editId) await api.products.update(editId, body);
      else await api.products.create(body);
      setShowModal(false);
      await refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить товар?")) return;
    await api.products.delete(id);
    await refresh();
  };

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Управление товарами</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Добавить
        </button>
      </div>

      {products.length === 0 ? (
        <EmptyState title="Нет товаров" description="Добавьте первый товар" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-surface-2">
                  <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">ID</th>
                  <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Товар</th>
                  <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Категория</th>
                  <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Цена</th>
                  <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Остаток</th>
                  <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-white/5 hover:bg-surface-2 transition-colors">
                    <td className="px-5 py-3 text-zinc-500 font-mono text-xs">#{p.id}</td>
                    <td className="px-5 py-3 text-white font-medium">{p.name}</td>
                    <td className="px-5 py-3"><span className="badge bg-surface-3 text-zinc-400">{p.category}</span></td>
                    <td className="px-5 py-3 text-white">${p.price.toFixed(2)}</td>
                    <td className="px-5 py-3 text-zinc-300">{p.stock}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-zinc-500 hover:text-accent-light hover:bg-accent/10 transition-all">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger/10 transition-all">
                          <Trash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface-1 rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{editId ? "Редактировать" : "Новый товар"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-surface-3 transition-all">
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mx-5 mt-4 bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg text-sm animate-fade-in">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Название</label>
                <input placeholder="Название товара" value={form.name} onChange={set("name")} className="input-field" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Описание</label>
                <textarea placeholder="Описание товара" value={form.description} onChange={set("description")} className="input-field" rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Цена ($)</label>
                  <input type="number" placeholder="0.00" value={form.price} onChange={set("price")} className="input-field" required min="0" step="0.01" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Остаток</label>
                  <input type="number" placeholder="0" value={form.stock} onChange={set("stock")} className="input-field" required min="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Категория</label>
                <select value={form.category} onChange={set("category")} className="input-field">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">URL изображения</label>
                <input placeholder="https://..." value={form.image} onChange={set("image")} className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? "Сохраняем..." : "Сохранить"}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
