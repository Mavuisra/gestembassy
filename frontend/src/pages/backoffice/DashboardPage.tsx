import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, FolderOpen } from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { boGet } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import { CHART_COLORS, STATUS_LABELS, TYPE_LABELS, formatDate, formatDay } from "./ui";

type Recent = {
  case_type: string;
  reference: string;
  status: string;
  title: string;
  applicant?: string;
  email?: string;
  created_at: string | null;
};

type Activity = {
  id: number;
  action: string;
  entity_type: string;
  entity_ref: string;
  created_at: string | null;
};

type Stats = {
  total_requests?: number;
  treated_total?: number;
  pending_total?: number;
  appointments_total?: number;
  appointments_upcoming: number;
  visa_pending: number;
  passport_pending: number;
  civil_pending?: number;
  consular_pending?: number;
  incidents_open?: number;
  by_type?: Record<string, number>;
  recent_requests?: Recent[];
  recent_activity?: Activity[];
  series?: {
    by_day: {
      day: string;
      visa: number;
      passport: number;
      civil: number;
      consular: number;
      count: number;
    }[];
  };
};

const PIE_COLORS = [CHART_COLORS.navy, "#f59e0b", "#10b981", "#8b5cf6"];

function actionLabel(action: string, entityType: string, ref: string): string {
  const map: Record<string, string> = {
    status_change: "Statut mis à jour",
    staff_email: "E-mail envoyé",
    staff_login: "Connexion agent",
    appointment_status: "Rendez-vous mis à jour",
    incident_create: "Incident créé",
    incident_update: "Incident mis à jour",
    document_download: "Document téléchargé",
    news_publish: "Actualité publiée",
  };
  return `${map[action] ?? action} · ${entityType} ${ref}`;
}

function pendingBadge(status: string): { label: string; className: string } {
  if (status === "needs_info") return { label: "Complément", className: "bo-chip bo-chip-amber" };
  if (status === "under_review") return { label: "En examen", className: "bo-chip bo-chip-blue" };
  if (status === "submitted") return { label: "Soumis", className: "bo-chip bo-chip-slate" };
  return { label: STATUS_LABELS[status] ?? status, className: "bo-chip bo-chip-slate" };
}

function actionCta(status: string): string {
  if (status === "needs_info") return "Vérifier";
  if (status === "under_review") return "Voir";
  return "Traiter";
}

export function BackofficeDashboardPage() {
  const { token, user } = useStaffAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    boGet<Stats>("/dashboard/", token)
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
  }, [token]);

  const total =
    stats?.total_requests ??
    (stats
      ? (stats.by_type?.visa ?? 0) +
        (stats.by_type?.passport ?? 0) +
        (stats.by_type?.civil ?? 0) +
        (stats.by_type?.consular ?? 0)
      : 0);
  const treated = stats?.treated_total ?? 0;
  const pending =
    stats?.pending_total ??
    (stats
      ? stats.visa_pending +
        stats.passport_pending +
        (stats.civil_pending ?? 0) +
        (stats.consular_pending ?? 0)
      : 0);
  const appointments = stats?.appointments_upcoming ?? 0;

  const lineData = useMemo(() => {
    const days = stats?.series?.by_day ?? [];
    return days.slice(-14).map((d) => ({
      label: formatDay(d.day),
      total: d.count,
      visa: d.visa,
      passport: d.passport,
    }));
  }, [stats]);

  const pieData = useMemo(() => {
    const by = stats?.by_type ?? {};
    const rows = [
      { name: "Visas", value: by.visa ?? 0 },
      { name: "Passeports", value: by.passport ?? 0 },
      { name: "État civil", value: by.civil ?? 0 },
      { name: "Consulaire", value: by.consular ?? 0 },
    ].filter((r) => r.value > 0);
    const sum = rows.reduce((a, b) => a + b.value, 0) || 1;
    return rows.map((r) => ({ ...r, pct: Math.round((r.value / sum) * 100) }));
  }, [stats]);

  const pendingRows = (stats?.recent_requests ?? []).filter((r) =>
    ["submitted", "under_review", "needs_info"].includes(r.status),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Tableau de bord</h1>
          <p className="mt-1 text-sm text-muted">
            Données issues de la base · {user?.display_name || user?.email || "Agent"}
            {user?.role ? ` · ${user.role}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/backoffice/demandes" className="btn-navy">
            Traiter les demandes
          </Link>
          <Link
            to="/backoffice/incidents"
            className="border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy"
          >
            Incidents{stats?.incidents_open ? ` (${stats.incidents_open})` : ""}
          </Link>
        </div>
      </div>

      {error ? <p className="text-sm text-rdc-red">{error}</p> : null}
      {!stats && !error ? <p className="text-sm text-muted">Chargement…</p> : null}

      {stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Demandes totales", value: total, icon: FolderOpen, tone: "blue" },
              { label: "Dossiers traités", value: treated, icon: CheckCircle2, tone: "green" },
              { label: "En attente", value: pending, icon: Clock3, tone: "orange" },
              { label: "RDV à venir", value: appointments, icon: CalendarDays, tone: "purple" },
            ].map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="bo-card p-4">
                  <div className={`bo-kpi-icon bo-kpi-${kpi.tone}`}>
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 text-3xl font-extrabold tabular-nums text-navy">{kpi.value}</p>
                  <p className="mt-1 text-sm font-medium text-muted">{kpi.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <section className="bo-card xl:col-span-2">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="text-sm font-bold text-navy">Entrées (14 jours)</h2>
              </div>
              <div className="h-72 p-4">
                {lineData.every((d) => d.total === 0) ? (
                  <p className="flex h-full items-center justify-center text-sm text-muted">
                    Aucune entrée sur la période.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e6ebf0" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7685" }} />
                      <YAxis allowDecimals={false} width={28} tick={{ fontSize: 11, fill: "#6b7685" }} />
                      <Tooltip contentStyle={{ borderRadius: 2, border: "1px solid #e6ebf0", fontSize: 12 }} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total"
                        stroke={CHART_COLORS.navy}
                        strokeWidth={2.5}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="visa"
                        name="Visa"
                        stroke={CHART_COLORS.blue}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="passport"
                        name="Passeport"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            <section className="bo-card">
              <div className="border-b border-line px-5 py-4">
                <h2 className="text-sm font-bold text-navy">Répartition par type</h2>
              </div>
              <div className="h-52 px-2 pt-2">
                {pieData.length === 0 ? (
                  <p className="flex h-full items-center justify-center text-sm text-muted">Aucune donnée.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={2}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 2, border: "1px solid #e6ebf0", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <ul className="space-y-2 px-5 pb-5 text-sm">
                {pieData.map((d, i) => (
                  <li key={d.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted">
                      <span className="inline-block h-2.5 w-2.5" style={{ background: PIE_COLORS[i] }} />
                      {d.name}
                    </span>
                    <span className="font-bold text-navy">
                      {d.value} <span className="font-medium text-muted">({d.pct}%)</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <section className="bo-card xl:col-span-1">
              <div className="border-b border-line px-5 py-4">
                <h2 className="text-sm font-bold text-navy">Journal récent</h2>
              </div>
              <ul className="divide-y divide-line">
                {(stats.recent_activity ?? []).slice(0, 8).map((a) => (
                  <li key={a.id} className="flex gap-3 px-5 py-3 text-sm">
                    <span className="mt-1 inline-block h-2 w-2 shrink-0 bg-blue" />
                    <div>
                      <p className="font-medium text-ink">
                        {actionLabel(a.action, a.entity_type, a.entity_ref)}
                      </p>
                      <p className="text-xs text-muted">{formatDate(a.created_at)}</p>
                    </div>
                  </li>
                ))}
                {(stats.recent_activity ?? []).length === 0 ? (
                  <li className="px-5 py-6 text-sm text-muted">Aucune activité enregistrée.</li>
                ) : null}
              </ul>
            </section>

            <section className="bo-card xl:col-span-2">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <h2 className="text-sm font-bold text-navy">Demandes en attente</h2>
                <Link
                  to="/backoffice/demandes"
                  className="text-xs font-bold uppercase tracking-wide text-navy underline"
                >
                  Voir tout
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
                      <th className="px-5 py-3 font-bold">Statut</th>
                      <th className="px-5 py-3 font-bold">Dossier</th>
                      <th className="px-5 py-3 font-bold">Date</th>
                      <th className="px-5 py-3 font-bold" />
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRows.slice(0, 8).map((item) => {
                      const badge = pendingBadge(item.status);
                      return (
                        <tr
                          key={`${item.case_type}-${item.reference}`}
                          className="border-b border-line/70 last:border-0"
                        >
                          <td className="px-5 py-3">
                            <span className={badge.className}>{badge.label}</span>
                          </td>
                          <td className="px-5 py-3">
                            <p className="font-semibold text-navy">{item.reference}</p>
                            <p className="text-xs text-muted">
                              {TYPE_LABELS[item.case_type] ?? item.case_type}
                              {item.applicant ? ` · ${item.applicant}` : ""}
                            </p>
                          </td>
                          <td className="px-5 py-3 text-xs text-muted">{formatDate(item.created_at)}</td>
                          <td className="px-5 py-3 text-right">
                            <Link
                              to={`/backoffice/demandes/${item.case_type}/${item.reference}`}
                              className="bo-btn-action"
                            >
                              {actionCta(item.status)}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {pendingRows.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-muted">Aucune demande en attente.</p>
                ) : null}
              </div>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}
