import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, Search } from "lucide-react";
import { boGet } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import {
 PageHeader,
 Panel,
 StatusBadge,
 TYPE_LABELS,
 fieldClass,
 formatDate,
} from "./ui";

type CaseItem = {
 case_type: string;
 reference: string;
 status: string;
 title: string;
 applicant?: string;
 email?: string;
 created_at: string | null;
};

export function BackofficeRequestsPage() {
 const { token } = useStaffAuth();
 const [searchParams, setSearchParams] = useSearchParams();
 const [items, setItems] = useState<CaseItem[]>([]);
 const [type, setType] = useState(searchParams.get("type") || "");
 const [status, setStatus] = useState(searchParams.get("status") || "");
 const [q, setQ] = useState(searchParams.get("q") || "");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 setType(searchParams.get("type") || "");
 }, [searchParams]);

 useEffect(() => {
 if (!token) return;
 setLoading(true);
 const params = new URLSearchParams();
 if (type) params.set("type", type);
 if (status) params.set("status", status);
 if (q) params.set("q", q);
 const qs = params.toString();
 const next = new URLSearchParams();
 if (type) next.set("type", type);
 if (status) next.set("status", status);
 if (q) next.set("q", q);
 setSearchParams(next, { replace: true });
 boGet<CaseItem[]>(`/requests/${qs ? `?${qs}` : ""}`, token)
 .then(setItems)
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"))
 .finally(() => setLoading(false));
 }, [token, type, status, q, setSearchParams]);

 return (
 <div>
 <PageHeader
 title="Demandes"
 subtitle="File unifiée visa, passeport, état civil, enregistrement consulaire."
 />

 <Panel>
 <div className="flex flex-wrap gap-2">
 <select value={type} onChange={(e) => setType(e.target.value)} className={fieldClass + " mt-0 w-auto"}>
 <option value="">Tous les types</option>
 <option value="visa">Visa</option>
 <option value="passport">Passeport</option>
 <option value="civil">État civil</option>
 <option value="consular">Consulaire</option>
 </select>
 <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass + " mt-0 w-auto"}>
 <option value="">Tous les statuts</option>
 <option value="submitted">Soumis</option>
 <option value="under_review">En examen</option>
 <option value="needs_info">Complément</option>
 <option value="accepted">Accepté</option>
 <option value="rejected">Refusé</option>
 <option value="draft">Brouillon</option>
 </select>
 <div className="relative min-w-[220px] flex-1">
 <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
 <input
 value={q}
 onChange={(e) => setQ(e.target.value)}
 placeholder="Référence, nom, e-mail…"
 className={fieldClass + " mt-0 pl-9"}
 />
 </div>
 </div>
 </Panel>

 {error ? <p className="mt-3 text-sm text-rdc-red">{error}</p> : null}

 <Panel className="mt-4" title={`${items.length} dossier${items.length > 1 ? "s" : ""}`}>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[760px] text-left text-sm">
 <thead>
 <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
 <th className="pb-2 font-bold">Référence</th>
 <th className="pb-2 font-bold">Type</th>
 <th className="pb-2 font-bold">Objet</th>
 <th className="pb-2 font-bold">Demandeur</th>
 <th className="pb-2 font-bold">Statut</th>
 <th className="pb-2 font-bold">Reçu</th>
 <th className="pb-2 font-bold" />
 </tr>
 </thead>
 <tbody>
 {items.map((item) => (
 <tr
 key={`${item.case_type}-${item.reference}`}
 className="border-b border-line/70 transition hover:bg-blue-soft/40 last:border-0"
 >
 <td className="py-3 font-semibold text-navy">{item.reference}</td>
 <td className="py-3 text-muted">{TYPE_LABELS[item.case_type] ?? item.case_type}</td>
 <td className="py-3 text-ink">{item.title}</td>
 <td className="py-3">
 <div className="font-medium">{item.applicant || "…"}</div>
 <div className="flex items-center gap-1 text-xs text-muted">
 <Mail size={11} />
 {item.email || "…"}
 </div>
 </td>
 <td className="py-3">
 <StatusBadge status={item.status} />
 </td>
 <td className="py-3 text-xs text-muted">{formatDate(item.created_at)}</td>
 <td className="py-3 text-right">
 <Link
 to={`/backoffice/demandes/${item.case_type}/${item.reference}`}
 className="inline-flex border border-navy px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-navy hover:bg-navy hover:text-white"
 >
 Voir / répondre
 </Link>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {loading ? <p className="py-8 text-center text-sm text-muted">Chargement…</p> : null}
 {!loading && items.length === 0 ? (
 <p className="py-8 text-center text-sm text-muted">Aucun dossier pour ces filtres.</p>
 ) : null}
 </div>
 </Panel>
 </div>
 );
}
