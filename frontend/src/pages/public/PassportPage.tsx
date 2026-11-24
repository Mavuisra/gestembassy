import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BookOpen, CheckCircle2, ExternalLink, FileWarning } from "lucide-react";
import {
 PASSPORT_DOCS,
 PASSPORT_NATIONAL,
 PASSPORT_PORTALS,
 PASSPORT_STEPS,
 PASSPORT_TARIFF_SEOUL,
} from "../../shared/content/passport";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";
import { ProvisionalBadge } from "../../shared/ui/ProvisionalBadge";

export function PassportPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("passport.title");
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const pick = <T extends { fr: string; en: string; ko: string }>(row: T) =>
 locale === "ko" ? row.ko : locale === "en" ? row.en : row.fr;
 const nationalNotes =
 locale === "ko"
 ? PASSPORT_NATIONAL.notesKo
 : locale === "en"
 ? PASSPORT_NATIONAL.notesEn
 : PASSPORT_NATIONAL.notesFr;

 return (
 <PageShell
 eyebrow={t("passport.eyebrow")}
 title={t("passport.title")}
 subtitle={t("passport.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("services.title"), to: "/services" },
 { label: t("passport.title") },
 ]}
 >
 <section className="grid gap-4 sm:grid-cols-3">
 <div className="border border-line bg-[rgba(74,143,212,0.05)] p-5">
 <p className="text-xs font-bold uppercase tracking-wide text-muted">{t("passport.feeLabel")}</p>
 <p className="mt-2 text-2xl font-extrabold text-navy">{PASSPORT_TARIFF_SEOUL.amount}</p>
 <p className="mt-1 text-sm text-muted">
 {locale === "ko"
 ? PASSPORT_TARIFF_SEOUL.labelKo
 : locale === "en"
 ? PASSPORT_TARIFF_SEOUL.labelEn
 : PASSPORT_TARIFF_SEOUL.labelFr}
 </p>
 </div>
 <div className="border border-line bg-white p-5">
 <p className="text-xs font-bold uppercase tracking-wide text-muted">{t("passport.modeLabel")}</p>
 <p className="mt-2 text-lg font-bold text-navy">{t("passport.modeValue")}</p>
 <p className="mt-1 text-sm text-muted">{t("passport.modeHint")}</p>
 </div>
 <div className="border border-line bg-white p-5">
 <p className="text-xs font-bold uppercase tracking-wide text-muted">{t("passport.validityLabel")}</p>
 <p className="mt-2 text-lg font-bold text-navy">
 {locale === "ko"
 ? PASSPORT_NATIONAL.validityKo
 : locale === "en"
 ? PASSPORT_NATIONAL.validityEn
 : PASSPORT_NATIONAL.validityFr}
 </p>
 <p className="mt-1 text-sm text-muted">{t("passport.validityHint")}</p>
 </div>
 </section>

 <section className="mt-12">
 <h2 className="text-xl font-bold text-navy">{t("passport.docsTitle")}</h2>
 <p className="mt-2 max-w-3xl text-sm text-muted">{t("passport.docsIntro")}</p>
 <ol className="mt-6 space-y-3">
 {PASSPORT_DOCS.map((doc, index) => (
 <li key={doc.key} className="flex gap-3 border border-line bg-white px-4 py-3">
 <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-navy text-sm font-bold text-white">
 {index + 1}
 </span>
 <p className="text-sm leading-relaxed text-ink">{pick(doc)}</p>
 </li>
 ))}
 </ol>
 <p className="mt-4 text-xs text-muted">{t("passport.sourceSeoul")}</p>
 </section>

 <section className="mt-12">
 <h2 className="text-xl font-bold text-navy">{t("passport.stepsTitle")}</h2>
 <div className="mt-6 grid gap-4 md:grid-cols-2">
 {PASSPORT_STEPS.map((step, index) => (
 <article key={step.key} className="border border-line bg-white p-5">
 <div className="flex items-start gap-3">
 <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-navy text-sm font-bold text-navy">
 {index + 1}
 </span>
 <div>
 <h3 className="text-base font-bold text-navy">
 {locale === "ko" ? step.titleKo : locale === "en" ? step.titleEn : step.titleFr}
 </h3>
 <p className="mt-2 text-sm leading-relaxed text-muted">
 {locale === "ko" ? step.bodyKo : locale === "en" ? step.bodyEn : step.bodyFr}
 </p>
 </div>
 </div>
 </article>
 ))}
 </div>
 </section>

 <section className="mt-12 border border-line bg-[rgba(74,143,212,0.05)] p-5 md:p-6">
 <div className="flex flex-wrap items-center gap-2">
 <BookOpen className="text-navy" size={22} aria-hidden />
 <h2 className="text-xl font-bold text-navy">{t("passport.nationalTitle")}</h2>
 <ProvisionalBadge />
 </div>
 <p className="mt-3 text-sm leading-relaxed text-muted">{t("passport.nationalIntro")}</p>
 <dl className="mt-5 grid gap-3 sm:grid-cols-2">
 <div className="border border-line bg-white p-4">
 <dt className="text-xs font-bold uppercase tracking-wide text-muted">{t("passport.nationalFee")}</dt>
 <dd className="mt-1 text-lg font-extrabold text-navy">{PASSPORT_NATIONAL.fee}</dd>
 </div>
 <div className="border border-line bg-white p-4">
 <dt className="text-xs font-bold uppercase tracking-wide text-muted">{t("passport.nationalValidity")}</dt>
 <dd className="mt-1 text-lg font-extrabold text-navy">
 {locale === "ko"
 ? PASSPORT_NATIONAL.validityKo
 : locale === "en"
 ? PASSPORT_NATIONAL.validityEn
 : PASSPORT_NATIONAL.validityFr}
 </dd>
 </div>
 </dl>
 <p className="mt-4 text-sm text-ink">
 {locale === "ko"
 ? PASSPORT_NATIONAL.coexistenceKo
 : locale === "en"
 ? PASSPORT_NATIONAL.coexistenceEn
 : PASSPORT_NATIONAL.coexistenceFr}
 </p>
 <ul className="mt-4 space-y-2">
 {nationalNotes.map((note) => (
 <li key={note} className="flex gap-2 text-sm text-muted">
 <CheckCircle2 className="mt-0.5 shrink-0 text-navy" size={16} aria-hidden />
 <span>{note}</span>
 </li>
 ))}
 </ul>
 <div className="mt-5 flex flex-wrap gap-3">
 <a
 href={PASSPORT_PORTALS.national}
 target="_blank"
 rel="noopener noreferrer"
 className="btn-navy inline-flex items-center gap-2"
 >
 passeport.gouv.cd <ExternalLink size={14} aria-hidden />
 </a>
 <a
 href={PASSPORT_PORTALS.nif}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 border border-navy px-4 py-2.5 text-sm font-bold text-navy hover:bg-navy hover:text-white"
 >
 e-NIF <ExternalLink size={14} aria-hidden />
 </a>
 </div>
 <p className="mt-4 text-xs text-muted">{t("passport.sourceNational")}</p>
 </section>

 <section className="mt-12 flex gap-3 border border-line border-l-4 border-l-gold bg-white p-5">
 <FileWarning className="mt-0.5 shrink-0 text-navy" size={22} aria-hidden />
 <div>
 <h2 className="text-base font-bold text-navy">{t("passport.lossTitle")}</h2>
 <p className="mt-2 text-sm leading-relaxed text-muted">{t("passport.lossBody")}</p>
 <Link to="/assistance" className="mt-3 inline-block text-sm font-semibold text-navy underline">
 {t("nav.assistance")}
 </Link>
 </div>
 </section>

 <div className="mt-10 flex flex-wrap items-center gap-4 border border-line bg-[rgba(74,143,212,0.05)] px-4 py-4">
 <p className="flex-1 text-sm text-muted">{t("passport.preAppHint")}</p>
 <Link to="/compte/passeport" className="btn-navy shrink-0">
 {t("passportReq.title")}
 </Link>
 </div>

 <p className="mt-6 text-sm text-muted">
 {t("passport.contactHint")}{" "}
 <Link to="/contact" className="font-semibold text-navy underline">
 {t("nav.contact")}
 </Link>
 </p>
 </PageShell>
 );
}
