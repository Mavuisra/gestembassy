import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
 AlertTriangle,
 Phone,
 Mail,
 MapPin,
 ShieldAlert,
 CheckCircle2,
 XCircle,
} from "lucide-react";
import { ASSISTANCE_CASES, ASSISTANCE_LIMITS } from "../../shared/content/assistance";
import { EMBASSY } from "../../shared/content/embassy";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

export function AssistancePage() {
 const { t, i18n } = useTranslation();
 usePageTitle("assistance.title");
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const limits = ASSISTANCE_LIMITS[locale];
 const address =
 locale === "ko" ? EMBASSY.address.ko : locale === "en" ? EMBASSY.address.en : EMBASSY.address.fr;
 const hours =
 locale === "ko"
 ? EMBASSY.hoursProvisional.ko
 : locale === "en"
 ? EMBASSY.hoursProvisional.en
 : EMBASSY.hoursProvisional.fr;

 return (
 <PageShell
 eyebrow={t("assistance.eyebrow")}
 title={t("assistance.title")}
 subtitle={t("assistance.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("assistance.title") },
 ]}
 >
 {/* URGENCE */}
 <section className="border border-rdc-red/30 border-l-4 border-l-rdc-red bg-[#fff8f8] p-5 md:p-6">
 <div className="flex items-start gap-3">
 <ShieldAlert className="mt-0.5 shrink-0 text-rdc-red" size={28} aria-hidden />
 <div className="flex-1">
 <h2 className="text-xl font-bold text-rdc-red">{t("assistance.emergency")}</h2>
 <p className="mt-2 text-sm leading-relaxed text-ink">{t("assistance.emergencyLead")}</p>
 <div className="mt-4 grid gap-3 sm:grid-cols-3">
 <div className="border border-line bg-white px-4 py-3">
 <p className="text-xs font-bold uppercase tracking-wide text-muted">
 {t("assistance.localPolice")}
 </p>
 <a href="tel:112" className="mt-1 block text-lg font-extrabold text-navy">
 112
 </a>
 </div>
 <div className="border border-line bg-white px-4 py-3">
 <p className="text-xs font-bold uppercase tracking-wide text-muted">
 {t("assistance.localRescue")}
 </p>
 <a href="tel:119" className="mt-1 block text-lg font-extrabold text-navy">
 119
 </a>
 </div>
 <div className="border border-line bg-white px-4 py-3">
 <p className="text-xs font-bold uppercase tracking-wide text-muted">
 {t("assistance.embassyHotline")}
 </p>
 <a
 href={`tel:${EMBASSY.phone.replace(/\s/g, "")}`}
 className="mt-1 block text-lg font-extrabold text-rdc-red"
 >
 {EMBASSY.phone}
 </a>
 </div>
 </div>
 <p className="mt-4 text-sm text-muted">{t("assistance.emergencyNote")}</p>
 <div className="mt-5 flex flex-wrap gap-3">
 <a
 href={`tel:${EMBASSY.phone.replace(/\s/g, "")}`}
 className="inline-flex items-center gap-2 bg-rdc-red px-4 py-2.5 text-sm font-bold text-white"
 >
 <Phone size={16} aria-hidden /> {t("assistance.callEmbassy")}
 </a>
 <Link to="/contact" className="btn-navy">
 {t("assistance.writeUs")}
 </Link>
 </div>
 </div>
 </div>
 </section>

 {/* SITUATIONS */}
 <section className="mt-12">
 <h2 className="text-xl font-bold text-navy">{t("assistance.typesTitle")}</h2>
 <p className="mt-2 max-w-3xl text-sm text-muted">{t("assistance.typesIntro")}</p>
 <div className="mt-6 grid gap-4 md:grid-cols-2">
 {ASSISTANCE_CASES.map((item) => (
 <article key={item.key} className="border border-line bg-white p-5">
 <div className="flex items-start gap-3">
 <AlertTriangle className="mt-0.5 shrink-0 text-navy" size={20} aria-hidden />
 <div>
 <h3 className="text-base font-extrabold text-navy">
 {locale === "ko"
 ? item.titleKo
 : locale === "en"
 ? item.titleEn
 : item.titleFr}
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

 {/* CE QUE L'AMBASSADE PEUT / NE PEUT PAS */}
 <section className="mt-12 grid gap-6 lg:grid-cols-2">
 <div className="border border-line bg-[rgba(74,143,212,0.05)] p-5 md:p-6">
 <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
 <CheckCircle2 size={20} aria-hidden /> {t("assistance.canTitle")}
 </h2>
 <ul className="mt-4 space-y-2.5">
 {limits.can.map((line) => (
 <li key={line} className="flex gap-2 text-sm leading-relaxed text-ink">
 <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-navy" aria-hidden />
 {line}
 </li>
 ))}
 </ul>
 </div>
 <div className="border border-line bg-white p-5 md:p-6">
 <h2 className="flex items-center gap-2 text-lg font-bold text-navy">
 <XCircle size={20} aria-hidden /> {t("assistance.cannotTitle")}
 </h2>
 <ul className="mt-4 space-y-2.5">
 {limits.cannot.map((line) => (
 <li key={line} className="flex gap-2 text-sm leading-relaxed text-muted">
 <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-muted" aria-hidden />
 {line}
 </li>
 ))}
 </ul>
 </div>
 </section>

 {/* ENREGISTREMENT */}
 <section className="mt-12 border border-line border-l-4 border-l-gold bg-white p-5 md:p-6">
 <h2 className="text-xl font-bold text-navy">{t("assistance.registerTitle")}</h2>
 <p className="mt-2 text-sm leading-relaxed text-muted">{t("assistance.registerBody")}</p>
 <Link to="/services/enregistrement-consulaire" className="btn-navy mt-5">
 {t("assistance.registerCta")}
 </Link>
 </section>

 {/* CONTACTS */}
 <section className="mt-12 bg-navy p-6 text-white md:p-8">
 <h2 className="text-xl font-bold text-white">{t("assistance.contactsTitle")}</h2>
 <dl className="mt-5 grid gap-5 sm:grid-cols-2">
 <div className="flex gap-3">
 <Phone className="mt-0.5 shrink-0 text-gold" size={18} aria-hidden />
 <div>
 <dt className="text-xs font-bold uppercase tracking-wide text-white/60">
 {t("home.practicalPhone")}
 </dt>
 <dd className="mt-1">
 <a href={`tel:${EMBASSY.phone.replace(/\s/g, "")}`} className="hover:underline">
 {EMBASSY.phone}
 </a>
 </dd>
 </div>
 </div>
 <div className="flex gap-3">
 <Mail className="mt-0.5 shrink-0 text-gold" size={18} aria-hidden />
 <div>
 <dt className="text-xs font-bold uppercase tracking-wide text-white/60">
 {t("home.practicalEmail")}
 </dt>
 <dd className="mt-1 break-all">
 <a href={`mailto:${EMBASSY.email}`} className="hover:underline">
 {EMBASSY.email}
 </a>
 </dd>
 </div>
 </div>
 <div className="flex gap-3 sm:col-span-2">
 <MapPin className="mt-0.5 shrink-0 text-gold" size={18} aria-hidden />
 <div>
 <dt className="text-xs font-bold uppercase tracking-wide text-white/60">
 {t("home.practicalAddress")}
 </dt>
 <dd className="mt-1 text-sm text-white/85">{address}</dd>
 <dd className="mt-2 text-sm text-white/70">{hours}</dd>
 </div>
 </div>
 </dl>
 </section>
 </PageShell>
 );
}
