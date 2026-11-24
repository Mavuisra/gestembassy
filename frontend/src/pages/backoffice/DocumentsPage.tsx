import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { boGet } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import { PageHeader, Panel, StatusBadge, TYPE_LABELS, formatDate } from "./ui";

type CaseItem = {
 case_type: string;
 reference: string;
 status: string;
 title: string;
 applicant?: string;
 created_at: string | null;
};

export function BackofficeDocumentsPage() {
 const { token } = useStaffAuth();
 const [items, setItems] = useState<CaseItem[]>([]);
 const [error, setError] = useState("");

 useEffect(() => {
 if (!token) return;
 boGet<CaseItem[]>("/requests/?type=visa", token)
 .then(setItems)
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
 }, [token]);

 return (
 <div>
 <PageHeader
 title="Documents"
 subtitle="Accès aux pièces via les dossiers visa ouverture du dossier pour télécharger."
 />
 {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}
 <Panel title="Dossiers avec pièces potentielles">
 <div className="overflow-x-auto">
 <table className="w-full min-w-[640px] text-left text-sm">
 <thead>
 <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
 <th className="pb-2 font-bold">Référence</th>
 <th className="pb-2 font-bold">Type</th>
 <th className="pb-2 font-bold">Demandeur</th>
 <th className="pb-2 font-bold">Statut</th>
 <th className="pb-2 font-bold">Date</th>
 <th className="pb-2 font-bold" />
 </tr>
 </thead>
 <tbody>
 {items.map((item) => (
 <tr key={item.reference} className="border-b border-line/70 last:border-0">
 <td className="py-3 font-semibold text-navy">
 <span className="inline-flex items-center gap-2">
 <FileText size={14} />
 {item.reference}
 </span>
 </td>
 <td className="py-3 text-muted">{TYPE_LABELS[item.case_type] ?? item.case_type}</td>
 <td className="py-3">{item.applicant || "…"}</td>
 <td className="py-3">
 <StatusBadge status={item.status} />
 </td>
 <td className="py-3 text-xs text-muted">{formatDate(item.created_at)}</td>
 <td className="py-3 text-right">
 <Link
 to={`/backoffice/demandes/${item.case_type}/${item.reference}`}
 className="text-xs font-bold uppercase text-navy underline"
 >
 Ouvrir pièces
 </Link>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {items.length === 0 ? <p className="py-6 text-center text-sm text-muted">Aucun dossier.</p> : null}
 </div>
 </Panel>
 </div>
 );
}
