import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiAuthGet } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

type CaseItem = {
 case_type: string;
 id: number;
 reference: string;
 status: string;
 title: string;
 created_at: string | null;
 detail_path?: string;
};

export function CasesPage() {
 const { t } = useTranslation();
 usePageTitle("cases.title");
 const { token, isAuthenticated } = useAuth();
 const [items, setItems] = useState<CaseItem[] | null>(null);
 const [error, setError] = useState("");

 useEffect(() => {
 if (!token) return;
 let cancelled = false;
 apiAuthGet<CaseItem[]>("/account/cases/", token)
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

 if (!isAuthenticated || !token) return <Navigate to="/compte/connexion" replace />;

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("cases.title")}
 subtitle={t("cases.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.dashboardTitle"), to: "/compte" },
 { label: t("cases.title") },
 ]}
 >
 {error ? <p className="text-sm text-rdc-red">{error}</p> : null}
 {items === null && !error ? <p className="text-sm text-muted">{t("common.loading")}</p> : null}
 {items && items.length === 0 ? (
 <p className="border border-line bg-white px-4 py-6 text-sm text-muted">{t("cases.empty")}</p>
 ) : null}
 {items && items.length > 0 ? (
 <ul className="divide-y divide-line border border-line bg-white">
 {items.map((item) => (
 <li key={`${item.case_type}-${item.reference}`} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
 <div>
 <p className="font-semibold text-navy">{item.reference}</p>
 <p className="mt-1 text-sm text-muted">
 {t(`cases.types.${item.case_type}`, { defaultValue: item.case_type })} ·{" "}
 {t(`cases.status.${item.status}`, { defaultValue: item.status })} · {item.title}
 </p>
 </div>
 {item.detail_path ? (
 <Link to={item.detail_path} className="text-sm font-semibold text-navy underline">
 {t("cases.view")}
 </Link>
 ) : null}
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
