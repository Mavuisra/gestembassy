import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, ExternalLink, Landmark, MapPinned, Trees } from "lucide-react";
import {
 TOURISM_HIGHLIGHTS,
 TOURISM_LINKS,
 TOURISM_PRACTICAL,
 UNESCO_SITES,
} from "../../shared/content/tourism";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";
import { ProvisionalBadge } from "../../shared/ui/ProvisionalBadge";

export function TourismPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("tourism.title");
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const practical = TOURISM_PRACTICAL[locale];

 return (
 <PageShell
 eyebrow={t("tourism.eyebrow")}
 title={t("tourism.title")}
 subtitle={t("tourism.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("tourism.title") },
 ]}
 >
 <p className="mb-8 inline-flex items-center gap-2 text-sm text-muted">
 <ProvisionalBadge />
 <span>{t("tourism.provisionalNote")}</span>
 </p>

 <section className="mb-12">
 <h2 className="text-xl font-bold text-navy">{t("tourism.unescoTitle")}</h2>
 <p className="mt-2 max-w-3xl text-sm text-muted">{t("tourism.unescoIntro")}</p>
 <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
 {UNESCO_SITES.map((site) => (
 <article key={site.key} className="border border-line border-l-4 border-l-rdc-red bg-white p-5">
 <div className="flex items-start gap-3">
 <div className="grid h-10 w-10 shrink-0 place-items-center bg-[rgba(206,16,37,0.08)] text-navy">
 <Trees size={20} aria-hidden />
 </div>
 <div>
 <p className="text-xs font-semibold uppercase tracking-wide text-muted">UNESCO {site.year}</p>
 <h3 className="mt-1 text-base font-extrabold text-navy">
 {locale === "ko" ? site.titleKo : locale === "en" ? site.titleEn : site.titleFr}
 </h3>
 <p className="mt-2 text-sm leading-relaxed text-muted">
 {locale === "ko" ? site.bodyKo : locale === "en" ? site.bodyEn : site.bodyFr}
 </p>
 </div>
 </div>
 </article>
 ))}
 </div>
 </section>

 <section className="mb-12">
 <h2 className="text-xl font-bold text-navy">{t("tourism.highlights")}</h2>
 <p className="mt-2 max-w-3xl text-sm text-muted">{t("tourism.highlightsIntro")}</p>
 <div className="mt-6 grid gap-4 md:grid-cols-2">
 {TOURISM_HIGHLIGHTS.map((item) => (
 <article key={item.key} className="border border-line border-l-4 border-l-gold bg-white p-5">
 <div className="flex items-start gap-3">
 <div className="grid h-10 w-10 shrink-0 place-items-center bg-[rgba(74,143,212,0.1)] text-navy">
 {item.key === "iccn" || item.key === "biodiversity" ? (
 <MapPinned size={20} aria-hidden />
 ) : (
 <Landmark size={20} aria-hidden />
 )}
 </div>
 <div>
 <h3 className="text-base font-extrabold text-navy">
 {locale === "ko" ? item.titleKo : locale === "en" ? item.titleEn : item.titleFr}
 </h3>
 <p className="mt-2 text-sm leading-relaxed text-muted">
 {locale === "ko" ? item.bodyKo : locale === "en" ? item.bodyEn : item.bodyFr}
 </p>
 </div>
 </div>
 </article>
 ))}
 </div>
 </section>

 <section className="mb-12 border border-line bg-[rgba(74,143,212,0.05)] p-5 md:p-6">
 <h2 className="text-xl font-bold text-navy">{practical.title}</h2>
 <ul className="mt-5 space-y-3">
 {practical.items.map((item) => (
 <li key={item} className="border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink">
 {item}
 </li>
 ))}
 </ul>
 </section>

 <section className="mb-10">
 <h2 className="text-xl font-bold text-navy">{t("tourism.linksTitle")}</h2>
 <ul className="mt-4 space-y-3">
 {(
 [
 { href: TOURISM_LINKS.evisa, label: t("tourism.linkEvisa") },
 { href: TOURISM_LINKS.ont, label: t("tourism.linkOnt") },
 { href: TOURISM_LINKS.iccn, label: t("tourism.linkIccn") },
 { href: TOURISM_LINKS.unesco, label: t("tourism.linkUnesco") },
 { href: TOURISM_LINKS.anapiTourism, label: t("tourism.linkAnapi") },
 ] as const
 ).map((link) => (
 <li key={link.href}>
 <a
 href={link.href}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline"
 >
 {link.label} <ExternalLink size={14} aria-hidden />
 </a>
 </li>
 ))}
 <li>
 <Link to="/visas" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline">
 {t("tourism.linkVisas")} <ArrowUpRight size={14} aria-hidden />
 </Link>
 </li>
 </ul>
 </section>

 <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
 <Link to="/contact" className="btn-navy">
 {t("tourism.contactCta")} <ArrowUpRight size={16} />
 </Link>
 <p className="text-sm text-muted">{t("tourism.contactHint")}</p>
 </div>

 <p className="mt-8 text-xs leading-relaxed text-muted">{t("tourism.sources")}</p>
 </PageShell>
 );
}
