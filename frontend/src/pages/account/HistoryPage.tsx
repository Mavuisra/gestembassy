import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiAuthGet } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

type HistoryItem = {
 id: number;
 case_type: string;
 case_reference: string;
 event_type: string;
 message: string;
 created_at: string | null;
};

export function HistoryPage() {
 const { t } = useTranslation();
 usePageTitle("history.title");
 const { token, isAuthenticated } = useAuth();
 const [items, setItems] = useState<HistoryItem[] | null>(null);
 const [error, setError] = useState("");

 useEffect(() => {
 if (!token) return;
 let cancelled = false;
 apiAuthGet<HistoryItem[]>("/account/history/", token)
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
 title={t("history.title")}
 subtitle={t("history.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.dashboardTitle"), to: "/compte" },
 { label: t("history.title") },
 ]}
 >
 {error ? <p className="text-sm text-rdc-red">{error}</p> : null}
 {items === null && !error ? <p className="text-sm text-muted">{t("common.loading")}</p> : null}
 {items && items.length === 0 ? (
 <p className="border border-line bg-white px-4 py-6 text-sm text-muted">{t("history.empty")}</p>
 ) : null}
 {items && items.length > 0 ? (
 <ul className="divide-y divide-line border border-line bg-white">
 {items.map((item) => (
 <li key={item.id} className="px-4 py-4 text-sm">
 <p className="font-semibold text-navy">
 {item.case_reference} · {item.event_type}
 </p>
 <p className="mt-1 text-muted">{item.message}</p>
 <p className="mt-1 text-xs text-muted">
 {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
 </p>
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
