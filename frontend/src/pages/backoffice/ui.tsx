import type { ReactNode } from "react";

export const STATUS_LABELS: Record<string, string> = {
 draft: "Brouillon",
 submitted: "Soumis",
 under_review: "En examen",
 needs_info: "Complément",
 accepted: "Accepté",
 rejected: "Refusé",
 requested: "Demandé",
 confirmed: "Confirmé",
 cancelled: "Annulé",
 completed: "Honoré",
 open: "Ouvert",
 in_progress: "En cours",
 waiting: "En attente",
 closed: "Clôturé",
};

export const TYPE_LABELS: Record<string, string> = {
 visa: "Visa",
 passport: "Passeport",
 civil: "État civil",
 consular: "Consulaire",
};

export function statusTone(status: string): string {
 switch (status) {
 case "accepted":
 case "confirmed":
 case "completed":
 case "closed":
 return "bg-emerald-50 text-emerald-800 border-emerald-200";
 case "rejected":
 case "cancelled":
 return "bg-red-50 text-red-800 border-red-200";
 case "needs_info":
 case "waiting":
 return "bg-amber-50 text-amber-900 border-amber-200";
 case "under_review":
 case "in_progress":
 return "bg-sky-50 text-sky-900 border-sky-200";
 case "critical":
 case "high":
 return "bg-red-50 text-red-800 border-red-200";
 default:
 return "bg-slate-50 text-slate-700 border-slate-200";
 }
}

export function StatusBadge({ status }: { status: string }) {
 return (
 <span
 className={`inline-flex border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusTone(status)}`}
 >
 {STATUS_LABELS[status] ?? status}
 </span>
 );
}

export function PageHeader({
 title,
 subtitle,
 actions,
}: {
 title: string;
 subtitle?: string;
 actions?: ReactNode;
}) {
 return (
 <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
 <div>
 <h1 className="text-2xl font-extrabold tracking-tight text-navy">{title}</h1>
 {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
 </div>
 {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
 </div>
 );
}

export function Panel({
 title,
 children,
 action,
 className = "",
}: {
 title?: string;
 children: ReactNode;
 action?: ReactNode;
 className?: string;
}) {
 return (
 <section className={`bo-card ${className}`}>
 {title ? (
 <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
 <h2 className="text-sm font-bold uppercase tracking-wide text-navy">{title}</h2>
 {action}
 </div>
 ) : null}
 <div className="p-5">{children}</div>
 </section>
 );
}

export function KpiCard({
 label,
 value,
 hint,
 accent = "navy",
}: {
 label: string;
 value: number | string;
 hint?: string;
 accent?: "navy" | "gold" | "red" | "blue";
}) {
 const bar =
 accent === "gold"
 ? "bg-gold"
 : accent === "red"
 ? "bg-rdc-red"
 : accent === "blue"
 ? "bg-blue"
 : "bg-navy";
 return (
 <div className="relative overflow-hidden border border-line bg-white p-4 shadow-[0_1px_0_rgba(26,79,140,0.04)]">
 <div className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
 <p className="pl-2 text-[11px] font-bold uppercase tracking-wider text-muted">{label}</p>
 <p className="mt-2 pl-2 text-3xl font-extrabold tabular-nums text-navy">{value}</p>
 {hint ? <p className="mt-1 pl-2 text-xs text-muted">{hint}</p> : null}
 </div>
 );
}

export function formatDate(value?: string | null): string {
 if (!value) return "…";
 try {
 return new Date(value).toLocaleString("fr-FR", {
 day: "2-digit",
 month: "short",
 year: "numeric",
 hour: "2-digit",
 minute: "2-digit",
 });
 } catch {
 return value;
 }
}

export function formatDay(value?: string | null): string {
 if (!value) return "…";
 try {
 return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
 } catch {
 return value;
 }
}

export const fieldClass =
 "mt-1.5 w-full border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy";

export const CHART_COLORS = {
 navy: "#1a4f8c",
 blue: "#3d7ec4",
 gold: "#e8c84a",
 red: "#d45a68",
 muted: "#94a3b8",
 green: "#059669",
};
