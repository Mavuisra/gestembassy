import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, ExternalLink, GraduationCap } from "lucide-react";
import {
 SCHOLARSHIP_LINKS,
 SCHOLARSHIP_PROGRAMS,
 SCHOLARSHIP_STEPS,
} from "../../shared/content/scholarships";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";
import { ProvisionalBadge } from "../../shared/ui/ProvisionalBadge";

export function ScholarshipsPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("scholarships.title");
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const steps = SCHOLARSHIP_STEPS[locale];

 return (
 <PageShell
 eyebrow={t("scholarships.eyebrow")}
 title={t("scholarships.title")}
 subtitle={t("scholarships.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("scholarships.title") },
 ]}
 >
 <p className="mb-8 inline-flex items-center gap-2 text-sm text-muted">
 <ProvisionalBadge />
 <span>{t("scholarships.provisionalNote")}</span>
 </p>

 <section className="mb-12">
 <h2 className="text-xl font-bold text-navy">{t("scholarships.programs")}</h2>
 <p className="mt-2 max-w-3xl text-sm text-muted">{t("scholarships.programsIntro")}</p>
 <div className="mt-6 grid gap-4 lg:grid-cols-3">
 {SCHOLARSHIP_PROGRAMS.map((program) => (
 <article key={program.key} className="border border-line border-l-4 border-l-gold bg-white p-5">
 <div className="flex items-start gap-3">
 <div className="grid h-10 w-10 shrink-0 place-items-center bg-[rgba(74,143,212,0.1)] text-navy">
 <GraduationCap size={20} aria-hidden />
 </div>
 <div>
 <h3 className="text-base font-extrabold text-navy">
 {locale === "ko"
 ? program.titleKo
 : locale === "en"
 ? program.titleEn
 : program.titleFr}
 </h3>
 <p className="mt-2 text-sm leading-relaxed text-muted">
 {locale === "ko"
 ? program.bodyKo
 : locale === "en"
 ? program.bodyEn
 : program.bodyFr}
 </p>
 </div>
 </div>
 </article>
 ))}
 </div>
 </section>

 <section className="mb-12 border border-line bg-[rgba(74,143,212,0.05)] p-5 md:p-6">
 <h2 className="text-xl font-bold text-navy">{steps.title}</h2>
 <ol className="mt-5 list-decimal space-y-3 pl-5">
 {steps.items.map((item) => (
 <li key={item} className="text-sm leading-relaxed text-ink">
 {item}
 </li>
 ))}
 </ol>
 </section>

 <section className="mb-10">
 <h2 className="text-xl font-bold text-navy">{t("scholarships.linksTitle")}</h2>
 <ul className="mt-4 space-y-3">
 {(
 [
 { href: SCHOLARSHIP_LINKS.gks, label: t("scholarships.linkGks") },
 { href: SCHOLARSHIP_LINKS.studyInKorea, label: "Study in Korea" },
 { href: SCHOLARSHIP_LINKS.koicaCiat, label: t("scholarships.linkKoicaCiat") },
 { href: SCHOLARSHIP_LINKS.koica, label: "KOICA" },
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
 <Link
 to="/actualites"
 className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:underline"
 >
 {t("scholarships.linkNews")} <ArrowUpRight size={14} aria-hidden />
 </Link>
 </li>
 </ul>
 </section>

 <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
 <Link to="/contact" className="btn-navy">
 {t("scholarships.contactCta")} <ArrowUpRight size={16} />
 </Link>
 <p className="text-sm text-muted">{t("scholarships.contactHint")}</p>
 </div>

 <p className="mt-8 text-xs leading-relaxed text-muted">{t("scholarships.sources")}</p>
 </PageShell>
 );
}
