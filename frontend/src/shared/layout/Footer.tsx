import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUp } from "lucide-react";
import { EMBASSY } from "../content/embassy";

export function Footer() {
 const { t, i18n } = useTranslation();
 const year = new Date().getFullYear();
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const address =
 locale === "ko" ? EMBASSY.address.ko : locale === "en" ? EMBASSY.address.en : EMBASSY.address.fr;
 const hours =
 locale === "ko"
 ? EMBASSY.hoursProvisional.ko
 : locale === "en"
 ? EMBASSY.hoursProvisional.en
 : EMBASSY.hoursProvisional.fr;

 return (
 <footer className="bg-navy text-white">
 <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
 <div>
 <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-white">{t("nav.contact")}</h3>
 <dl className="mt-5 space-y-3 text-sm text-white/80">
 <div>
 <dt className="sr-only">{t("home.practicalPhone")}</dt>
 <dd>
 <a href={`tel:${EMBASSY.phone.replace(/\s/g, "")}`} className="hover:text-white">
 {EMBASSY.phone}
 </a>
 </dd>
 </div>
 <div>
 <dt className="sr-only">{t("home.practicalEmail")}</dt>
 <dd>
 <a href={`mailto:${EMBASSY.email}`} className="break-all hover:text-white">
 {EMBASSY.email}
 </a>
 </dd>
 </div>
 <div>
 <dt className="sr-only">{t("home.practicalAddress")}</dt>
 <dd className="leading-relaxed">{address}</dd>
 </div>
 <div>
 <dt className="sr-only">{t("home.practicalHours")}</dt>
 <dd className="leading-relaxed text-white/70">{hours}</dd>
 </div>
 </dl>
 </div>

 <div>
 <h3 className="text-sm font-bold uppercase tracking-[0.08em]">{t("footer.usefulLinks")}</h3>
 <ul className="mt-5 space-y-2.5 text-sm text-white/80">
 <li>
 <Link to="/ambassade" className="hover:text-white">
 {t("nav.about")}
 </Link>
 </li>
 <li>
 <Link to="/contact" className="hover:text-white">
 {t("nav.contact")}
 </Link>
 </li>
 <li>
 <Link to="/actualites" className="hover:text-white">
 {t("nav.news")}
 </Link>
 </li>
 <li>
 <Link to="/faq" className="hover:text-white">
 FAQ
 </Link>
 </li>
 </ul>
 </div>

 <div>
 <h3 className="text-sm font-bold uppercase tracking-[0.08em]">{t("nav.services")}</h3>
 <ul className="mt-5 space-y-2.5 text-sm text-white/80">
 <li>
 <Link to="/visas" className="hover:text-white">
 {t("nav.visas")}
 </Link>
 </li>
 <li>
 <Link to="/services" className="hover:text-white">
 {t("home.svc.passport.title")}
 </Link>
 </li>
 <li>
 <Link to="/assistance" className="hover:text-white">
 {t("nav.assistance")}
 </Link>
 </li>
 <li>
 <Link to="/investir" className="hover:text-white">
 {t("nav.invest")}
 </Link>
 </li>
 <li>
 <Link to="/tourisme" className="hover:text-white">
 {t("nav.tourism")}
 </Link>
 </li>
 <li>
 <Link to="/bourses" className="hover:text-white">
 {t("nav.scholarships")}
 </Link>
 </li>
 </ul>
 </div>

 <div>
 <h3 className="text-sm font-bold uppercase tracking-[0.08em]">{t("footer.follow")}</h3>
 <p className="mt-5 text-sm leading-relaxed text-white/75">{t("footer.tagline")}</p>
 <div className="mt-5 flex items-center gap-3">
 <img
 src="/embleme-rdc.png"
 alt=""
 className="h-14 w-auto object-contain mix-blend-lighten"
 />
 <div>
 <p className="text-sm font-semibold">{t("brand.short")}</p>
 <p className="text-xs text-white/65">{t("brand.host")}</p>
 </div>
 </div>
 </div>
 </div>

 <div className="border-t border-white/15">
 <div className="container-page flex flex-col gap-3 py-4 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
 <p>
 © {year} {t("brand.short")}. {t("footer.rights")}
 </p>
 <div className="flex flex-wrap gap-4">
 <a href="#">{t("footer.privacy")}</a>
 <a href="#">{t("footer.accessibility")}</a>
 </div>
 </div>
 </div>

 <button
 type="button"
 className="back-to-top"
 aria-label={t("a11y.backToTop")}
 onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
 >
 <ArrowUp size={18} />
 </button>
 </footer>
 );
}
