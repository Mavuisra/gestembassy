import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, Mail, Send } from "lucide-react";
import { boDocumentUrl, boGet, boPatch, boPost } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import {
 PageHeader,
 Panel,
 StatusBadge,
 TYPE_LABELS,
 fieldClass,
 formatDate,
} from "./ui";

type TimelineItem = {
 id: number | string;
 event_type: string;
 message: string;
 created_at: string | null;
 actor?: string | null;
};

type Detail = {
 case_type: string;
 reference: string;
 status: string;
 title?: string;
 nom?: string;
 post_nom?: string;
 prenom?: string;
 email?: string;
 telephone?: string;
 motif?: string;
 visa_type?: string;
 request_kind?: string;
 document_type?: string;
 passeport_numero?: string;
 nationalite?: string;
 date_naissance?: string;
 documents?: { id: number; doc_type: string; original_name: string; size_bytes?: number }[];
 timeline?: TimelineItem[];
 created_at?: string | null;
 updated_at?: string | null;
 [key: string]: unknown;
};

const STATUSES = ["submitted", "under_review", "needs_info", "accepted", "rejected"];

export function BackofficeRequestDetailPage() {
 const { caseType = "", reference = "" } = useParams();
 const { token } = useStaffAuth();
 const [item, setItem] = useState<Detail | null>(null);
 const [status, setStatus] = useState("");
 const [note, setNote] = useState("");
 const [subject, setSubject] = useState("");
 const [body, setBody] = useState("");
 const [alsoStatus, setAlsoStatus] = useState("");
 const [message, setMessage] = useState("");
 const [error, setError] = useState("");
 const [sending, setSending] = useState(false);

 function reload() {
 if (!token) return;
 boGet<Detail>(`/requests/${caseType}/${reference}/`, token)
 .then((data) => {
 setItem(data);
 setStatus(data.status);
 if (!subject) {
 setSubject(`Votre dossier ${data.reference}`);
 }
 })
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
 }

 useEffect(() => {
 reload();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [token, caseType, reference]);

 async function onSaveStatus() {
 if (!token) return;
 setMessage("");
 setError("");
 try {
 const updated = await boPatch<Detail>(`/requests/${caseType}/${reference}/status/`, token, {
 status,
 note,
 });
 setItem(updated);
 setMessage("Statut mis à jour.");
 setNote("");
 reload();
 } catch (err) {
 setError(err instanceof Error ? err.message : "Erreur");
 }
 }

 async function onReply(event: FormEvent) {
 event.preventDefault();
 if (!token) return;
 setSending(true);
 setMessage("");
 setError("");
 try {
 const result = await boPost<{
 sent: boolean;
 to: string;
 subject: string;
 request: Detail;
 }>(
 `/requests/${caseType}/${reference}/reply/`,
 {
 subject,
 body,
 also_set_status: alsoStatus || undefined,
 },
 token,
 );
 setItem(result.request);
 setMessage(`E-mail envoyé à ${result.to}.`);
 setBody("");
 setAlsoStatus("");
 reload();
 } catch (err) {
 setError(err instanceof Error ? err.message : "Erreur");
 } finally {
 setSending(false);
 }
 }

 function downloadDoc(doc: { id: number; original_name: string }) {
 if (!token) return;
 fetch(boDocumentUrl(doc.id), { headers: { Authorization: `Token ${token}` } })
 .then((r) => {
 if (!r.ok) throw new Error("Téléchargement impossible.");
 return r.blob();
 })
 .then((blob) => {
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = doc.original_name;
 a.click();
 URL.revokeObjectURL(url);
 })
 .catch(() => setError("Téléchargement impossible."));
 }

 const fullName = [item?.nom, item?.post_nom, item?.prenom].filter(Boolean).join(" ");

 return (
 <div>
 <p className="text-sm">
 <Link to="/backoffice/demandes" className="font-semibold text-navy underline">
 ← File des demandes
 </Link>
 </p>

 <PageHeader
 title={reference}
 subtitle={
 item
 ? `${TYPE_LABELS[item.case_type] ?? item.case_type} · ${item.title || item.visa_type || item.request_kind || item.document_type || ""}`
 : "Chargement du dossier…"
 }
 actions={item ? <StatusBadge status={item.status} /> : null}
 />

 {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}
 {message ? <p className="mb-3 text-sm font-semibold text-emerald-700">{message}</p> : null}

 {item ? (
 <div className="grid gap-4 xl:grid-cols-3">
 <div className="space-y-4 xl:col-span-2">
 <Panel title="Fiche demandeur">
 <dl className="grid gap-4 sm:grid-cols-2 text-sm">
 <div>
 <dt className="text-[11px] font-bold uppercase tracking-wide text-muted">Identité</dt>
 <dd className="mt-1 font-semibold text-navy">{fullName || "…"}</dd>
 </div>
 <div>
 <dt className="text-[11px] font-bold uppercase tracking-wide text-muted">E-mail</dt>
 <dd className="mt-1">
 <a href={`mailto:${item.email}`} className="font-semibold text-navy underline">
 {item.email}
 </a>
 </dd>
 </div>
 <div>
 <dt className="text-[11px] font-bold uppercase tracking-wide text-muted">Téléphone</dt>
 <dd className="mt-1 text-ink">{(item.telephone as string) || "…"}</dd>
 </div>
 <div>
 <dt className="text-[11px] font-bold uppercase tracking-wide text-muted">Créé le</dt>
 <dd className="mt-1 text-ink">{formatDate(item.created_at)}</dd>
 </div>
 {item.nationalite ? (
 <div>
 <dt className="text-[11px] font-bold uppercase tracking-wide text-muted">Nationalité</dt>
 <dd className="mt-1">{String(item.nationalite)}</dd>
 </div>
 ) : null}
 {item.passeport_numero ? (
 <div>
 <dt className="text-[11px] font-bold uppercase tracking-wide text-muted">Passeport</dt>
 <dd className="mt-1">{String(item.passeport_numero)}</dd>
 </div>
 ) : null}
 {item.motif ? (
 <div className="sm:col-span-2">
 <dt className="text-[11px] font-bold uppercase tracking-wide text-muted">Motif</dt>
 <dd className="mt-1 text-ink">{String(item.motif)}</dd>
 </div>
 ) : null}
 </dl>
 </Panel>

 {item.documents && item.documents.length > 0 ? (
 <Panel title="Pièces jointes">
 <ul className="space-y-2">
 {item.documents.map((d) => (
 <li
 key={d.id}
 className="flex flex-wrap items-center justify-between gap-2 border border-line px-3 py-2.5 text-sm"
 >
 <div>
 <p className="font-semibold text-navy">{d.doc_type}</p>
 <p className="text-xs text-muted">{d.original_name}</p>
 </div>
 <button
 type="button"
 onClick={() => downloadDoc(d)}
 className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy underline"
 >
 <Download size={14} />
 Télécharger
 </button>
 </li>
 ))}
 </ul>
 </Panel>
 ) : null}

 <Panel title="Historique / suivi">
 <ul className="space-y-3">
 {(item.timeline ?? []).map((e) => (
 <li key={String(e.id)} className="border-l-2 border-navy/30 pl-3 text-sm">
 <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
 {e.event_type}
 {e.actor ? ` · ${e.actor}` : ""} · {formatDate(e.created_at)}
 </p>
 <p className="mt-0.5 text-ink">{e.message}</p>
 </li>
 ))}
 {(item.timeline ?? []).length === 0 ? (
 <p className="text-sm text-muted">Aucun événement pour l’instant.</p>
 ) : null}
 </ul>
 </Panel>
 </div>

 <div className="space-y-4">
 <Panel title="Instruction du dossier">
 <label className="block text-sm font-semibold text-navy">
 Nouveau statut
 <select value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass}>
 {STATUSES.map((s) => (
 <option key={s} value={s}>
 {s}
 </option>
 ))}
 </select>
 </label>
 <label className="mt-3 block text-sm font-semibold text-navy">
 Note interne
 <textarea
 value={note}
 onChange={(e) => setNote(e.target.value)}
 rows={3}
 className={fieldClass}
 placeholder="Observation visible dans l’historique usager…"
 />
 </label>
 <button type="button" onClick={() => void onSaveStatus()} className="btn-navy mt-4 w-full">
 Enregistrer le statut
 </button>
 </Panel>

 <Panel
 title="Répondre par e-mail"
 action={<Mail size={16} className="text-navy" />}
 >
 <form onSubmit={onReply} className="space-y-3" noValidate>
 <p className="text-xs text-muted">
 Envoi direct à <strong className="text-navy">{item.email}</strong> (console en local / SMTP
 configuré en prod).
 </p>
 <label className="block text-sm font-semibold text-navy">
 Objet
 <input
 value={subject}
 onChange={(e) => setSubject(e.target.value)}
 required
 className={fieldClass}
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 Message
 <textarea
 value={body}
 onChange={(e) => setBody(e.target.value)}
 required
 rows={7}
 className={fieldClass}
 placeholder="Rédigez le message officiel…"
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 Après envoi, passer le statut à
 <select
 value={alsoStatus}
 onChange={(e) => setAlsoStatus(e.target.value)}
 className={fieldClass}
 >
 <option value="">Ne pas changer</option>
 <option value="under_review">En examen</option>
 <option value="needs_info">Complément demandé</option>
 <option value="accepted">Accepté</option>
 <option value="rejected">Refusé</option>
 </select>
 </label>
 <button
 type="submit"
 disabled={sending}
 className="inline-flex w-full items-center justify-center gap-2 bg-navy px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
 >
 <Send size={15} />
 {sending ? "Envoi…" : "Envoyer l’e-mail"}
 </button>
 </form>
 </Panel>
 </div>
 </div>
 ) : !error ? (
 <p className="text-sm text-muted">Chargement…</p>
 ) : null}
 </div>
 );
}
