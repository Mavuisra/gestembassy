import { useEffect, useState } from "react";
import {
 Bar,
 BarChart,
 CartesianGrid,
 Legend,
 Line,
 LineChart,
 ResponsiveContainer,
 Tooltip,
 XAxis,
 YAxis,
} from "recharts";
import { boGet, boPatch } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import {
 CHART_COLORS,
 PageHeader,
 Panel,
 STATUS_LABELS,
 fieldClass,
 formatDate,
 formatDay,
} from "./ui";

type StatsData = {
 by_day: { day: string; visa: number; passport: number; civil: number; consular: number; count: number }[];
 visa_by_status: { status: string; count: number }[];
 passport_by_status: { status: string; count: number }[];
 civil_by_status?: { status: string; count: number }[];
 appointments_by_status?: { status: string; count: number }[];
 incidents_by_priority?: { priority: string; count: number }[];
};

export function BackofficeStatsPage() {
 const { token } = useStaffAuth();
 const [data, setData] = useState<StatsData | null>(null);
 const [error, setError] = useState("");

 useEffect(() => {
 if (!token) return;
 boGet<StatsData>("/stats/?days=14", token)
 .then(setData)
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
 }, [token]);

 const dayRows =
 data?.by_day.map((d) => ({
 ...d,
 label: formatDay(d.day),
 })) ?? [];

 return (
 <div>
 <PageHeader title="Statistiques" subtitle="Séries réelles sur les 14 derniers jours." />
 {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}
 {data ? (
 <div className="grid gap-4">
 <Panel title="Entrées quotidiennes par type">
 <div className="h-72">
 <ResponsiveContainer width="100%" height="100%">
 <LineChart data={dayRows}>
 <CartesianGrid strokeDasharray="3 3" stroke="#e6ebf0" />
 <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6b7685" }} />
 <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b7685" }} width={28} />
 <Tooltip contentStyle={{ border: "1px solid #e6ebf0", fontSize: 12 }} />
 <Legend />
 <Line type="monotone" dataKey="visa" name="Visa" stroke={CHART_COLORS.navy} strokeWidth={2} dot={false} />
 <Line type="monotone" dataKey="passport" name="Passeport" stroke={CHART_COLORS.blue} strokeWidth={2} dot={false} />
 <Line type="monotone" dataKey="civil" name="État civil" stroke={CHART_COLORS.gold} strokeWidth={2} dot={false} />
 <Line type="monotone" dataKey="consular" name="Consulaire" stroke={CHART_COLORS.red} strokeWidth={2} dot={false} />
 </LineChart>
 </ResponsiveContainer>
 </div>
 </Panel>

 <div className="grid gap-4 lg:grid-cols-2">
 <Panel title="Visas par statut">
 <div className="h-64">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart
 data={data.visa_by_status.map((r) => ({
 ...r,
 label: STATUS_LABELS[r.status] ?? r.status,
 }))}
 >
 <CartesianGrid strokeDasharray="3 3" stroke="#e6ebf0" />
 <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7685" }} />
 <YAxis allowDecimals={false} width={28} tick={{ fontSize: 11 }} />
 <Tooltip contentStyle={{ border: "1px solid #e6ebf0", fontSize: 12 }} />
 <Bar dataKey="count" name="Dossiers" fill={CHART_COLORS.navy} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </Panel>
 <Panel title="Passeports par statut">
 <div className="h-64">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart
 data={data.passport_by_status.map((r) => ({
 ...r,
 label: STATUS_LABELS[r.status] ?? r.status,
 }))}
 >
 <CartesianGrid strokeDasharray="3 3" stroke="#e6ebf0" />
 <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7685" }} />
 <YAxis allowDecimals={false} width={28} tick={{ fontSize: 11 }} />
 <Tooltip contentStyle={{ border: "1px solid #e6ebf0", fontSize: 12 }} />
 <Bar dataKey="count" name="Dossiers" fill={CHART_COLORS.blue} />
 </BarChart>
 </ResponsiveContainer>
 </div>
 </Panel>
 </div>
 </div>
 ) : !error ? (
 <p className="text-sm text-muted">Chargement…</p>
 ) : null}
 </div>
 );
}

export function BackofficeAuditPage() {
 const { token } = useStaffAuth();
 const [items, setItems] = useState<
 {
 id: number;
 action: string;
 entity_type: string;
 entity_ref: string;
 actor: string | null;
 created_at: string | null;
 after?: Record<string, unknown>;
 }[]
 >([]);
 const [error, setError] = useState("");

 useEffect(() => {
 if (!token) return;
 boGet<typeof items>("/audit/", token)
 .then(setItems)
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
 }, [token]);

 return (
 <div>
 <PageHeader title="Journal d'audit" subtitle="Actions agents tracées (connexion, statut, e-mails…)." />
 {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}
 <Panel>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[700px] text-left text-sm">
 <thead>
 <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
 <th className="pb-2 font-bold">Date</th>
 <th className="pb-2 font-bold">Action</th>
 <th className="pb-2 font-bold">Entité</th>
 <th className="pb-2 font-bold">Agent</th>
 <th className="pb-2 font-bold">Détail</th>
 </tr>
 </thead>
 <tbody>
 {items.map((a) => (
 <tr key={a.id} className="border-b border-line/70 last:border-0">
 <td className="py-3 text-xs text-muted">{formatDate(a.created_at)}</td>
 <td className="py-3 font-semibold text-navy">{a.action}</td>
 <td className="py-3">
 {a.entity_type}:{a.entity_ref}
 </td>
 <td className="py-3 text-muted">{a.actor || "…"}</td>
 <td className="py-3 text-xs text-muted">
 {a.after ? JSON.stringify(a.after).slice(0, 80) : " "}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {items.length === 0 ? <p className="py-6 text-center text-sm text-muted">Aucun événement.</p> : null}
 </div>
 </Panel>
 </div>
 );
}

export function BackofficeTeamPage() {
 const { token, user } = useStaffAuth();
 const [items, setItems] = useState<
 { user_id: number; email: string; display_name: string; role: string; is_active: boolean }[]
 >([]);
 const [error, setError] = useState("");

 function reload() {
 if (!token) return;
 boGet<typeof items>("/staff/", token)
 .then(setItems)
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
 }

 useEffect(() => {
 reload();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [token]);

 async function changeRole(userId: number, role: string) {
 if (!token) return;
 try {
 await boPatch("/staff/", token, { user_id: userId, role });
 reload();
 } catch (err) {
 setError(err instanceof Error ? err.message : "Erreur");
 }
 }

 if (user?.role !== "admin") {
 return <p className="text-sm text-rdc-red">Accès réservé aux administrateurs.</p>;
 }

 return (
 <div>
 <PageHeader title="Équipe" subtitle="Rôles et accès des agents." />
 {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}
 <Panel>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[560px] text-left text-sm">
 <thead>
 <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
 <th className="pb-2 font-bold">Agent</th>
 <th className="pb-2 font-bold">E-mail</th>
 <th className="pb-2 font-bold">Rôle</th>
 <th className="pb-2 font-bold">Actif</th>
 </tr>
 </thead>
 <tbody>
 {items.map((s) => (
 <tr key={s.user_id} className="border-b border-line/70 last:border-0">
 <td className="py-3 font-semibold text-navy">{s.display_name || s.email}</td>
 <td className="py-3 text-muted">{s.email}</td>
 <td className="py-3">
 <select
 value={s.role}
 onChange={(e) => void changeRole(s.user_id, e.target.value)}
 className={fieldClass + " mt-0 w-auto"}
 >
 <option value="admin">admin</option>
 <option value="consular">consular</option>
 <option value="comms">comms</option>
 <option value="assistance">assistance</option>
 </select>
 </td>
 <td className="py-3">{s.is_active ? "Oui" : "Non"}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </Panel>
 </div>
 );
}
