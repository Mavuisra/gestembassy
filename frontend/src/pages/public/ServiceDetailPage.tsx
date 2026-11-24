import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiGet, isAbortError, type ServiceDetail } from "../../shared/api/client";
import { useAbortableEffect } from "../../shared/hooks/useAbortableEffect";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";
import { ProvisionalBadge } from "../../shared/ui/ProvisionalBadge";

export function ServiceDetailPage() {
 const { slug } = useParams();
 const { t, i18n } = useTranslation();
 const [item, setItem] = useState<ServiceDetail | null>(null);
 const [error, setError] = useState("");

 usePageTitle(item?.title ?? t("services.title"), { raw: Boolean(item?.title) });

 useAbortableEffect(
 async (signal) => {
 if (!slug) return;
 setItem(null);
 setError("");
 try {
 const data = await apiGet<ServiceDetail>(`/services/${slug}/`, i18n.language, signal);
 if (!signal.aborted) setItem(data);
 } catch (err) {
 if (!isAbortError(err)) setError(t("common.error"));
 }
 },
 [slug, i18n.language, t],
 );

 if (error) {
 return (
 <PageShell title={t("services.title")} crumbs={[{ label: t("nav.home"), to: "/" }, { label: t("services.title"), to: "/services" }]}>
 <p className="text-rdc-red">{error}</p>
 <Link to="/services" className="mt-4 inline-block text-sm font-semibold text-blue underline">
 {t("common.back")}
 </Link>
 </PageShell>
 );
 }

 if (!item) {
 return (
 <PageShell title={t("services.title")} crumbs={[{ label: t("nav.home"), to: "/" }, { label: t("services.title"), to: "/services" }]}>
 <p className="text-sm text-muted">{t("common.loading")}</p>
 </PageShell>
 );
 }

 return (
 <PageShell
 eyebrow={t("services.eyebrow")}
 title={item.title}
 subtitle={item.summary}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("services.title"), to: "/services" },
 { label: item.title },
 ]}
 >
 <div className="mb-4 flex items-center gap-2">
 {item.is_provisional ? <ProvisionalBadge /> : null}
 </div>

 <div className="grid gap-4 md:grid-cols-2">
 <section className="border border-line p-5">
 <h2 className="font-bold text-navy">{t("services.conditions")}</h2>
 <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{item.conditions}</p>
 </section>
 <section className="border border-line p-5">
 <h2 className="font-bold text-navy">{t("services.documents")}</h2>
 <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted">{item.documents}</p>
 </section>
 <section className="border border-line p-5">
 <h2 className="font-bold text-navy">{t("services.tariff")}</h2>
 <p className="mt-2 text-sm leading-relaxed text-muted">{item.tariff_note}</p>
 </section>
 <section className="border border-line p-5">
 <h2 className="font-bold text-navy">{t("services.delay")}</h2>
 <p className="mt-2 text-sm leading-relaxed text-muted">{item.delay_note}</p>
 </section>
 </div>

 {item.requires_account ? (
 <p className="mt-6 border-l-4 border-gold bg-paper px-4 py-3 text-sm text-navy">
 {t("services.accountRequired")}
 </p>
 ) : null}
 </PageShell>
 );
}
