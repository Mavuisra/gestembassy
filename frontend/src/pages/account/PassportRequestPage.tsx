import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiAuthPost } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

export function PassportRequestPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("passportReq.title");
 const { user, token, isAuthenticated } = useAuth();
 const navigate = useNavigate();
 const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
 const [error, setError] = useState("");
 const field =
 "mt-1.5 w-full border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy";
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";

 if (!isAuthenticated || !user || !token) return <Navigate to="/compte/connexion" replace />;

 async function onSubmit(event: FormEvent<HTMLFormElement>) {
 event.preventDefault();
 setStatus("loading");
 setError("");
 const form = new FormData(event.currentTarget);
 try {
 const created = await apiAuthPost<{ reference: string }>("/account/passport-requests/", token!, {
 request_kind: form.get("request_kind"),
 nom: form.get("nom"),
 post_nom: form.get("post_nom"),
 prenom: form.get("prenom"),
 date_naissance: form.get("date_naissance"),
 lieu_naissance: form.get("lieu_naissance"),
 numero_passeport_actuel: form.get("numero_passeport_actuel") || "",
 telephone: form.get("telephone"),
 email: form.get("email"),
 motif: form.get("motif"),
 locale,
 });
 navigate("/compte/dossiers", { replace: true, state: { justSubmitted: created.reference } });
 } catch (err) {
 setStatus("error");
 setError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("passportReq.title")}
 subtitle={t("passportReq.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.dashboardTitle"), to: "/compte" },
 { label: t("passportReq.title") },
 ]}
 >
 <p className="mb-4 border border-line bg-[rgba(74,143,212,0.06)] px-4 py-3 text-sm text-muted">
 {t("passportReq.disclaimer")}
 </p>
 <form onSubmit={onSubmit} className="border border-line bg-white p-5" noValidate>
 <label className="block text-sm font-semibold text-navy">
 {t("passportReq.kind")}
 <select name="request_kind" required defaultValue="renewal" className={field}>
 <option value="first">{t("passportReq.kinds.first")}</option>
 <option value="renewal">{t("passportReq.kinds.renewal")}</option>
 <option value="loss">{t("passportReq.kinds.loss")}</option>
 </select>
 </label>
 <div className="mt-4 grid gap-4 sm:grid-cols-3">
 <label className="block text-sm font-semibold text-navy">
 {t("account.nom")}
 <input name="nom" required defaultValue={user.nom} className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("account.postNom")}
 <input name="post_nom" required defaultValue={user.post_nom} className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("account.prenom")}
 <input name="prenom" required defaultValue={user.prenom} className={field} />
 </label>
 </div>
 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy">
 {t("visaPre.dateNaissance")}
 <input name="date_naissance" type="date" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("passportReq.lieuNaissance")}
 <input name="lieu_naissance" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("passportReq.currentPassport")}
 <input name="numero_passeport_actuel" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("account.telephone")}
 <input name="telephone" type="tel" required defaultValue={user.telephone} className={field} />
 </label>
 </div>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("account.email")}
 <input name="email" type="email" required defaultValue={user.email} className={field} />
 </label>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("passportReq.motif")}
 <input name="motif" required className={field} />
 </label>
 {error ? <p className="mt-4 text-sm text-rdc-red">{error}</p> : null}
 <button type="submit" disabled={status === "loading"} className="btn-navy mt-5 disabled:opacity-60">
 {status === "loading" ? t("common.loading") : t("passportReq.submit")}
 </button>
 </form>
 <p className="mt-6 text-sm">
 <Link to="/services/passeport" className="font-semibold text-navy underline">
 {t("passportReq.backToInfo")}
 </Link>
 </p>
 </PageShell>
 );
}
