import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
 apiAuthPost,
 apiAuthUpload,
 type VisaDocumentMeta,
 type VisaPreApplication,
} from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

const STEPS = [
 "type",
 "identity",
 "passport",
 "travel",
 "hosting",
 "documents",
 "review",
] as const;
type Step = (typeof STEPS)[number];

const VISA_TYPES = [
 "touristique",
 "affaires",
 "diplomatique",
 "officiel",
 "travail",
 "transit",
 "court-sejour",
 "long-sejour",
] as const;

const DOC_SLOTS = [
 { key: "passport", required: true },
 { key: "photo", required: true },
 { key: "invitation", required: false },
 { key: "flight_ticket", required: false },
 { key: "yellow_fever", required: false },
] as const;

const MAX_DOC_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = [".pdf", ".jpg", ".jpeg", ".png"];

type FormState = {
 visa_type: string;
 nom: string;
 post_nom: string;
 prenom: string;
 date_naissance: string;
 nationalite: string;
 sexe: string;
 email: string;
 telephone: string;
 passeport_numero: string;
 passeport_delivre_le: string;
 passeport_expire_le: string;
 passeport_delivre_par: string;
 date_entree_prevue: string;
 date_sortie_prevue: string;
 motif_voyage: string;
 lieu_destination: string;
 hebergement_type: string;
 hebergement_adresse: string;
 hebergement_contact: string;
 accept_conditions: boolean;
};

type UploadedMap = Partial<Record<(typeof DOC_SLOTS)[number]["key"], VisaDocumentMeta>>;

export function VisaPreApplicationPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("visaPre.formTitle");
 const { user, token, isAuthenticated } = useAuth();
 const navigate = useNavigate();
 const [stepIndex, setStepIndex] = useState(0);
 const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
 const [error, setError] = useState("");
 const [draftRef, setDraftRef] = useState<string | null>(null);
 const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
 const [uploaded, setUploaded] = useState<UploadedMap>({});
 const [form, setForm] = useState<FormState>(() => ({
 visa_type: "touristique",
 nom: user?.nom ?? "",
 post_nom: user?.post_nom ?? "",
 prenom: user?.prenom ?? "",
 date_naissance: "",
 nationalite: "",
 sexe: "M",
 email: user?.email ?? "",
 telephone: user?.telephone ?? "",
 passeport_numero: "",
 passeport_delivre_le: "",
 passeport_expire_le: "",
 passeport_delivre_par: "",
 date_entree_prevue: "",
 date_sortie_prevue: "",
 motif_voyage: "",
 lieu_destination: "",
 hebergement_type: "",
 hebergement_adresse: "",
 hebergement_contact: "",
 accept_conditions: false,
 }));

 const field =
 "mt-1.5 w-full border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy";
 const step = STEPS[stepIndex] as Step;
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const stepLabel = useMemo(() => t(`visaPre.steps.${step}`), [step, t]);

 if (!isAuthenticated || !user || !token) {
 return <Navigate to="/compte/connexion" replace />;
 }

 function set<K extends keyof FormState>(key: K, value: FormState[K]) {
 setForm((prev) => ({ ...prev, [key]: value }));
 }

 function validateFile(file: File): string | null {
 const lower = file.name.toLowerCase();
 if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
 return t("visaPre.errFileFormat");
 }
 if (file.size <= 0 || file.size > MAX_DOC_BYTES) {
 return t("visaPre.errFileSize");
 }
 return null;
 }

 function validateStep(): string | null {
 if (step === "type" && !form.visa_type) return t("visaPre.errType");
 if (step === "identity") {
 if (!form.nom.trim() || !form.post_nom.trim() || !form.prenom.trim()) return t("visaPre.errRequired");
 if (!form.date_naissance || !form.nationalite.trim() || !form.telephone.trim()) {
 return t("visaPre.errRequired");
 }
 }
 if (step === "passport") {
 if (
 !form.passeport_numero.trim() ||
 !form.passeport_delivre_le ||
 !form.passeport_expire_le ||
 !form.passeport_delivre_par.trim()
 ) {
 return t("visaPre.errRequired");
 }
 }
 if (step === "travel") {
 if (
 !form.date_entree_prevue ||
 !form.date_sortie_prevue ||
 !form.motif_voyage.trim() ||
 !form.lieu_destination.trim()
 ) {
 return t("visaPre.errRequired");
 }
 }
 if (step === "hosting") {
 if (
 !form.hebergement_type.trim() ||
 !form.hebergement_adresse.trim() ||
 !form.hebergement_contact.trim()
 ) {
 return t("visaPre.errRequired");
 }
 }
 if (step === "documents") {
 const missing = DOC_SLOTS.filter((d) => d.required && !uploaded[d.key]);
 if (missing.length) return t("visaPre.errDocsRequired");
 }
 if (step === "review" && !form.accept_conditions) return t("visaPre.errAccept");
 return null;
 }

 async function ensureDraft(): Promise<string> {
 if (draftRef) return draftRef;
 const created = await apiAuthPost<VisaPreApplication>("/account/visa-preapplications/", token!, {
 ...form,
 accept_conditions: false,
 locale,
 });
 setDraftRef(created.reference);
 return created.reference;
 }

 async function goNext() {
 const msg = validateStep();
 if (msg) {
 setError(msg);
 return;
 }
 setError("");
 if (step === "hosting") {
 setStatus("loading");
 try {
 await ensureDraft();
 setStatus("idle");
 setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
 } catch (err) {
 setStatus("error");
 setError(err instanceof Error ? err.message : t("common.error"));
 }
 return;
 }
 setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
 }

 function goBack() {
 setError("");
 setStepIndex((i) => Math.max(i - 1, 0));
 }

 async function onUpload(docType: (typeof DOC_SLOTS)[number]["key"], file: File | null) {
 if (!file) return;
 const fileErr = validateFile(file);
 if (fileErr) {
 setError(fileErr);
 return;
 }
 setUploadingDoc(docType);
 setError("");
 try {
 const reference = await ensureDraft();
 const body = new FormData();
 body.append("doc_type", docType);
 body.append("file", file);
 const meta = await apiAuthUpload<VisaDocumentMeta>(
 `/account/visa-preapplications/${reference}/documents/`,
 token!,
 body,
 );
 setUploaded((prev) => ({ ...prev, [docType]: meta }));
 } catch (err) {
 setError(err instanceof Error ? err.message : t("common.error"));
 } finally {
 setUploadingDoc(null);
 }
 }

 async function onSubmit(event: FormEvent) {
 event.preventDefault();
 const msg = validateStep();
 if (msg) {
 setError(msg);
 return;
 }
 setStatus("loading");
 setError("");
 try {
 const reference = await ensureDraft();
 const finalized = await apiAuthPost<VisaPreApplication>(
 `/account/visa-preapplications/${reference}/submit/`,
 token!,
 { accept_conditions: true },
 );
 navigate(`/compte/visas/${finalized.reference}`, {
 replace: true,
 state: { justSubmitted: true, message: finalized.message },
 });
 } catch (err) {
 setStatus("error");
 setError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("visaPre.formTitle")}
 subtitle={t("visaPre.formIntro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.dashboardTitle"), to: "/compte" },
 { label: t("visaPre.listTitle"), to: "/compte/visas" },
 { label: t("visaPre.formTitle") },
 ]}
 >
 <p className="mb-4 border border-line bg-[rgba(74,143,212,0.06)] px-4 py-3 text-sm text-muted">
 {t("visaPre.disclaimer")}
 </p>

 <div className="mb-6 flex flex-wrap gap-2" aria-label={t("visaPre.progressLabel")}>
 {STEPS.map((s, i) => (
 <span
 key={s}
 className={`text-xs font-semibold ${
 i === stepIndex ? "text-navy underline" : i < stepIndex ? "text-navy" : "text-muted"
 }`}
 >
 {i + 1}. {t(`visaPre.steps.${s}`)}
 </span>
 ))}
 </div>

 <form
 onSubmit={step === "review" ? onSubmit : (e) => e.preventDefault()}
 className="border border-line bg-white p-5"
 noValidate
 >
 <h2 className="text-base font-bold text-navy">
 {t("visaPre.stepOf", { current: stepIndex + 1, total: STEPS.length, label: stepLabel })}
 </h2>
 {draftRef ? (
 <p className="mt-1 text-xs text-muted">
 {t("visaPre.draftRef", { reference: draftRef })}
 </p>
 ) : null}

 {step === "type" ? (
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("visaPre.visaType")}
 <select
 value={form.visa_type}
 onChange={(e) => set("visa_type", e.target.value)}
 className={field}
 >
 {VISA_TYPES.map((vt) => (
 <option key={vt} value={vt}>
 {t(`visaPre.types.${vt}`)}
 </option>
 ))}
 </select>
 </label>
 ) : null}

 {step === "identity" ? (
 <div className="mt-4 grid gap-4 sm:grid-cols-3">
 <label className="block text-sm font-semibold text-navy">
 {t("account.nom")}
 <input value={form.nom} onChange={(e) => set("nom", e.target.value)} className={field} required />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("account.postNom")}
 <input
 value={form.post_nom}
 onChange={(e) => set("post_nom", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("account.prenom")}
 <input
 value={form.prenom}
 onChange={(e) => set("prenom", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.dateNaissance")}
 <input
 type="date"
 value={form.date_naissance}
 onChange={(e) => set("date_naissance", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.nationalite")}
 <input
 value={form.nationalite}
 onChange={(e) => set("nationalite", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.sexe")}
 <select value={form.sexe} onChange={(e) => set("sexe", e.target.value)} className={field}>
 <option value="M">{t("visaPre.sexeM")}</option>
 <option value="F">{t("visaPre.sexeF")}</option>
 </select>
 </label>
 <label className="block text-sm font-semibold text-navy sm:col-span-2">
 {t("account.email")}
 <input
 type="email"
 value={form.email}
 onChange={(e) => set("email", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("account.telephone")}
 <input
 type="tel"
 value={form.telephone}
 onChange={(e) => set("telephone", e.target.value)}
 className={field}
 required
 />
 </label>
 </div>
 ) : null}

 {step === "passport" ? (
 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.passeportNumero")}
 <input
 value={form.passeport_numero}
 onChange={(e) => set("passeport_numero", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.passeportDelivrePar")}
 <input
 value={form.passeport_delivre_par}
 onChange={(e) => set("passeport_delivre_par", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.passeportDelivreLe")}
 <input
 type="date"
 value={form.passeport_delivre_le}
 onChange={(e) => set("passeport_delivre_le", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.passeportExpireLe")}
 <input
 type="date"
 value={form.passeport_expire_le}
 onChange={(e) => set("passeport_expire_le", e.target.value)}
 className={field}
 required
 />
 </label>
 </div>
 ) : null}

 {step === "travel" ? (
 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.dateEntree")}
 <input
 type="date"
 value={form.date_entree_prevue}
 onChange={(e) => set("date_entree_prevue", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.dateSortie")}
 <input
 type="date"
 value={form.date_sortie_prevue}
 onChange={(e) => set("date_sortie_prevue", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy sm:col-span-2">
 {t("visaPre.motif")}
 <input
 value={form.motif_voyage}
 onChange={(e) => set("motif_voyage", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy sm:col-span-2">
 {t("visaPre.destination")}
 <input
 value={form.lieu_destination}
 onChange={(e) => set("lieu_destination", e.target.value)}
 className={field}
 required
 />
 </label>
 </div>
 ) : null}

 {step === "hosting" ? (
 <div className="mt-4 grid gap-4">
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.hostType")}
 <input
 value={form.hebergement_type}
 onChange={(e) => set("hebergement_type", e.target.value)}
 className={field}
 placeholder={t("visaPre.hostTypeHint")}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.hostAddress")}
 <input
 value={form.hebergement_adresse}
 onChange={(e) => set("hebergement_adresse", e.target.value)}
 className={field}
 required
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.hostContact")}
 <input
 value={form.hebergement_contact}
 onChange={(e) => set("hebergement_contact", e.target.value)}
 className={field}
 required
 />
 </label>
 </div>
 ) : null}

 {step === "documents" ? (
 <div className="mt-4 space-y-4">
 <p className="text-sm text-muted">{t("visaPre.docsIntro")}</p>
 {DOC_SLOTS.map((slot) => {
 const meta = uploaded[slot.key];
 return (
 <label key={slot.key} className="block border border-line px-3 py-3 text-sm">
 <span className="font-semibold text-navy">
 {t(`visaPre.docTypes.${slot.key}`)}
 {slot.required ? ` (${t("visaPre.required")})` : ` (${t("visaPre.optional")})`}
 </span>
 <input
 type="file"
 accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
 className="mt-2 block w-full text-sm"
 disabled={uploadingDoc !== null || status === "loading"}
 onChange={(e) => onUpload(slot.key, e.target.files?.[0] ?? null)}
 />
 {uploadingDoc === slot.key ? (
 <p className="mt-1 text-xs text-muted">{t("common.loading")}</p>
 ) : null}
 {meta ? (
 <p className="mt-1 text-xs font-semibold text-navy">
 {t("visaPre.docUploaded", { name: meta.original_name })}
 </p>
 ) : null}
 </label>
 );
 })}
 </div>
 ) : null}

 {step === "review" ? (
 <div className="mt-4 space-y-3 text-sm">
 <dl className="grid gap-2 sm:grid-cols-2">
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.visaType")}</dt>
 <dd className="text-muted">{t(`visaPre.types.${form.visa_type}`)}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("account.fullName")}</dt>
 <dd className="text-muted">
 {form.nom} {form.post_nom} {form.prenom}
 </dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.passeportNumero")}</dt>
 <dd className="text-muted">{form.passeport_numero}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.destination")}</dt>
 <dd className="text-muted">{form.lieu_destination}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.dateEntree")}</dt>
 <dd className="text-muted">{form.date_entree_prevue}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.dateSortie")}</dt>
 <dd className="text-muted">{form.date_sortie_prevue}</dd>
 </div>
 </dl>
 <div>
 <p className="font-semibold text-navy">{t("visaPre.docsReviewTitle")}</p>
 <ul className="mt-1 list-disc pl-5 text-muted">
 {DOC_SLOTS.map((slot) => {
 const meta = uploaded[slot.key];
 return (
 <li key={slot.key}>
 {t(`visaPre.docTypes.${slot.key}`)}
 {meta ? ` ${meta.original_name}` : ` ${t("visaPre.docMissing")}`}
 </li>
 );
 })}
 </ul>
 </div>
 <label className="mt-4 flex items-start gap-2 text-sm text-navy">
 <input
 type="checkbox"
 checked={form.accept_conditions}
 onChange={(e) => set("accept_conditions", e.target.checked)}
 className="mt-1"
 />
 <span>{t("visaPre.acceptConditions")}</span>
 </label>
 </div>
 ) : null}

 {error ? <p className="mt-4 text-sm text-rdc-red">{error}</p> : null}

 <div className="mt-6 flex flex-wrap gap-3">
 {stepIndex > 0 ? (
 <button
 type="button"
 onClick={goBack}
 className="border border-line px-4 py-2.5 text-sm font-semibold text-navy"
 >
 {t("visaPre.back")}
 </button>
 ) : null}
 {step !== "review" ? (
 <button
 type="button"
 onClick={() => void goNext()}
 disabled={status === "loading" || uploadingDoc !== null}
 className="btn-navy disabled:opacity-60"
 >
 {status === "loading" ? t("common.loading") : t("visaPre.next")}
 </button>
 ) : (
 <button type="submit" disabled={status === "loading"} className="btn-navy disabled:opacity-60">
 {status === "loading" ? t("common.loading") : t("visaPre.submit")}
 </button>
 )}
 </div>
 </form>

 <p className="mt-6 text-sm">
 <Link to="/compte/visas" className="font-semibold text-navy underline">
 {t("visaPre.backToList")}
 </Link>
 </p>
 </PageShell>
 );
}
