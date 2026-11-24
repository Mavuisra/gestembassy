import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bell, CheckCheck } from "lucide-react";
import { apiAuthGet, apiAuthPost } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

type NotificationItem = {
 id: number;
 title: string;
 body: string;
 link: string;
 is_read: boolean;
 created_at: string | null;
};

export function NotificationsPage() {
 const { t } = useTranslation();
 usePageTitle("notifications.title");
 const { token, isAuthenticated } = useAuth();
 const [items, setItems] = useState<NotificationItem[] | null>(null);
 const [unread, setUnread] = useState(0);
 const [error, setError] = useState("");

 function reload() {
 if (!token) return;
 Promise.all([
 apiAuthGet<NotificationItem[]>("/account/notifications/", token),
 apiAuthGet<{ unread_count: number }>("/account/notifications/unread-count/", token),
 ])
 .then(([list, counts]) => {
 setItems(list);
 setUnread(counts.unread_count);
 })
 .catch((err) => setError(err instanceof Error ? err.message : t("common.error")));
 }

 useEffect(() => {
 reload();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [token]);

 if (!isAuthenticated || !token) return <Navigate to="/compte/connexion" replace />;

 async function markRead(id: number) {
 try {
 await apiAuthPost(`/account/notifications/${id}/read/`, token!, {});
 reload();
 } catch (err) {
 setError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 async function markAll() {
 try {
 await apiAuthPost("/account/notifications/read-all/", token!, {});
 reload();
 } catch (err) {
 setError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("notifications.title")}
 subtitle={t("notifications.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.dashboardTitle"), to: "/compte" },
 { label: t("notifications.title") },
 ]}
 >
 <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
 <p className="inline-flex items-center gap-2 text-sm text-muted">
 <Bell size={16} className="text-navy" />
 {t("notifications.unreadCount", { count: unread })}
 </p>
 {unread > 0 ? (
 <button
 type="button"
 onClick={() => void markAll()}
 className="inline-flex items-center gap-2 border border-line bg-white px-3 py-2 text-xs font-bold uppercase tracking-wide text-navy"
 >
 <CheckCheck size={14} />
 {t("notifications.markAllRead")}
 </button>
 ) : null}
 </div>

 {error ? <p className="text-sm text-rdc-red">{error}</p> : null}
 {items === null && !error ? <p className="text-sm text-muted">{t("common.loading")}</p> : null}
 {items && items.length === 0 ? (
 <p className="border border-line bg-white px-4 py-6 text-sm text-muted">{t("notifications.empty")}</p>
 ) : null}
 {items && items.length > 0 ? (
 <ul className="divide-y divide-line border border-line bg-white">
 {items.map((item) => (
 <li
 key={item.id}
 className={`px-4 py-4 ${item.is_read ? "opacity-70" : "border-l-4 border-l-navy bg-[rgba(74,143,212,0.04)]"}`}
 >
 <div className="flex flex-wrap items-start justify-between gap-2">
 <p className="font-semibold text-navy">{item.title}</p>
 {!item.is_read ? (
 <span className="text-[10px] font-bold uppercase tracking-wide text-navy">
 {t("notifications.unread")}
 </span>
 ) : null}
 </div>
 <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{item.body}</p>
 {item.created_at ? (
 <p className="mt-1 text-xs text-muted">{new Date(item.created_at).toLocaleString()}</p>
 ) : null}
 <div className="mt-2 flex flex-wrap gap-3 text-sm">
 {item.link ? (
 <Link to={item.link} className="font-semibold text-navy underline">
 {t("notifications.open")}
 </Link>
 ) : null}
 {!item.is_read ? (
 <button
 type="button"
 onClick={() => void markRead(item.id)}
 className="font-semibold text-navy underline"
 >
 {t("notifications.markRead")}
 </button>
 ) : null}
 </div>
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
