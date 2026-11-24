import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiAuthPatch, apiAuthPost } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import type { AuthUser } from "../../shared/auth/authStorage";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

export function ProfilePage() {
 const { t, i18n } = useTranslation();
 usePageTitle("account.profileEditTitle");
 const { user, token, isAuthenticated, updateUser, logout } = useAuth();
 const navigate = useNavigate();
 const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
 const [pwdStatus, setPwdStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
 const [profileError, setProfileError] = useState("");
 const [pwdError, setPwdError] = useState("");
 const field =
 "mt-1.5 w-full border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy";

 if (!isAuthenticated || !user || !token) {
 return <Navigate to="/compte/connexion" replace />;
 }

 async function onProfileSubmit(event: FormEvent<HTMLFormElement>) {
 event.preventDefault();
 setProfileStatus("loading");
 setProfileError("");
 const form = new FormData(event.currentTarget);
 try {
 const updated = await apiAuthPatch<AuthUser>("/auth/me/", token!, {
 nom: form.get("nom"),
 post_nom: form.get("post_nom"),
 prenom: form.get("prenom"),
 telephone: form.get("telephone") || "",
 locale: form.get("locale") || "fr",
 });
 updateUser(updated);
 if (updated.locale) {
 await i18n.changeLanguage(updated.locale);
 }
 setProfileStatus("ok");
 } catch (err) {
 setProfileStatus("error");
 setProfileError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 async function onPasswordSubmit(event: FormEvent<HTMLFormElement>) {
 event.preventDefault();
 setPwdStatus("loading");
 setPwdError("");
 const form = new FormData(event.currentTarget);
 const newPassword = String(form.get("new_password") ?? "");
 const confirm = String(form.get("new_password_confirm") ?? "");
 if (newPassword !== confirm) {
 setPwdStatus("error");
 setPwdError(t("account.errPasswordMismatch"));
 return;
 }
 try {
 await apiAuthPost("/auth/password/", token!, {
 current_password: form.get("current_password"),
 new_password: newPassword,
 new_password_confirm: confirm,
 });
 setPwdStatus("ok");
 event.currentTarget.reset();
 // Tokens invalidés côté serveur reconnexion obligatoire.
 logout();
 navigate("/compte/connexion", { replace: true });
 } catch (err) {
 setPwdStatus("error");
 setPwdError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("account.profileEditTitle")}
 subtitle={t("account.profileEditIntro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.dashboardTitle"), to: "/compte" },
 { label: t("account.profileEditTitle") },
 ]}
 >
 <div className="grid gap-8 lg:grid-cols-2">
 <form onSubmit={onProfileSubmit} className="border border-line bg-white p-5" noValidate>
 <h2 className="text-base font-bold text-navy">{t("account.profileTitle")}</h2>
 <p className="mt-1 text-sm text-muted">{user.email}</p>
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
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("account.telephone")}
 <input name="telephone" type="tel" defaultValue={user.telephone} className={field} />
 </label>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("account.locale")}
 <select name="locale" defaultValue={user.locale} className={field}>
 <option value="fr">Français</option>
 <option value="en">English</option>
 <option value="ko">한국어</option>
 </select>
 </label>
 <button type="submit" disabled={profileStatus === "loading"} className="btn-navy mt-5 disabled:opacity-60">
 {profileStatus === "loading" ? t("common.loading") : t("account.saveProfile")}
 </button>
 {profileStatus === "ok" ? (
 <p className="mt-3 text-sm font-semibold text-navy">{t("account.profileSaved")}</p>
 ) : null}
 {profileStatus === "error" ? (
 <p className="mt-3 text-sm text-rdc-red">{profileError}</p>
 ) : null}
 </form>

 <form onSubmit={onPasswordSubmit} className="border border-line bg-white p-5" noValidate>
 <h2 className="text-base font-bold text-navy">{t("account.passwordTitle")}</h2>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("account.currentPassword")}
 <input name="current_password" type="password" required autoComplete="current-password" className={field} />
 </label>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("account.newPassword")}
 <input name="new_password" type="password" required minLength={8} autoComplete="new-password" className={field} />
 </label>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("account.passwordConfirm")}
 <input
 name="new_password_confirm"
 type="password"
 required
 minLength={8}
 autoComplete="new-password"
 className={field}
 />
 </label>
 <button type="submit" disabled={pwdStatus === "loading"} className="btn-navy mt-5 disabled:opacity-60">
 {pwdStatus === "loading" ? t("common.loading") : t("account.changePassword")}
 </button>
 {pwdStatus === "ok" ? (
 <p className="mt-3 text-sm font-semibold text-navy">{t("account.passwordChanged")}</p>
 ) : null}
 {pwdStatus === "error" ? <p className="mt-3 text-sm text-rdc-red">{pwdError}</p> : null}
 </form>
 </div>
 <p className="mt-6 text-sm">
 <Link to="/compte" className="font-semibold text-navy underline">
 {t("account.backToDashboard")}
 </Link>
 </p>
 </PageShell>
 );
}
