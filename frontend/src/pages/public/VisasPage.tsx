import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiGet, isAbortError, type VisaItem } from "../../shared/api/client";
import { EVISA, VISA_NOTES, VISA_TARIFFS_SEOUL } from "../../shared/content/visas";
import { useAbortableEffect } from "../../shared/hooks/useAbortableEffect";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";
import { ProvisionalBadge } from "../../shared/ui/ProvisionalBadge";

export function VisasPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("visas.title");
 const [items, setItems] = useState<VisaItem[]>([]);
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const notes = VISA_NOTES[locale];

 useAbortableEffect(
 async (signal) => {
 try {
 const data = await apiGet<VisaItem[]>("/visas/", i18n.language, signal);
 if (!signal.aborted) setItems(data);
 } catch (err) {
 if (!isAbortError(err)) setItems([]);
 }
 },
 [i18n.language],
 );

 return (
 <PageShell
 eyebrow={t("visas.eyebrow")}
 title={t("visas.title")}
 subtitle={t("visas.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("visas.title") },
 ]}
 >
 <section className="mb-10">
 <h2 className="text-xl font-bold text-navy">{t("visas.tariffsTitle")}</h2>
 <p className="mt-2 text-sm text-muted">{t("visas.tariffsIntro")}</p>
 <div className="mt-5 overflow-x-auto border border-line">
 <table className="w-full min-w-[640px] border-collapse text-left text-sm">
 <thead className="bg-[rgba(74,143,212,0.08)]">
 <tr>
 <th className="border-b border-line px-4 py-3 font-bold text-navy">{t("visas.colType")}</th>
 <th className="border-b border-line px-4 py-3 font-bold text-navy">{t("visas.colDelay")}</th>
 <th className="border-b border-line px-4 py-3 font-bold text-navy">{t("visas.colTariff")}</th>
 </tr>
 </thead>
 <tbody>
 {VISA_TARIFFS_SEOUL.map((row) => (
 <tr key={row.key} className="odd:bg-white even:bg-[#f8fafc]">
 <td className="border-b border-line px-4 py-3 text-ink">
 {locale === "ko" ? row.labelKo : locale === "en" ? row.labelEn : row.labelFr}
 </td>
 <td className="border-b border-line px-4 py-3 text-muted">
 {locale === "ko" ? row.delayKo : locale === "en" ? row.delayEn : row.delayFr}
 </td>
 <td className="border-b border-line px-4 py-3 font-semibold text-navy">{row.amount}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
 {notes.map((note) => (
 <li key={note}>{note}</li>
 ))}
 </ul>
 <p className="mt-3 text-xs text-muted">{t("visas.source")}</p>
 </section>

 <section className="mb-10 border border-line bg-[rgba(74,143,212,0.05)] p-5 md:p-6">
 <h2 className="text-xl font-bold text-navy">{t("visas.evisaTitle")}</h2>
 <p className="mt-2 text-sm leading-relaxed text-muted">{t("visas.evisaBody")}</p>
 <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
 <div className="border border-line bg-white p-3">
 <dt className="font-semibold text-navy">{t("visas.evisaFee")}</dt>
 <dd className="mt-1 text-muted">{EVISA.feeFile}</dd>
 </div>
 <div className="border border-line bg-white p-3">
 <dt className="font-semibold text-navy">{t("visas.evisaOrdinary")}</dt>
 <dd className="mt-1 text-muted">{EVISA.ordinary}</dd>
 </div>
 <div className="border border-line bg-white p-3">
 <dt className="font-semibold text-navy">{t("visas.evisaSpecific")}</dt>
 <dd className="mt-1 text-muted">{EVISA.specific}</dd>
 </div>
 </dl>
 <a
 href={EVISA.url}
 target="_blank"
 rel="noopener noreferrer"
 className="btn-navy mt-5"
 >
 evisa.gouv.cd
 </a>
 </section>

 <h2 className="mb-4 text-xl font-bold text-navy">{t("visas.categoriesTitle")}</h2>
 {items.length === 0 ? (
 <p className="text-sm text-muted">{t("visas.empty")}</p>
 ) : (
 <div className="grid gap-4 md:grid-cols-2">
 {items.map((visa) => (
 <article key={visa.slug} className="border border-line bg-white p-5">
 <div className="mb-2 flex flex-wrap items-center gap-2">
 <h3 className="text-lg font-bold text-navy">{visa.title}</h3>
 {visa.is_provisional ? <ProvisionalBadge /> : null}
 </div>
 <p className="text-sm leading-relaxed text-muted">{visa.description}</p>
 <dl className="mt-4 space-y-2 text-sm">
 <div>
 <dt className="font-semibold text-navy">{t("visas.eligibility")}</dt>
 <dd className="text-muted">{visa.eligibility}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visas.documents")}</dt>
 <dd className="text-muted">{visa.documents}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visas.tariff")}</dt>
 <dd className="text-muted">{visa.tariff_note}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visas.validity")}</dt>
 <dd className="text-muted">{visa.validity_note}</dd>
 </div>
 </dl>
 </article>
 ))}
 </div>
 )}

 <div className="mt-8 flex flex-wrap items-center gap-4 border border-line bg-[rgba(74,143,212,0.05)] px-4 py-4">
 <p className="flex-1 text-sm text-muted">{t("visas.preAppHint")}</p>
 <Link to="/compte/visas/nouvelle" className="btn-navy shrink-0">
 {t("visaPre.newApplication")}
 </Link>
 </div>

 <p className="mt-6 text-sm text-muted">
 {t("visas.contactHint")}{" "}
 <Link to="/contact" className="font-semibold text-navy underline">
 {t("nav.contact")}
 </Link>
 </p>
 </PageShell>
 );
}
