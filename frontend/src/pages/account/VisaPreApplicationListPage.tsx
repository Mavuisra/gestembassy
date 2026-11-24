import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiAuthGet, type VisaPreApplication } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

export function VisaPreApplicationListPage() {
 const { t } = useTranslation();
 usePageTitle("visaPre.listTitle");
 const { token, isAuthenticated } = useAuth();
 const [items, setItems] = useState<VisaPreApplication[] | null>(null);
 const [error, setError] = useState("");

 useEffect(() => {
 if (!token) return;
 let cancelled = false;
 apiAuthGet<VisaPreApplication[]>("/account/visa-preapplications/", token)
 .then((data) => {
 if (!cancelled) setItems(data);
 })
 .catch((err) => {
 if (!cancelled) setError(err instanceof Error ? err.message : t("common.error"));
 });
 return () => {
 cancelled = true;
 };
 }, [token, t]);

 if (!isAuthenticated || !token) {
 return <Navigate to="/compte/connexion" replace />;
 }

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("visaPre.listTitle")}
 subtitle={t("visaPre.listIntro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.dashboardTitle"), to: "/compte" },
 { label: t("visaPre.listTitle") },
 ]}
 >
 <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
 <p className="text-sm text-muted">{t("visaPre.disclaimer")}</p>
 <Link to="/compte/visas/nouvelle" className="btn-navy shrink-0">
 {t("visaPre.newApplication")}
 </Link>
 </div>

 {error ? <p className="text-sm text-rdc-red">{error}</p> : null}
 {items === null && !error ? <p className="text-sm text-muted">{t("common.loading")}</p> : null}

 {items && items.length === 0 ? (
 <p className="border border-line bg-white px-4 py-6 text-sm text-muted">{t("visaPre.empty")}</p>
 ) : null}

 {items && items.length > 0 ? (
 <ul className="divide-y divide-line border border-line bg-white">
 {items.map((item) => (
 <li key={item.reference} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
 <div>
 <p className="font-semibold text-navy">{item.reference}</p>
 <p className="mt-1 text-sm text-muted">
 {t(`visaPre.types.${item.visa_type}`, { defaultValue: item.visa_type })} ·{" "}
 {t(`visaPre.status.${item.status}`, { defaultValue: item.status })}
 </p>
 <p className="text-xs text-muted">
 {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
 </p>
 </div>
 <Link
 to={`/compte/visas/${item.reference}`}
 className="text-sm font-semibold text-navy underline"
 >
 {t("visaPre.viewDetail")}
 </Link>
 </li>
 ))}
 </ul>
 ) : null}

 <p className="mt-6 text-sm">
 <Link to="/compte" className="font-semibold text-navy underline">
 {t("account.backToDashboard")}
 </Link>
 </p>
 </PageShell>
 );
}
