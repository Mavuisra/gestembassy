import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiPost } from "../../shared/api/client";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

export function RegisterPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("account.registerTitle");
 const navigate = useNavigate();
 const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
 const [error, setError] = useState("");
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
 setError(t("account.errPasswordMismatch"));
 return;
 }
 try {
 await apiPost("/auth/register/", {
 email: form.get("email"),
 password,
 password_confirm: passwordConfirm,
 nom: form.get("nom"),
 post_nom: form.get("post_nom"),
 prenom: form.get("prenom"),
 telephone: form.get("telephone") || "",
 locale: i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr",
 });
 setStatus("ok");
 setTimeout(() => navigate("/compte/connexion"), 1200);
 } catch (err) {
 setStatus("error");
 setError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("account.registerTitle")}
 subtitle={t("account.registerIntro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.registerTitle") },
 ]}
 >
 <form onSubmit={onSubmit} className="mx-auto max-w-xl border border-line bg-white p-5 md:p-6" noValidate>
 <div className="grid gap-4 sm:grid-cols-3">
 <label className="block text-sm font-semibold text-navy">
 {t("account.nom")}
 <input name="nom" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("account.postNom")}
 <input name="post_nom" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("account.prenom")}
 <input name="prenom" required className={field} />
 </label>
 </div>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("account.email")}
 <input name="email" type="email" required autoComplete="email" className={field} />
 </label>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("account.telephone")}
 <input name="telephone" type="tel" autoComplete="tel" className={field} />
 </label>
 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy">
 {t("account.password")}
 <input name="password" type="password" required minLength={8} autoComplete="new-password" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("account.passwordConfirm")}
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

 <button type="submit" disabled={status === "loading"} className="btn-navy mt-6 disabled:opacity-60">
 {status === "loading" ? t("common.loading") : t("account.registerSubmit")}
 </button>

 <div role="status" aria-live="polite" className="mt-4">
 {status === "ok" ? (
 <p className="border border-navy/20 bg-[rgba(74,143,212,0.08)] px-3 py-2 text-sm font-semibold text-navy">
 {t("account.registerSuccess")}
 </p>
 ) : null}
 {status === "error" ? (
 <p className="border border-rdc-red/30 bg-[#fff8f8] px-3 py-2 text-sm text-rdc-red">{error}</p>
 ) : null}
 </div>

 <p className="mt-6 text-sm text-muted">
 {t("account.haveAccount")}{" "}
 <Link to="/compte/connexion" className="font-semibold text-navy underline">
 {t("account.loginLink")}
 </Link>
 </p>
 </form>
 </PageShell>
 );
}
