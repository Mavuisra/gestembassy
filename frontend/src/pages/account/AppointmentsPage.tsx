import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiAuthGet, apiAuthPost } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

type Appointment = {
 id: number;
 reference: string;
 status: string;
 service_type: string;
 preferred_date: string;
 preferred_slot: string;
 notes: string;
 created_at: string | null;
};

export function AppointmentsPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("appointments.title");
 const { token, isAuthenticated } = useAuth();
 const [items, setItems] = useState<Appointment[] | null>(null);
 const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
 const [error, setError] = useState("");
 const field =
 "mt-1.5 w-full border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy";
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";

 function reload() {
 if (!token) return;
 apiAuthGet<Appointment[]>("/account/appointments/", token)
 .then(setItems)
 .catch((err) => setError(err instanceof Error ? err.message : t("common.error")));
 }

 useEffect(() => {
 reload();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [token]);

 if (!isAuthenticated || !token) return <Navigate to="/compte/connexion" replace />;

 async function onSubmit(event: FormEvent<HTMLFormElement>) {
 event.preventDefault();
 setStatus("loading");
 setError("");
 const form = new FormData(event.currentTarget);
 try {
 await apiAuthPost("/account/appointments/", token!, {
 service_type: form.get("service_type"),
 preferred_date: form.get("preferred_date"),
 preferred_slot: form.get("preferred_slot"),
 notes: form.get("notes") || "",
 related_case_reference: form.get("related_case_reference") || "",
 locale,
 });
 setStatus("ok");
 event.currentTarget.reset();
 reload();
 } catch (err) {
 setStatus("error");
 setError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("appointments.title")}
 subtitle={t("appointments.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.dashboardTitle"), to: "/compte" },
 { label: t("appointments.title") },
 ]}
 >
 <form onSubmit={onSubmit} className="mb-8 border border-line bg-white p-5" noValidate>
 <h2 className="text-base font-bold text-navy">{t("appointments.newTitle")}</h2>
 <div className="mt-4 grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy">
 {t("appointments.service")}
 <select name="service_type" required defaultValue="visa" className={field}>
 <option value="visa">{t("appointments.services.visa")}</option>
 <option value="passport">{t("appointments.services.passport")}</option>
 <option value="consular">{t("appointments.services.consular")}</option>
 <option value="civil">{t("appointments.services.civil")}</option>
 <option value="other">{t("appointments.services.other")}</option>
 </select>
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("appointments.date")}
 <input name="preferred_date" type="date" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("appointments.slot")}
 <select name="preferred_slot" required defaultValue="morning" className={field}>
 <option value="morning">{t("appointments.slots.morning")}</option>
 <option value="afternoon">{t("appointments.slots.afternoon")}</option>
 </select>
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("appointments.relatedRef")}
 <input name="related_case_reference" className={field} />
 </label>
 </div>
 <label className="mt-4 block text-sm font-semibold text-navy">
 {t("appointments.notes")}
 <input name="notes" className={field} />
 </label>
 {error ? <p className="mt-3 text-sm text-rdc-red">{error}</p> : null}
 {status === "ok" ? <p className="mt-3 text-sm font-semibold text-navy">{t("appointments.success")}</p> : null}
 <button type="submit" disabled={status === "loading"} className="btn-navy mt-4 disabled:opacity-60">
 {status === "loading" ? t("common.loading") : t("appointments.submit")}
 </button>
 </form>

 {items === null ? <p className="text-sm text-muted">{t("common.loading")}</p> : null}
 {items && items.length === 0 ? (
 <p className="text-sm text-muted">{t("appointments.empty")}</p>
 ) : null}
 {items && items.length > 0 ? (
 <ul className="divide-y divide-line border border-line bg-white">
 {items.map((item) => (
 <li key={item.reference} className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 text-sm">
 <div>
 <p className="font-semibold text-navy">{item.reference}</p>
 <p className="mt-1 text-muted">
 {t(`appointments.services.${item.service_type}`, { defaultValue: item.service_type })} ·{" "}
 {item.preferred_date} ·{" "}
 {t(`appointments.slots.${item.preferred_slot}`, { defaultValue: item.preferred_slot })} ·{" "}
 {t(`appointments.status.${item.status}`, { defaultValue: item.status })}
 </p>
 </div>
 <button
 type="button"
 className="text-xs font-bold uppercase tracking-wide text-navy underline"
 onClick={() => {
 const base = import.meta.env.VITE_API_BASE ?? "/api/v1";
 fetch(`${base}/account/appointments/${item.reference}/pdf/`, {
 headers: { Authorization: `Token ${token}` },
 })
 .then((r) => {
 if (!r.ok) throw new Error(t("common.error"));
 return r.blob();
 })
 .then((blob) => {
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = `convocation-${item.reference}.pdf`;
 a.click();
 URL.revokeObjectURL(url);
 })
 .catch((err) => setError(err instanceof Error ? err.message : t("common.error")));
 }}
 >
 {t("appointments.downloadPdf")}
 </button>
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
