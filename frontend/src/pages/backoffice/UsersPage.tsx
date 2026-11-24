import { useEffect, useMemo, useState } from "react";
import { Mail, Search } from "lucide-react";
import { boGet } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import { PageHeader, Panel, fieldClass, formatDate } from "./ui";

type Citizen = {
 id: number;
 email: string;
 nom: string;
 post_nom: string;
 prenom: string;
 telephone: string;
 locale?: string;
 created_at?: string | null;
};

export function BackofficeUsersPage() {
 const { token } = useStaffAuth();
 const [items, setItems] = useState<Citizen[]>([]);
 const [q, setQ] = useState("");
 const [error, setError] = useState("");

 useEffect(() => {
 if (!token) return;
 boGet<Citizen[]>("/users/", token)
 .then(setItems)
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
 }, [token]);

 const filtered = useMemo(() => {
 const needle = q.trim().toLowerCase();
 if (!needle) return items;
 return items.filter(
 (u) =>
 u.email?.toLowerCase().includes(needle) ||
 u.nom?.toLowerCase().includes(needle) ||
 u.prenom?.toLowerCase().includes(needle) ||
 u.telephone?.includes(needle),
 );
 }, [items, q]);

 return (
 <div>
 <PageHeader title="Usagers" subtitle="Comptes citoyens inscrits sur le portail." />
 {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}
 <Panel>
 <div className="relative max-w-md">
 <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
 <input
 value={q}
 onChange={(e) => setQ(e.target.value)}
 placeholder="Rechercher un usager…"
 className={fieldClass + " mt-0 pl-9"}
 />
 </div>
 </Panel>
 <Panel className="mt-4" title={`${filtered.length} usager${filtered.length > 1 ? "s" : ""}`}>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[680px] text-left text-sm">
 <thead>
 <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
 <th className="pb-2 font-bold">Identité</th>
 <th className="pb-2 font-bold">Contact</th>
 <th className="pb-2 font-bold">Langue</th>
 <th className="pb-2 font-bold">Inscription</th>
 <th className="pb-2 font-bold" />
 </tr>
 </thead>
 <tbody>
 {filtered.map((u) => (
 <tr key={u.id} className="border-b border-line/70 last:border-0">
 <td className="py-3 font-semibold text-navy">
 {u.nom} {u.post_nom} {u.prenom}
 </td>
 <td className="py-3">
 <div className="flex items-center gap-1 text-muted">
 <Mail size={12} />
 {u.email}
 </div>
 <div className="text-xs text-muted">{u.telephone || "…"}</div>
 </td>
 <td className="py-3 uppercase text-muted">{u.locale || "fr"}</td>
 <td className="py-3 text-xs text-muted">{formatDate(u.created_at)}</td>
 <td className="py-3 text-right">
 <a
 href={`mailto:${u.email}`}
 className="text-xs font-bold uppercase text-navy underline"
 >
 Contacter
 </a>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {filtered.length === 0 ? <p className="py-6 text-center text-sm text-muted">Aucun usager.</p> : null}
 </div>
 </Panel>
 </div>
 );
}
