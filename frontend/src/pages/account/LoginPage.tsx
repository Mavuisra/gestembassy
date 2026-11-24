import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiPost } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import type { AuthUser } from "../../shared/auth/authStorage";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

type LoginResponse = AuthUser & { token: string };

export function LoginPage() {
 const { t } = useTranslation();
 usePageTitle("account.loginTitle");
 const navigate = useNavigate();
 const { login } = useAuth();
 const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
 const [error, setError] = useState("");
 const field =
 "mt-1.5 w-full border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy";

 async function onSubmit(event: FormEvent<HTMLFormElement>) {
 event.preventDefault();
 setStatus("loading");
 setError("");
 const form = new FormData(event.currentTarget);
 try {
 const data = await apiPost<LoginResponse>("/auth/login/", {
 email: form.get("email"),
 password: form.get("password"),
 });
 const { token, ...user } = data;
 login(token, user);
 navigate("/compte");
 } catch (err) {
 setStatus("error");
 setError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("account.loginTitle")}
 subtitle={t("account.loginIntro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.loginTitle") },
 ]}
 >
 <form onSubmit={onSubmit} className="mx-auto max-w-md border border-line bg-white p-5 md:p-6" noValidate>
 <label className="block text-sm font-semibold text-navy">
 {t("account.email")}
 <input name="email" type="email" required autoComplete="email" className={field} />
 </label>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("account.password")}
 <input name="password" type="password" required autoComplete="current-password" className={field} />
 </label>
 <button type="submit" disabled={status === "loading"} className="btn-navy mt-6 disabled:opacity-60">
 {status === "loading" ? t("common.loading") : t("account.loginSubmit")}
 </button>
 {status === "error" ? (
 <p className="mt-4 border border-rdc-red/30 bg-[#fff8f8] px-3 py-2 text-sm text-rdc-red" role="alert">
 {error}
 </p>
 ) : null}
 <p className="mt-6 text-sm text-muted">
 {t("account.noAccount")}{" "}
 <Link to="/compte/inscription" className="font-semibold text-navy underline">
 {t("account.registerLink")}
 </Link>
 </p>
 </form>
 </PageShell>
 );
}
