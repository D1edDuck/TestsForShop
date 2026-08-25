import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle } from "../components/Icons";

interface Toast {
  id: number;
  text: string;
  type: "success" | "error";
}

interface ToastCtx {
  show: (text: string, type?: "success" | "error") => void;
}

const Ctx = createContext<ToastCtx>({ show: () => {} });

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((text: string, type: "success" | "error" = "success") => {
    const id = ++nextId;
    setToasts((t) => [...t, { id, text, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border animate-fade-in backdrop-blur-md pointer-events-auto ${
              t.type === "success"
                ? "bg-success/10 border-success/20 text-success"
                : "bg-danger/10 border-danger/20 text-danger"
            }`}
          >
            <CheckCircle size={16} />
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
