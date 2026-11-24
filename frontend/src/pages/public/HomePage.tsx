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
import { apiGet, isAbortError, type NewsItem } from "../../shared/api/client";
import { EMBASSY } from "../../shared/content/embassy";
import { newsImage } from "../../shared/content/news";
import { useAbortableEffect } from "../../shared/hooks/useAbortableEffect";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { Reveal } from "../../shared/ui/Reveal";

const HERO_IMG = "/images/intro-mission.jpg";
const consularServices = [
 { key: "passport", to: "/services/passeport", icon: BookOpen },
 { key: "visas", to: "/visas", icon: Plane },
 { key: "card", to: "/services", icon: IdCard },
] as const;

const moreServices = [
 { key: "civil", to: "/services/etat-civil", icon: FileText },
 { key: "assistance", to: "/assistance", icon: Headphones },
] as const;

export function HomePage() {
 const { t, i18n } = useTranslation();
 usePageTitle("nav.home");
 const [news, setNews] = useState<NewsItem[]>([]);
 const locale = i18n.language.startsWith("ko") ? "ko" : i18n.language.startsWith("en") ? "en" : "fr";

 useAbortableEffect(
 async (signal) => {
 try {
 const data = await apiGet<NewsItem[]>("/news/?limit=3", i18n.language, signal);
 if (!signal.aborted) setNews(data);
 } catch (error) {
 if (!isAbortError(error)) setNews([]);
 }
 },
 [i18n.language],
 );

 const fallbackNews = [
 { slug: "1", title: t("home.news1"), summary: t("home.news1Excerpt"), date: "2026" },
 { slug: "2", title: t("home.news2"), summary: t("home.news2Excerpt"), date: "2026" },
 { slug: "3", title: t("home.news3"), summary: t("home.news3Excerpt"), date: "2026" },
 ];

 const displayNews =
 news.length > 0
 ? news.map((n) => ({
 slug: n.slug,
 title: n.title,
 summary: n.summary,
 date: n.published_at ? new Date(n.published_at).toLocaleDateString(i18n.language) : " ",
 img: newsImage(n.slug),
 }))
 : fallbackNews.map((n) => ({ ...n, img: newsImage(n.slug) }));

 const address =
 locale === "ko" ? EMBASSY.address.ko : locale === "en" ? EMBASSY.address.en : EMBASSY.address.fr;

 return (
 <>
 {/* HERO photo mission + texte / CTA sur l'image */}
 <section className="hero-mission relative isolate overflow-hidden">
 <img
 src={HERO_IMG}
 alt=""
 className="absolute inset-0 h-full w-full object-cover object-[center_28%]"
 />
 <div className="hero-mission-veil absolute inset-0" aria-hidden />
 <div className="container-page relative flex min-h-[420px] items-end py-12 md:min-h-[560px] md:py-16 lg:min-h-[620px]">
 <Reveal>
 <div className="max-w-xl rounded-[2px] border border-white/25 bg-navy/55 p-6 backdrop-blur-[2px] md:p-8">
 <p className="text-base font-medium leading-relaxed text-white md:text-lg md:leading-relaxed">
 {t("home.heroSubtitle")}
 </p>
 <Link to="/ambassade" className="btn-hero mt-7">
 {t("home.heroCta")} <ArrowRight size={16} />
 </Link>
 </div>
 </Reveal>
 </div>
 </section>

 {/* SERVICES CONSULAIRES */}
 <section className="bg-[rgba(74,143,212,0.05)] py-14 md:py-20">
 <div className="container-page">
 <Reveal>
 <h2 className="text-3xl font-black text-navy md:text-4xl">{t("home.servicesEyebrow")}</h2>
 </Reveal>
 <div className="mt-10 grid gap-6 md:grid-cols-3">
 {consularServices.map((s, index) => {
 const Icon = s.icon;
 return (
 <Reveal key={s.key} delay={(index + 1) as 1 | 2 | 3}>
 <Link to={s.to} className="svc-card group">
 <div className="svc-card-icon">
 <Icon size={84} strokeWidth={1.15} aria-hidden />
 </div>
 <div className="svc-card-body">
 <div className="flex items-start justify-between gap-2">
 <h3>{t(`home.svc.${s.key}.title`)}</h3>
 <ArrowUpRight size={20} className="svc-card-arrow mt-1 shrink-0 text-navy" />
 </div>
 <p>{t(`home.svc.${s.key}.desc`)}</p>
 <span className="svc-card-more">
 {t("home.readMore")}
 <ArrowRight size={14} aria-hidden />
 </span>
 </div>
 </Link>
 </Reveal>
 );
 })}
 </div>
 <div className="mt-6 grid gap-6 md:grid-cols-2">
 {moreServices.map((s, index) => {
 const Icon = s.icon;
 return (
 <Reveal key={s.key} delay={(index + 1) as 1 | 2}>
 <Link to={s.to} className="svc-card group">
 <div className="svc-card-icon">
 <Icon size={84} strokeWidth={1.15} aria-hidden />
 </div>
 <div className="svc-card-body">
 <div className="flex items-start justify-between gap-2">
 <h3>{t(`home.svc.${s.key}.title`)}</h3>
 <ArrowUpRight size={20} className="svc-card-arrow mt-1 shrink-0 text-navy" />
 </div>
 <p>{t(`home.svc.${s.key}.desc`)}</p>
 <span className="svc-card-more">
 {t("home.readMore")}
 <ArrowRight size={14} aria-hidden />
 </span>
 </div>
 </Link>
 </Reveal>
 );
 })}
 </div>
 </div>
 </section>

 {/* AMBASSADEUR */}
 <section className="ambassador-section relative isolate overflow-hidden border-y border-line">
 <img
 src="/images/ambassador-bg.jpg"
 alt=""
 className="absolute inset-0 h-full w-full object-cover object-center"
 loading="lazy"
 decoding="async"
 />
 <div className="ambassador-section-veil absolute inset-0" aria-hidden />
 <div className="container-page relative grid items-start gap-8 py-14 md:gap-12 md:py-16 lg:grid-cols-[280px_1fr]">
 <Reveal>
 <figure className="ambassador-portrait shadow-sm">
 <img
 src="/images/ambassador.jpg"
 alt={t("home.ambassadorName")}
 width={560}
 height={700}
 loading="lazy"
 decoding="async"
 />
 <figcaption>
 <span className="block text-[15px] font-semibold text-navy">{t("home.ambassadorName")}</span>
 <span className="mt-0.5 block text-[13px] text-muted">{t("home.ambassadorRole")}</span>
 </figcaption>
 </figure>
 </Reveal>
 <Reveal delay={1}>
 <div className="ambassador-copy">
 <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
 {t("home.ambassadorEyebrow")}
 </p>
 <h2 className="mt-2 text-2xl font-extrabold text-navy md:text-[28px]">
 {t("home.ambassadorTitle")}
 </h2>
 <p className="mt-5 max-w-2xl text-base leading-[1.75] text-ink">{t("home.ambassadorBody")}</p>
 <Link to="/ambassade" className="btn-navy mt-7">
 {t("home.ambassadorCta")} <ArrowRight size={16} />
 </Link>
 </div>
 </Reveal>
 </div>
 </section>

 {/* INVESTIR / OPPORTUNITÉS */}
 <section className="bg-white py-16 md:py-24">
 <div className="container-page max-w-3xl">
 <Reveal>
 <h2 className="text-3xl font-black leading-tight text-navy md:text-5xl">
 {t("home.oppTitle")}
 <span className="text-gold"> {t("home.oppSubtitle")}</span>
 </h2>
 <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
 {t("home.aboutBody")}
 </p>
 <Link to="/investir" className="btn-navy mt-8">
 {t("home.opp.invest")} <ArrowUpRight size={16} />
 </Link>
 </Reveal>
 </div>
 </section>

 {/* MISSIONS */}
 <section className="ambassador-section relative isolate overflow-hidden border-y border-line">
 <img
 src="/images/ambassador-bg.jpg"
 alt=""
 className="absolute inset-0 h-full w-full object-cover object-center"
 loading="lazy"
 decoding="async"
 />
 <div className="ambassador-section-veil absolute inset-0" aria-hidden />
 <div className="container-page relative py-14 md:py-16">
 <Reveal>
 <h2 className="mission-section-title text-3xl font-black md:text-4xl">
 {t("home.missionsTitle")}
 </h2>
 </Reveal>
 <div className="mt-10 grid gap-6 md:grid-cols-3">
 {[1, 2, 3].map((n) => (
 <Reveal key={n} delay={n as 1 | 2 | 3}>
 <article className="mission-card h-full p-6 md:p-7">
 <h3 className="text-lg font-extrabold text-gold">{t(`home.mission${n}Title`)}</h3>
 <p className="mt-3 text-sm leading-relaxed text-white/90">{t(`home.mission${n}Text`)}</p>
 </article>
 </Reveal>
 ))}
 </div>
 </div>
 </section>

 {/* HISTORIQUE */}
 <section className="bg-white py-14">
 <div className="container-page">
 <Reveal>
 <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
 {t("home.historyEyebrow")}
 </p>
 <h2 className="mt-2 text-3xl font-black text-navy">{t("home.historyTitle")}</h2>
 </Reveal>
 <div className="mt-10 grid gap-5 md:grid-cols-3">
 {[
 { year: "1963", text: t("home.history1963") },
 { year: "1990", text: t("home.history1990") },
 { year: "2023", text: t("home.history2023") },
 ].map((item, i) => (
 <Reveal key={item.year} delay={(i + 1) as 1 | 2 | 3}>
 <article className="border-l-4 border-navy bg-[#f8f9fb] p-5">
 <p className="text-2xl font-black text-navy">{item.year}</p>
 <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
 </article>
 </Reveal>
 ))}
 </div>
 </div>
 </section>

 {/* ACTUALITÉS */}
 <section className="border-t border-line bg-[#f8f9fb] py-14 md:py-16">
 <div className="container-page">
 <Reveal>
 <div className="flex flex-wrap items-end justify-between gap-4">
 <h2 className="text-3xl font-black text-navy md:text-4xl">{t("home.newsTitle")}</h2>
 <Link to="/actualites" className="text-sm font-bold uppercase tracking-wide text-navy hover:underline">
 {t("home.newsAll")}
 </Link>
 </div>
 </Reveal>
 <div className="mt-10 grid gap-6 md:grid-cols-3">
 {displayNews.map((item, i) => (
 <Reveal key={item.slug} delay={(Math.min(i + 1, 3) as 1 | 2 | 3)}>
 <article className="news-card">
 <Link to={`/actualites/${item.slug}`}>
 <img src={item.img} alt="" />
 </Link>
 <div className="p-5">
 <p className="text-xs font-semibold uppercase tracking-wide text-muted">{item.date}</p>
 <h3 className="mt-2 text-lg font-extrabold text-navy">
 <Link to={`/actualites/${item.slug}`} className="hover:underline">
 {item.title}
 </Link>
 </h3>
 <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>
 <Link
 to={`/actualites/${item.slug}`}
 className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-navy"
 >
 {t("home.readMore")}
 </Link>
 </div>
 </article>
 </Reveal>
 ))}
 </div>
 </div>
 </section>

 {/* CONTACT STRIP */}
 <section className="bg-navy py-12 text-white">
 <div className="container-page flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
 <div>
 <h2 className="text-2xl font-extrabold text-white">{t("home.contactStrip")}</h2>
 <p className="mt-2 text-sm text-white/75">{address}</p>
 </div>
 <Link to="/contact" className="btn-contact">
 {t("home.writeUs")} <ArrowRight size={16} />
 </Link>
 </div>
 </section>
 </>
 );
}
