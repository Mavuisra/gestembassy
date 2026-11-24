import { useTranslation } from "react-i18next";
import { EMBASSY } from "../../shared/content/embassy";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

export function EmbassyPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("embassy.title");
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const address =
 locale === "ko" ? EMBASSY.address.ko : locale === "en" ? EMBASSY.address.en : EMBASSY.address.fr;
 const sections = [
 t("embassy.chancery"),
 t("embassy.consular"),
 t("embassy.economic"),
 t("embassy.cultural"),
 ];

 return (
 <PageShell
 eyebrow={t("embassy.eyebrow")}
 title={t("embassy.title")}
 subtitle={t("embassy.subtitle")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("embassy.title") },
 ]}
 >
 <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
 <div className="space-y-8">
 <section>
 <h2 className="text-xl font-bold text-navy">{t("embassy.welcome")}</h2>
 <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-[15px]">
 {t("embassy.welcomeBody")}
 </p>
 </section>

 <section>
 <h2 className="text-xl font-bold text-navy">{t("embassy.historyTitle")}</h2>
 <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-[15px]">
 {t("embassy.historyBody")}
 </p>
 </section>

 <section className="grid gap-6 sm:grid-cols-[200px_1fr] sm:items-start">
 <figure className="ambassador-portrait">
 <img
 src="/images/ambassador.jpg"
 alt={EMBASSY.ambassador.name}
 width={400}
 height={500}
 loading="lazy"
 decoding="async"
 />
 </figure>
 <div>
 <h2 className="text-xl font-bold text-navy">{t("embassy.ambassadorTitle")}</h2>
 <p className="mt-2 font-semibold text-navy">{EMBASSY.ambassador.name}</p>
 <p className="text-sm text-muted">
 {locale === "ko"
 ? EMBASSY.ambassador.titleKo
 : locale === "en"
 ? EMBASSY.ambassador.titleEn
 : EMBASSY.ambassador.titleFr}
 </p>
 <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-[15px]">
 {t("embassy.ambassadorBody")}
 </p>
 </div>
 </section>

 <section>
 <h2 className="text-xl font-bold text-navy">{t("embassy.missionTitle")}</h2>
 <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted md:text-[15px]">
 {t("embassy.missionBody")}
 </p>
 </section>

 <section>
 <h2 className="mb-4 text-xl font-bold text-navy">{t("embassy.orgTitle")}</h2>
 <ul className="grid gap-3 sm:grid-cols-2">
 {sections.map((label) => (
 <li key={label} className="border border-line bg-paper px-4 py-4 text-sm font-semibold text-navy">
 {label}
 </li>
 ))}
 </ul>
 </section>
 </div>

 <aside className="h-fit border border-line bg-paper p-6">
 <h2 className="text-lg font-bold text-navy">{t("embassy.locationTitle")}</h2>
 <dl className="mt-4 space-y-3 text-sm text-muted">
 <div>
 <dt className="font-semibold text-navy">{t("home.practicalAddress")}</dt>
 <dd className="mt-1">{address}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("home.practicalPhone")}</dt>
 <dd className="mt-1">{EMBASSY.phone}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">Fax</dt>
 <dd className="mt-1">{EMBASSY.fax}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("home.practicalEmail")}</dt>
 <dd className="mt-1 break-all">{EMBASSY.email}</dd>
 </div>
 </dl>
 <p className="mt-6 text-xs leading-relaxed text-muted">{t("embassy.sourceNote")}</p>
 </aside>
 </div>
 </PageShell>
 );
}
