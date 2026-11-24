import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertTriangle, FileText } from "lucide-react";
import {
 CIVIL_DOCUMENT_TYPES,
 CIVIL_SERVICES,
 CIVIL_SOURCE,
} from "../../shared/content/civilStatus";
import { apiAuthPost, apiPost } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";
import { ProvisionalBadge } from "../../shared/ui/ProvisionalBadge";

const ETAT_CIVIL = ["celibataire", "marie", "divorce", "veuf", "autre"] as const;

export function CivilStatusPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("civilStatus.title");
 const { token } = useAuth();
 const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
 const [error, setError] = useState("");
 const [selected, setSelected] = useState<string>("attestation_naissance");
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const field =
 "mt-1.5 w-full border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy";

 async function onSubmit(event: FormEvent<HTMLFormElement>) {
 event.preventDefault();
 setStatus("loading");
 setError("");
 const form = new FormData(event.currentTarget);
 const password = String(form.get("password") ?? "");
 const passwordConfirm = String(form.get("password_confirm") ?? "");
 if (password !== passwordConfirm) {
 setStatus("error");
 setError(t("civilStatus.errPasswordMismatch"));
 return;
 }
 try {
 const payload = {
 document_type: form.get("document_type"),
 nom: form.get("nom"),
 post_nom: form.get("post_nom"),
 prenom: form.get("prenom"),
 sexe: form.get("sexe"),
 etat_civil: form.get("etat_civil"),
 date_naissance: form.get("date_naissance"),
 lieu_naissance: form.get("lieu_naissance"),
 pays_naissance: form.get("pays_naissance"),
 nationalite: form.get("nationalite"),
 profession: form.get("profession"),
 numero_passeport: form.get("numero_passeport"),
 email: form.get("email"),
 telephone: form.get("telephone"),
 password,
 password_confirm: passwordConfirm,
 adresse_coree: form.get("adresse_coree"),
 adresse_rdc: form.get("adresse_rdc"),
 nom_pere: form.get("nom_pere"),
 prenom_pere: form.get("prenom_pere"),
 nom_mere: form.get("nom_mere"),
 prenom_mere: form.get("prenom_mere"),
 motif: form.get("motif"),
 locale: i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr",
 };
 if (token) {
 await apiAuthPost("/civil-status/", token, payload);
 } else {
 await apiPost("/civil-status/", payload);
 }
 setStatus("ok");
 event.currentTarget.reset();
 } catch (err) {
 setStatus("error");
 setError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 return (
 <PageShell
 eyebrow={t("civilStatus.eyebrow")}
 title={t("civilStatus.title")}
 subtitle={t("civilStatus.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("services.title"), to: "/services" },
 { label: t("civilStatus.title") },
 ]}
 >
 <section className="border border-line border-l-4 border-l-gold bg-[rgba(74,143,212,0.05)] p-5">
 <div className="flex gap-3">
 <AlertTriangle className="mt-0.5 shrink-0 text-navy" size={20} aria-hidden />
 <div>
 <h2 className="text-base font-bold text-navy">{t("civilStatus.laissezTitle")}</h2>
 <p className="mt-2 text-sm leading-relaxed text-muted">{t("civilStatus.laissezBody")}</p>
 </div>
 </div>
 </section>

 <section className="mt-12">
 <h2 className="text-xl font-bold text-navy">{t("civilStatus.catalogTitle")}</h2>
 <p className="mt-2 max-w-3xl text-sm text-muted">{t("civilStatus.catalogIntro")}</p>
 <div className="mt-6 grid gap-4 md:grid-cols-2">
 {CIVIL_SERVICES.map((svc) => {
 const title = locale === "ko" ? svc.titleKo : locale === "en" ? svc.titleEn : svc.titleFr;
 const body = locale === "ko" ? svc.bodyKo : locale === "en" ? svc.bodyEn : svc.bodyFr;
 const docs = locale === "ko" ? svc.docsKo : locale === "en" ? svc.docsEn : svc.docsFr;
 return (
 <article key={svc.key} className="border border-line bg-white p-5">
 <div className="flex items-start gap-2">
 <FileText className="mt-0.5 shrink-0 text-navy" size={18} aria-hidden />
 <div className="flex-1">
 <div className="flex flex-wrap items-center gap-2">
 <h3 className="text-base font-bold text-navy">{title}</h3>
 {svc.provisionalDocs ? <ProvisionalBadge /> : null}
 </div>
 <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
 <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
 {docs.map((d) => (
 <li key={d}>{d}</li>
 ))}
 </ul>
 <button
 type="button"
 className="mt-4 text-sm font-semibold text-navy underline"
 onClick={() => setSelected(svc.key)}
 >
 {t("civilStatus.chooseThis")}
 </button>
 </div>
 </div>
 </article>
 );
 })}
 </div>
 <p className="mt-4 text-xs text-muted">{t("civilStatus.source")}</p>
 </section>

 <section className="mt-12">
 <form onSubmit={onSubmit} className="border border-line bg-white p-5 md:p-6" noValidate>
 <h2 className="text-lg font-bold text-navy">{t("civilStatus.formTitle")}</h2>
 <p className="mt-1 text-sm text-muted">{t("civilStatus.formHint")}</p>

 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("civilStatus.sectionDocument")}
 </legend>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("civilStatus.documentType")}
 <select
 name="document_type"
 required
 className={field}
 value={selected}
 onChange={(e) => setSelected(e.target.value)}
 >
 {CIVIL_DOCUMENT_TYPES.map((key) => (
 <option key={key} value={key}>
 {t(`civilStatus.doc.${key}`)}
 </option>
 ))}
 </select>
 </label>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("civilStatus.motif")}
 <textarea
 name="motif"
 required
 minLength={20}
 rows={3}
 placeholder={t("civilStatus.motifPh")}
 className={field}
 />
 </label>
 </fieldset>

 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("civilStatus.sectionAccount")}
 </legend>
 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy sm:col-span-2">
 {t("civilStatus.email")}
 <input name="email" type="email" required autoComplete="email" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.password")}
 <input name="password" type="password" required minLength={8} autoComplete="new-password" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.passwordConfirm")}
 <input
 name="password_confirm"
 type="password"
 required
 minLength={8}
 autoComplete="new-password"
 className={field}
 />
 </label>
 </div>
 </fieldset>

 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("civilStatus.sectionIdentity")}
 </legend>
 <div className="mt-4 grid gap-4 sm:grid-cols-3">
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.nom")}
 <input name="nom" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.postNom")}
 <input name="post_nom" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.prenom")}
 <input name="prenom" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.sexe")}
 <select name="sexe" required className={field} defaultValue="M">
 <option value="M">{t("civilStatus.sexeM")}</option>
 <option value="F">{t("civilStatus.sexeF")}</option>
 </select>
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.etatCivil")}
 <select name="etat_civil" required className={field} defaultValue="celibataire">
 {ETAT_CIVIL.map((v) => (
 <option key={v} value={v}>
 {t(`civilStatus.etat.${v}`)}
 </option>
 ))}
 </select>
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.dateNaissance")}
 <input name="date_naissance" type="date" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.lieuNaissance")}
 <input name="lieu_naissance" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.paysNaissance")}
 <input name="pays_naissance" required defaultValue="République démocratique du Congo" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.nationalite")}
 <input name="nationalite" required defaultValue="Congolaise" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.profession")}
 <input name="profession" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.numeroPasseport")}
 <input name="numero_passeport" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.telephone")}
 <input name="telephone" type="tel" required className={field} />
 </label>
 </div>
 </fieldset>

 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("civilStatus.sectionAddress")}
 </legend>
 <div className="mt-4 grid gap-4">
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.adresseCoree")}
 <textarea name="adresse_coree" required rows={2} className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.adresseRdc")}
 <textarea name="adresse_rdc" required rows={2} className={field} />
 </label>
 </div>
 </fieldset>

 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("civilStatus.sectionParents")}
 </legend>
 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.nomPere")}
 <input name="nom_pere" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.prenomPere")}
 <input name="prenom_pere" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.nomMere")}
 <input name="nom_mere" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("civilStatus.prenomMere")}
 <input name="prenom_mere" required className={field} />
 </label>
 </div>
 </fieldset>

 <button type="submit" disabled={status === "loading"} className="btn-navy mt-8 disabled:opacity-60">
 {status === "loading" ? t("common.loading") : t("civilStatus.submit")}
 </button>

 <div role="status" aria-live="polite" className="mt-4">
 {status === "ok" ? (
 <p className="border border-navy/20 bg-[rgba(74,143,212,0.08)] px-3 py-2 text-sm font-semibold text-navy">
 {t("civilStatus.success")}
 </p>
 ) : null}
 {status === "error" ? (
 <p className="border border-rdc-red/30 bg-[#fff8f8] px-3 py-2 text-sm text-rdc-red">{error}</p>
 ) : null}
 </div>
 </form>
 </section>

 <p className="mt-8 text-sm text-muted">
 {t("civilStatus.contactHint")}{" "}
 <Link to="/contact" className="font-semibold text-navy underline">
 {t("nav.contact")}
 </Link>
 {" · "}
 <a href={CIVIL_SOURCE} target="_blank" rel="noopener noreferrer" className="font-semibold text-navy underline">
 {t("civilStatus.officialLink")}
 </a>
 </p>
 </PageShell>
 );
}
