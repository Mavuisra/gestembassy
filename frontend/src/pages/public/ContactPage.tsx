import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Phone, Printer, Train } from "lucide-react";
import { apiPost } from "../../shared/api/client";
import { EMBASSY } from "../../shared/content/embassy";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

const categories = [
 "visa",
 "passport",
 "civil",
 "consular_card",
 "assistance",
 "economic",
 "press",
 "other",
] as const;

export function ContactPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("contact.title");
 const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
 const [error, setError] = useState("");
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";
 const address =
 locale === "ko" ? EMBASSY.address.ko : locale === "en" ? EMBASSY.address.en : EMBASSY.address.fr;
 const metro =
 locale === "ko" ? EMBASSY.metro.ko : locale === "en" ? EMBASSY.metro.en : EMBASSY.metro.fr;
 const hours =
 locale === "ko"
 ? EMBASSY.hoursProvisional.ko
 : locale === "en"
 ? EMBASSY.hoursProvisional.en
 : EMBASSY.hoursProvisional.fr;

 async function onSubmit(event: FormEvent<HTMLFormElement>) {
 event.preventDefault();
 setStatus("loading");
 setError("");
 const form = new FormData(event.currentTarget);
 try {
 await apiPost("/contact/", {
 category: form.get("category"),
 full_name: form.get("full_name"),
 email: form.get("email"),
 phone: form.get("phone") || "",
 subject: form.get("subject"),
 message: form.get("message"),
 locale: i18n.language,
 });
 setStatus("ok");
 event.currentTarget.reset();
 } catch (err) {
 setStatus("error");
 setError(err instanceof Error ? err.message : t("common.error"));
 }
 }

 const field =
 "mt-1.5 w-full border border-line bg-white px-3 py-2.5 text-sm outline-none transition focus:border-navy";

 return (
 <PageShell
 eyebrow={t("contact.eyebrow")}
 title={t("contact.title")}
 subtitle={t("contact.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("contact.title") },
 ]}
 >
 <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
 <form onSubmit={onSubmit} className="border border-line bg-white p-5 md:p-6" noValidate>
 <h2 className="text-lg font-bold text-navy">{t("contact.formTitle")}</h2>
 <p className="mt-1 text-sm text-muted">{t("contact.formHint")}</p>

 <div className="mt-6 space-y-4">
 <label className="block text-sm font-semibold text-navy">
 {t("contact.category")}
 <select name="category" required className={field} defaultValue="visa">
 {categories.map((c) => (
 <option key={c} value={c}>
 {t(`contactCategories.${c}`)}
 </option>
 ))}
 </select>
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("contact.name")}
 <input name="full_name" required autoComplete="name" className={field} />
 </label>
 <div className="grid gap-4 sm:grid-cols-2">
 <label className="block text-sm font-semibold text-navy">
 {t("contact.email")}
 <input name="email" type="email" required autoComplete="email" className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("contact.phone")}
 <input name="phone" type="tel" autoComplete="tel" className={field} />
 </label>
 </div>
 <label className="block text-sm font-semibold text-navy">
 {t("contact.subject")}
 <input name="subject" required className={field} />
 </label>
 <label className="block text-sm font-semibold text-navy">
 {t("contact.message")}
 <textarea
 name="message"
 required
 minLength={20}
 rows={6}
 className={field}
 placeholder={t("contact.messagePlaceholder")}
 />
 </label>
 </div>

 <button type="submit" disabled={status === "loading"} className="btn-navy mt-6 disabled:opacity-60">
 {status === "loading" ? t("common.loading") : t("contact.submit")}
 </button>

 <div role="status" aria-live="polite" className="mt-4">
 {status === "ok" ? (
 <p className="border border-navy/20 bg-[rgba(74,143,212,0.08)] px-3 py-2 text-sm font-semibold text-navy">
 {t("contact.success")}
 </p>
 ) : null}
 {status === "error" ? (
 <p className="border border-rdc-red/30 bg-[#fff8f8] px-3 py-2 text-sm text-rdc-red">{error}</p>
 ) : null}
 </div>
 </form>

 <aside className="space-y-5">
 <div className="border border-line bg-[rgba(74,143,212,0.05)] p-5 md:p-6">
 <h2 className="text-lg font-bold text-navy">{t("contact.addressTitle")}</h2>
 <ul className="mt-5 space-y-4 text-sm">
 <li className="flex gap-3">
 <MapPin className="mt-0.5 shrink-0 text-navy" size={18} aria-hidden />
 <div>
 <p className="font-semibold text-navy">{t("home.practicalAddress")}</p>
 <p className="mt-1 text-muted">{address}</p>
 </div>
 </li>
 <li className="flex gap-3">
 <Phone className="mt-0.5 shrink-0 text-navy" size={18} aria-hidden />
 <div>
 <p className="font-semibold text-navy">{t("home.practicalPhone")}</p>
 <a
 href={`tel:${EMBASSY.phone.replace(/\s/g, "")}`}
 className="mt-1 block text-muted hover:text-navy hover:underline"
 >
 {EMBASSY.phone}
 </a>
 </div>
 </li>
 <li className="flex gap-3">
 <Printer className="mt-0.5 shrink-0 text-navy" size={18} aria-hidden />
 <div>
 <p className="font-semibold text-navy">Fax</p>
 <p className="mt-1 text-muted">{EMBASSY.fax}</p>
 </div>
 </li>
 <li className="flex gap-3">
 <Mail className="mt-0.5 shrink-0 text-navy" size={18} aria-hidden />
 <div>
 <p className="font-semibold text-navy">{t("home.practicalEmail")}</p>
 <a
 href={`mailto:${EMBASSY.email}`}
 className="mt-1 block break-all text-muted hover:text-navy hover:underline"
 >
 {EMBASSY.email}
 </a>
 </div>
 </li>
 <li className="flex gap-3">
 <Train className="mt-0.5 shrink-0 text-navy" size={18} aria-hidden />
 <div>
 <p className="font-semibold text-navy">{t("home.practicalMetro")}</p>
 <p className="mt-1 text-muted">{metro}</p>
 </div>
 </li>
 </ul>
 <p className="mt-5 border-t border-line pt-4 text-sm text-muted">
 <span className="font-semibold text-navy">{t("home.practicalHours")} :</span> {hours}
 </p>
 </div>

 <div className="border border-line bg-white p-5">
 <h2 className="text-base font-bold text-navy">{t("contact.quickLinks")}</h2>
 <ul className="mt-3 space-y-2 text-sm">
 <li>
 <Link to="/visas" className="font-semibold text-navy hover:underline">
 {t("nav.visas")}
 </Link>
 </li>
 <li>
 <Link to="/services" className="font-semibold text-navy hover:underline">
 {t("nav.services")}
 </Link>
 </li>
 <li>
 <Link to="/assistance" className="font-semibold text-navy hover:underline">
 {t("nav.assistance")}
 </Link>
 </li>
 <li>
 <Link to="/faq" className="font-semibold text-navy hover:underline">
 FAQ
 </Link>
 </li>
 </ul>
 </div>
 </aside>
 </div>
 </PageShell>
 );
}
