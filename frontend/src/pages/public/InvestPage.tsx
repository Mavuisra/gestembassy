import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Building2, ExternalLink } from "lucide-react";
import {
 INVEST_INCENTIVES,
 INVEST_KOREA,
 INVEST_LINKS,
 INVEST_SECTORS,
} from "../../shared/content/invest";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

export function InvestPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("invest.title");
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const incentives = INVEST_INCENTIVES[locale];
 const korea = INVEST_KOREA[locale];

 return (
 <PageShell
 eyebrow={t("invest.eyebrow")}
 title={t("invest.title")}
 subtitle={t("invest.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("invest.title") },
 ]}
 >
 <section className="mb-12">
 <h2 className="text-xl font-bold text-navy">{t("invest.sectors")}</h2>
 <p className="mt-2 max-w-3xl text-sm text-muted">{t("invest.sectorsIntro")}</p>
 <div className="mt-6 grid gap-4 md:grid-cols-2">
 {INVEST_SECTORS.map((sector) => (
 <article
 key={sector.key}
 className="border border-line border-l-4 border-l-gold bg-white p-5"
 >
 <div className="flex items-start gap-3">
 <div className="grid h-10 w-10 shrink-0 place-items-center bg-[rgba(74,143,212,0.1)] text-navy">
 <Building2 size={20} aria-hidden />
 </div>
 <div>
 <h3 className="text-base font-extrabold text-navy">
 {locale === "ko"
 ? sector.titleKo
 : locale === "en"
 ? sector.titleEn
 : sector.titleFr}
 </h3>
 <p className="mt-2 text-sm leading-relaxed text-muted">
 {locale === "ko"
 ? sector.bodyKo
 : locale === "en"
 ? sector.bodyEn
 : sector.bodyFr}
 </p>
 </div>
 </div>
 </article>
 ))}
 </div>
 </section>

 <section className="mb-12 border border-line bg-[rgba(74,143,212,0.05)] p-5 md:p-6">
 <h2 className="text-xl font-bold text-navy">{korea.title}</h2>
 <p className="mt-3 text-sm leading-relaxed text-muted">{korea.body}</p>
 </section>

 <section className="mb-12">
 <h2 className="text-xl font-bold text-navy">{incentives.title}</h2>
 <p className="mt-2 text-sm text-muted">{t("invest.incentivesIntro")}</p>
 <ul className="mt-5 space-y-3">
 {incentives.items.map((item) => (
 <li
 key={item}
 className="border border-line bg-white px-4 py-3 text-sm leading-relaxed text-ink"
 >
 {item}
 </li>
 ))}
 </ul>
 <p className="mt-4 text-xs text-muted">{t("invest.incentivesNote")}</p>
 </section>

 <section className="mb-10">
 <h2 className="text-xl font-bold text-navy">{t("invest.linksTitle")}</h2>
 <ul className="mt-4 space-y-3">
 <li>
 <a
 href={INVEST_LINKS.anapi}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline"
 >
 ANAPI anapi.cd <ExternalLink size={14} aria-hidden />
 </a>
 </li>
 <li>
 <a
 href={INVEST_LINKS.anapiPotentialites}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline"
 >
 {t("invest.linkPotentialites")} <ExternalLink size={14} aria-hidden />
 </a>
 </li>
 </ul>
 </section>

 <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
 <Link to="/contact" className="btn-navy">
 {t("invest.contactCta")} <ArrowUpRight size={16} />
 </Link>
 <p className="text-sm text-muted">{t("invest.contactHint")}</p>
 </div>

 <p className="mt-8 text-xs leading-relaxed text-muted">{t("invest.sources")}</p>
 </PageShell>
 );
}
