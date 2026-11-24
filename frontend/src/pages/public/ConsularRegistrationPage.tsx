import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CONSULAR_BENEFITS, CONSULAR_REG_SOURCE } from "../../shared/content/consularRegistration";
import { apiAuthPost, apiPost } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

const ETAT_CIVIL = ["celibataire", "marie", "divorce", "veuf", "autre"] as const;

export function ConsularRegistrationPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("consularReg.title");
 const { token } = useAuth();
 const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
 const [error, setError] = useState("");
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
 setError(t("consularReg.errPasswordMismatch"));
 return;
 }
 try {
 const payload = {
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
 adresse_rue: form.get("adresse_rue"),
 adresse_numero: form.get("adresse_numero"),
 ville: form.get("ville"),
 code_postal: form.get("code_postal"),
 type_sejour: form.get("type_sejour"),
 adresse_rdc: form.get("adresse_rdc"),
 nom_pere: form.get("nom_pere"),
 prenom_pere: form.get("prenom_pere"),
 nom_mere: form.get("nom_mere"),
 prenom_mere: form.get("prenom_mere"),
 contact_urgence_nom: form.get("contact_urgence_nom"),
 contact_urgence_telephone: form.get("contact_urgence_telephone"),
 contact_urgence_lien: form.get("contact_urgence_lien"),
 locale: i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr",
 };
 if (token) {
 await apiAuthPost("/consular-registration/", token, payload);
 } else {
 await apiPost("/consular-registration/", payload);
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
 eyebrow={t("consularReg.eyebrow")}
 title={t("consularReg.title")}
 subtitle={t("consularReg.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("services.title"), to: "/services" },
 { label: t("consularReg.title") },
 ]}
 >
 <div className="mb-8 grid gap-3 sm:grid-cols-3">
 <div className="border border-line bg-[rgba(74,143,212,0.05)] px-4 py-3 text-sm">
 <p className="font-bold text-navy">{t("consularReg.whoValue")}</p>
 <p className="mt-1 text-muted">{t("consularReg.whoHint")}</p>
 </div>
 <div className="border border-line px-4 py-3 text-sm">
 <p className="font-bold text-navy">{t("consularReg.modeValue")}</p>
 <p className="mt-1 text-muted">{t("consularReg.modeHint")}</p>
 </div>
 <div className="border border-line px-4 py-3 text-sm">
 <p className="font-bold text-navy">{t("consularReg.feeValue")}</p>
 <p className="mt-1 text-muted">{t("consularReg.feeHint")}</p>
 </div>
 </div>

 <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
 <form onSubmit={onSubmit} className="border border-line bg-white p-5 md:p-6" noValidate>
 <h2 className="text-lg font-bold text-navy">{t("consularReg.formTitle")}</h2>
 <p className="mt-1 text-sm text-muted">{t("consularReg.formHint")}</p>

 {/* Compte procédure Séoul */}
 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("consularReg.sectionAccount")}
 </legend>
 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy sm:col-span-2">
 {t("consularReg.email")}
 <input name="email" type="email" required autoComplete="email" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.password")}
 <input
 name="password"
 type="password"
 required
 minLength={8}
 autoComplete="new-password"
 className={field}
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.passwordConfirm")}
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

 {/* Identité */}
 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("consularReg.sectionIdentity")}
 </legend>
 <div className="mt-4 grid gap-4 sm:grid-cols-3">
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.nom")}
 <input name="nom" required autoComplete="family-name" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.postNom")}
 <input name="post_nom" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.prenom")}
 <input name="prenom" required autoComplete="given-name" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.sexe")}
 <select name="sexe" required className={field} defaultValue="M">
 <option value="M">{t("consularReg.sexeM")}</option>
 <option value="F">{t("consularReg.sexeF")}</option>
 </select>
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.etatCivil")}
 <select name="etat_civil" required className={field} defaultValue="celibataire">
 {ETAT_CIVIL.map((v) => (
 <option key={v} value={v}>
 {t(`consularReg.etat.${v}`)}
 </option>
 ))}
 </select>
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.dateNaissance")}
 <input name="date_naissance" type="date" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.lieuNaissance")}
 <input name="lieu_naissance" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.paysNaissance")}
 <input
 name="pays_naissance"
 required
 defaultValue="République démocratique du Congo"
 className={field}
 />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.nationalite")}
 <input name="nationalite" required defaultValue="Congolaise" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.profession")}
 <input name="profession" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy sm:col-span-2">
 {t("consularReg.numeroPasseport")}
 <input name="numero_passeport" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.telephone")}
 <input name="telephone" type="tel" required autoComplete="tel" className={field} />
 </label>
 </div>
 </fieldset>

 {/* Adresse Corée */}
 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("consularReg.sectionAddressKr")}
 </legend>
 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.adresseRue")}
 <input name="adresse_rue" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.adresseNumero")}
 <input name="adresse_numero" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.ville")}
 <input name="ville" required defaultValue="Séoul" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.codePostal")}
 <input name="code_postal" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy sm:col-span-2">
 {t("consularReg.typeSejour")}
 <input
 name="type_sejour"
 required
 placeholder={t("consularReg.typeSejourPh")}
 className={field}
 />
 </label>
 </div>
 </fieldset>

 {/* Adresse RDC */}
 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("consularReg.sectionAddressCdg")}
 </legend>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("consularReg.adresseRdc")}
 <textarea name="adresse_rdc" required rows={2} className={field} />
 </label>
 </fieldset>

 {/* Parents */}
 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("consularReg.sectionParents")}
 </legend>
 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.nomPere")}
 <input name="nom_pere" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.prenomPere")}
 <input name="prenom_pere" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.nomMere")}
 <input name="nom_mere" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.prenomMere")}
 <input name="prenom_mere" required className={field} />
 </label>
 </div>
 </fieldset>

 {/* Urgence */}
 <fieldset className="mt-8">
 <legend className="text-sm font-extrabold uppercase tracking-wide text-navy">
 {t("consularReg.sectionEmergency")}
 </legend>
 <div className="mt-4 grid gap-4 sm:grid-cols-3">
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.urgenceNom")}
 <input name="contact_urgence_nom" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.urgenceTel")}
 <input name="contact_urgence_telephone" type="tel" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("consularReg.urgenceLien")}
 <input name="contact_urgence_lien" required className={field} />
 </label>
 </div>
 </fieldset>

 <button type="submit" disabled={status === "loading"} className="btn-navy mt-8 disabled:opacity-60">
 {status === "loading" ? t("common.loading") : t("consularReg.submit")}
 </button>

 <div role="status" aria-live="polite" className="mt-4">
 {status === "ok" ? (
 <p className="border border-navy/20 bg-[rgba(74,143,212,0.08)] px-3 py-2 text-sm font-semibold text-navy">
 {t("consularReg.success")}
 </p>
 ) : null}
 {status === "error" ? (
 <p className="border border-rdc-red/30 bg-[#fff8f8] px-3 py-2 text-sm text-rdc-red">{error}</p>
 ) : null}
 </div>
 </form>

 <aside className="space-y-5">
 <div className="border border-line bg-[rgba(74,143,212,0.05)] p-5">
 <h2 className="text-base font-bold text-navy">{t("consularReg.whyTitle")}</h2>
 <ul className="mt-4 space-y-3">
 {CONSULAR_BENEFITS.slice(0, 4).map((item) => (
 <li key={item.key} className="text-sm text-muted">
 <span className="font-semibold text-navy">
 {locale === "ko" ? item.titleKo : locale === "en" ? item.titleEn : item.titleFr}
 {" "}
 </span>
 {locale === "ko" ? item.bodyKo : locale === "en" ? item.bodyEn : item.bodyFr}
 </li>
 ))}
 </ul>
 <p className="mt-4 text-xs text-muted">{t("consularReg.sourceSeoul")}</p>
 <a
 href={CONSULAR_REG_SOURCE}
 target="_blank"
 rel="noopener noreferrer"
 className="mt-3 inline-block text-sm font-semibold text-navy underline"
 >
 {t("consularReg.officialLink")}
 </a>
 </div>
 <div className="border border-line bg-white p-5">
 <h2 className="text-base font-bold text-navy">{t("consularReg.relatedTitle")}</h2>
 <ul className="mt-3 space-y-2 text-sm">
 <li>
 <Link to="/services/passeport" className="font-semibold text-navy hover:underline">
 {t("home.svc.passport.title")}
 </Link>
 </li>
 <li>
 <Link to="/assistance" className="font-semibold text-navy hover:underline">
 {t("nav.assistance")}
 </Link>
 </li>
 <li>
 <Link to="/contact" className="font-semibold text-navy hover:underline">
 {t("nav.contact")}
 </Link>
 </li>
 </ul>
 </div>
 </aside>
 </div>
 </PageShell>
 );
}
