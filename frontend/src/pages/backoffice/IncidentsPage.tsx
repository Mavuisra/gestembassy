import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { boGet, boPost } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import { PageHeader, Panel, StatusBadge, fieldClass, formatDate, statusTone } from "./ui";

type Incident = {
 reference: string;
 category: string;
 priority: string;
 status: string;
 full_name: string;
 email?: string;
 created_at: string | null;
};

export function BackofficeIncidentsPage() {
 const { token } = useStaffAuth();
 const [items, setItems] = useState<Incident[]>([]);
 const [error, setError] = useState("");
 const [openForm, setOpenForm] = useState(false);

 function reload() {
 if (!token) return;
 boGet<Incident[]>("/incidents/", token)
 .then(setItems)
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
 }

 useEffect(() => {
 reload();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [token]);

 async function onCreate(event: FormEvent<HTMLFormElement>) {
 event.preventDefault();
 if (!token) return;
 const form = new FormData(event.currentTarget);
 try {
 await boPost(
 "/incidents/",
 {
 category: form.get("category"),
 priority: form.get("priority"),
 full_name: form.get("full_name"),
 email: form.get("email") || "",
 phone: form.get("phone") || "",
 description: form.get("description"),
 },
 token,
 );
 event.currentTarget.reset();
 setOpenForm(false);
 reload();
 } catch (err) {
 setError(err instanceof Error ? err.message : "Erreur");
 }
 }

 return (
 <div>
 <PageHeader
 title="Incidents"
 subtitle="Assistance urgence et signalements citoyens."
 actions={
 <button
 type="button"
 className="btn-navy"
 onClick={() => setOpenForm((v) => !v)}
 >
 {openForm ? "Fermer" : "Nouveau signalement"}
 </button>
 }
 />
 {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}

 {openForm ? (
 <Panel title="Nouveau signalement" className="mb-4">
 <form onSubmit={onCreate} noValidate>
 <div className="grid gap-3 sm:grid-cols-2">
 <label className="text-sm font-semibold text-navy">
 Catégorie
 <select name="category" required className={fieldClass} defaultValue="other">
 <option value="arrest">Arrestation</option>
 <option value="passport_loss">Perte passeport</option>
 <option value="hospital">Hospitalisation</option>
 <option value="death">Décès</option>
 <option value="legal">Juridique</option>
 <option value="social">Sociale</option>
 <option value="other">Autre</option>
 </select>
 </label>
 <label className="text-sm font-semibold text-navy">
 Priorité
 <select name="priority" required className={fieldClass} defaultValue="medium">
 <option value="low">Basse</option>
 <option value="medium">Moyenne</option>
 <option value="high">Haute</option>
 <option value="critical">Critique</option>
 </select>
 </label>
 <label className="text-sm font-semibold text-navy">
 Nom
 <input name="full_name" required className={fieldClass} />
 </label>
 <label className="text-sm font-semibold text-navy">
 E-mail
 <input name="email" type="email" className={fieldClass} />
 </label>
 <label className="text-sm font-semibold text-navy sm:col-span-2">
 Description
 <textarea name="description" required rows={3} className={fieldClass} />
 </label>
 </div>
 <button type="submit" className="btn-navy mt-4">
 Enregistrer
 </button>
 </form>
 </Panel>
 ) : null}

 <Panel title={`${items.length} incident${items.length > 1 ? "s" : ""}`}>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[720px] text-left text-sm">
 <thead>
 <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
 <th className="pb-2 font-bold">Référence</th>
 <th className="pb-2 font-bold">Personne</th>
 <th className="pb-2 font-bold">Catégorie</th>
 <th className="pb-2 font-bold">Priorité</th>
 <th className="pb-2 font-bold">Statut</th>
 <th className="pb-2 font-bold">Créé</th>
 <th className="pb-2 font-bold" />
 </tr>
 </thead>
 <tbody>
 {items.map((i) => (
 <tr key={i.reference} className="border-b border-line/70 last:border-0">
 <td className="py-3 font-semibold text-navy">{i.reference}</td>
 <td className="py-3">
 <div>{i.full_name}</div>
 <div className="text-xs text-muted">{i.email || "…"}</div>
 </td>
 <td className="py-3 text-muted">{i.category}</td>
 <td className="py-3">
 <span className={`inline-flex border px-2 py-0.5 text-[11px] font-bold uppercase ${statusTone(i.priority)}`}>
 {i.priority}
 </span>
 </td>
 <td className="py-3">
 <StatusBadge status={i.status} />
 </td>
 <td className="py-3 text-xs text-muted">{formatDate(i.created_at)}</td>
 <td className="py-3 text-right">
 <Link
 to={`/backoffice/incidents/${i.reference}`}
 className="text-xs font-bold uppercase text-navy underline"
 >
 Ouvrir
 </Link>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {items.length === 0 ? <p className="py-6 text-center text-sm text-muted">Aucun incident.</p> : null}
 </div>
 </Panel>
 </div>
 );
}
