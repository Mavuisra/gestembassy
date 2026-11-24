import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiAuthGet } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

export function AccountDashboardPage() {
 const { t } = useTranslation();
 usePageTitle("account.dashboardTitle");
 const { user, token, isAuthenticated, logout } = useAuth();
 const [unread, setUnread] = useState(0);

 useEffect(() => {
 if (!token) return;
 apiAuthGet<{ unread_count: number }>("/account/notifications/unread-count/", token)
 .then((d) => setUnread(d.unread_count))
 .catch(() => setUnread(0));
 }, [token]);

 if (!isAuthenticated || !user) {
 return <Navigate to="/compte/connexion" replace />;
 }

 const links = [
 { to: "/compte/dossiers", label: t("cases.title") },
 { to: "/compte/visas", label: t("visaPre.listTitle") },
 { to: "/compte/passeport", label: t("passportReq.title") },
 { to: "/compte/rendez-vous", label: t("appointments.title") },
 {
 to: "/compte/notifications",
 label:
 unread > 0
 ? `${t("notifications.title")} (${unread})`
 : t("notifications.title"),
 },
 { to: "/compte/historique", label: t("history.title") },
 { to: "/compte/profil", label: t("account.editProfile") },
 ];

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("account.dashboardTitle")}
 subtitle={t("account.dashboardIntro", { name: user.prenom })}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.dashboardTitle") },
 ]}
 >
 <div className="grid gap-4 md:grid-cols-2">
 <section className="border border-line bg-white p-5">
 <h2 className="text-base font-bold text-navy">{t("account.profileTitle")}</h2>
 <dl className="mt-4 space-y-2 text-sm">
 <div>
 <dt className="font-semibold text-navy">{t("account.fullName")}</dt>
 <dd className="text-muted">
 {user.nom} {user.post_nom} {user.prenom}
 </dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("account.email")}</dt>
 <dd className="text-muted">{user.email}</dd>
 </div>
 </dl>
 <button type="button" onClick={logout} className="mt-5 text-sm font-semibold text-rdc-red underline">
 {t("account.logout")}
 </button>
 </section>

 <section className="border border-line bg-[rgba(74,143,212,0.05)] p-5">
 <h2 className="text-base font-bold text-navy">{t("account.nextStepsTitle")}</h2>
 <ul className="mt-4 space-y-2 text-sm">
 {links.map((item) => (
 <li key={item.to}>
 <Link to={item.to} className="font-semibold text-navy hover:underline">
 {item.label}
 </Link>
 </li>
 ))}
 </ul>
 <p className="mt-4 text-sm text-muted">{t("account.formsReuseHint")}</p>
 <ul className="mt-2 space-y-1 text-sm">
 <li>
 <Link to="/services/enregistrement-consulaire" className="text-navy underline">
 {t("home.svc.card.title")}
 </Link>
 </li>
 <li>
 <Link to="/services/etat-civil" className="text-navy underline">
 {t("home.svc.civil.title")}
 </Link>
 </li>
 </ul>
 </section>
 </div>
 </PageShell>
 );
}
