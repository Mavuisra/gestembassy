import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
 ArrowRight,
 ArrowUpRight,
 BookOpen,
 FileText,
 Headphones,
 IdCard,
 Plane,
} from "lucide-react";
import { apiGet, isAbortError, type ServiceItem } from "../../shared/api/client";
import { useAbortableEffect } from "../../shared/hooks/useAbortableEffect";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";
import { ProvisionalBadge } from "../../shared/ui/ProvisionalBadge";

const ICONS: Record<string, typeof Plane> = {
 visas: Plane,
 passeport: BookOpen,
 "enregistrement-consulaire": IdCard,
 "etat-civil": FileText,
 assistance: Headphones,
};

export function ServicesPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("services.title");
 const [items, setItems] = useState<ServiceItem[]>([]);
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(true);

 useAbortableEffect(
 async (signal) => {
 setLoading(true);
 setError("");
 try {
 const data = await apiGet<ServiceItem[]>("/services/", i18n.language, signal);
 if (!signal.aborted) setItems(data);
 } catch (err) {
 if (!isAbortError(err)) setError(t("common.error"));
 } finally {
 if (!signal.aborted) setLoading(false);
 }
 },
 [i18n.language, t],
 );

 return (
 <PageShell
 eyebrow={t("services.eyebrow")}
 title={t("services.title")}
 subtitle={t("services.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("services.title") },
 ]}
 >
 {loading ? <p className="text-sm text-muted">{t("common.loading")}</p> : null}
 {error ? <p className="text-sm text-rdc-red">{error}</p> : null}

 {!loading && items.length === 0 && !error ? (
 <p className="text-sm text-muted">{t("services.empty")}</p>
 ) : null}

 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {items.map((item) => {
 const Icon = ICONS[item.slug] ?? FileText;
 const to = item.slug === "visas" ? "/visas" : item.slug === "assistance" ? "/assistance" : `/services/${item.slug}`;
 return (
 <Link key={item.slug} to={to} className="svc-card group">
 <div className="svc-card-icon">
 <Icon size={84} strokeWidth={1.15} aria-hidden />
 </div>
 <div className="svc-card-body">
 <div className="flex items-start justify-between gap-2">
 <h2 className="text-lg font-extrabold text-navy">{item.title}</h2>
 <ArrowUpRight size={20} className="svc-card-arrow mt-1 shrink-0 text-navy" />
 </div>
 {item.is_provisional ? (
 <span className="mt-2 inline-block">
 <ProvisionalBadge />
 </span>
 ) : null}
 <p>{item.summary}</p>
 {item.tariff_note ? (
 <p className="mt-3 text-xs font-semibold text-navy">{item.tariff_note}</p>
 ) : null}
 <span className="svc-card-more">
 {t("home.readMore")}
 <ArrowRight size={14} aria-hidden />
 </span>
 </div>
 </Link>
 );
 })}
 </div>

 <p className="mt-10 text-sm text-muted">
 {t("services.contactHint")}{" "}
 <Link to="/contact" className="font-semibold text-navy underline">
 {t("nav.contact")}
 </Link>
 </p>
 </PageShell>
 );
}
