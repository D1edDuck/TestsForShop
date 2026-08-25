export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-20 ${className}`}>
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 border-2 border-accent/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-warning/15 text-warning",
    PROCESSING: "bg-blue-500/15 text-blue-400",
    SHIPPED: "bg-violet-500/15 text-violet-400",
    DELIVERED: "bg-success/15 text-success",
    CANCELLED: "bg-danger/15 text-danger",
  };
  return (
    <span className={`badge ${styles[status] || "bg-zinc-500/15 text-zinc-400"}`}>
      {status}
    </span>
  );
}

export function StatCard({ label, value, icon, color = "text-white" }: {
  label: string; value: string | number; icon?: React.ReactNode; color?: string;
}) {
  return (
    <div className="card p-5 group hover:border-accent/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        {icon && <div className="p-2.5 bg-accent/10 rounded-lg text-accent-light group-hover:bg-accent/20 transition-colors">{icon}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-surface-3 rounded-2xl flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m3.3 7 8.7 5 8.7-5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 22V12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-zinc-500 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
