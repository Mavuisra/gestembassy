import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Mail, Send } from "lucide-react";
import { boGet, boPatch } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import { PageHeader, Panel, StatusBadge, fieldClass, statusTone } from "./ui";

type Incident = {
 reference: string;
 category: string;
 priority: string;
 status: string;
 full_name: string;
 email: string;
 phone: string;
 description: string;
};

export function BackofficeIncidentDetailPage() {
 const { reference = "" } = useParams();
 const { token } = useStaffAuth();
 const [item, setItem] = useState<Incident | null>(null);
 const [status, setStatus] = useState("");
 const [priority, setPriority] = useState("");
 const [subject, setSubject] = useState("");
 const [body, setBody] = useState("");
 const [error, setError] = useState("");
 const [message, setMessage] = useState("");

 useEffect(() => {
 if (!token) return;
 boGet<Incident>(`/incidents/${reference}/`, token)
 .then((data) => {
 setItem(data);
 setStatus(data.status);
 setPriority(data.priority);
 setSubject(`Suivi incident ${data.reference}`);
 })
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
 }, [token, reference]);

 async function onSave() {
 if (!token) return;
 try {
 const updated = await boPatch<Incident>(`/incidents/${reference}/`, token, { status, priority });
 setItem({ ...item!, ...updated });
 setMessage("Incident mis à jour.");
 } catch (err) {
 setError(err instanceof Error ? err.message : "Erreur");
 }
 }

 function onMailto(event: FormEvent) {
 event.preventDefault();
 if (!item?.email) {
 setError("Aucun e-mail pour cet incident.");
 return;
 }
 const href = `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 window.location.href = href;
 setMessage("Client mail ouvert finalisez l’envoi depuis votre messagerie.");
 }

 return (
 <div>
 <p className="text-sm">
 <Link to="/backoffice/incidents" className="font-semibold text-navy underline">
 ← Incidents
 </Link>
 </p>
 <PageHeader
 title={reference}
 subtitle={item ? `${item.category} · ${item.full_name}` : "Chargement…"}
 actions={item ? <StatusBadge status={item.status} /> : null}
 />
 {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}
 {message ? <p className="mb-3 text-sm font-semibold text-emerald-700">{message}</p> : null}

 {item ? (
 <div className="grid gap-4 lg:grid-cols-2">
 <Panel title="Détail">
 <dl className="space-y-3 text-sm">
 <div>
 <dt className="text-[11px] font-bold uppercase text-muted">Personne</dt>
 <dd className="font-semibold text-navy">{item.full_name}</dd>
 </div>
 <div>
 <dt className="text-[11px] font-bold uppercase text-muted">Contact</dt>
 <dd>
 {item.email ? (
 <a href={`mailto:${item.email}`} className="text-navy underline">
 {item.email}
 </a>
 ) : (
 " "
 )}
 <span className="text-muted"> · {item.phone || "…"}</span>
 </dd>
 </div>
 <div>
 <dt className="text-[11px] font-bold uppercase text-muted">Priorité</dt>
 <dd>
 <span className={`inline-flex border px-2 py-0.5 text-[11px] font-bold uppercase ${statusTone(item.priority)}`}>
 {item.priority}
 </span>
 </dd>
 </div>
 <div>
 <dt className="text-[11px] font-bold uppercase text-muted">Description</dt>
 <dd className="mt-1 whitespace-pre-wrap text-ink">{item.description}</dd>
 </div>
 </dl>
 </Panel>

 <div className="space-y-4">
 <Panel title="Traitement">
 <label className="block text-sm font-semibold text-navy">
 Statut
 <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
 <option value="open">Ouvert</option>
 <option value="in_progress">En cours</option>
 <option value="waiting">En attente</option>
 <option value="closed">Clôturé</option>
 </select>
 </label>
 <label className="mt-3 block text-sm font-semibold text-navy">
 Priorité
 <select value={priority} onChange={(e) => setPriority(e.target.value)} className={fieldClass}>
 <option value="low">Basse</option>
 <option value="medium">Moyenne</option>
 <option value="high">Haute</option>
 <option value="critical">Critique</option>
 </select>
 </label>
 <button type="button" onClick={() => void onSave()} className="btn-navy mt-4 w-full">
 Enregistrer
 </button>
 </Panel>

 <Panel title="Suivi par e-mail" action={<Mail size={16} className="text-navy" />}>
 <form onSubmit={onMailto} className="space-y-3">
 <label className="block text-sm font-semibold text-navy">
 Objet
 <input value={subject} onChange={(e) => setSubject(e.target.value)} className={fieldClass} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 Message
 <textarea
 value={body}
 onChange={(e) => setBody(e.target.value)}
 rows={5}
 className={fieldClass}
 placeholder="Rédigez le message de suivi…"
 />
 </label>
 <button
 type="submit"
 className="inline-flex w-full items-center justify-center gap-2 bg-navy px-4 py-2.5 text-sm font-bold text-white"
 >
 <Send size={15} />
 Ouvrir le client mail
 </button>
 </form>
 </Panel>
 </div>
 </div>
 ) : null}
 </div>
 );
}
