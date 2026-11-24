import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { apiGet, isAbortError, type NewsItem } from "../../shared/api/client";
import { newsImage } from "../../shared/content/news";
import { useAbortableEffect } from "../../shared/hooks/useAbortableEffect";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";
import { ProvisionalBadge } from "../../shared/ui/ProvisionalBadge";

const CATEGORY_KEYS: Record<string, string> = {
 news: "news.catNews",
 communique: "news.catCommunique",
 notice: "news.catNotice",
 event: "news.catEvent",
};

export function NewsPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("news.title");
 const [items, setItems] = useState<NewsItem[]>([]);

 useAbortableEffect(
 async (signal) => {
 try {
 const data = await apiGet<NewsItem[]>("/news/", i18n.language, signal);
 if (!signal.aborted) setItems(data);
 } catch (err) {
 if (!isAbortError(err)) setItems([]);
 }
 },
 [i18n.language],
 );

 return (
 <PageShell
 eyebrow={t("news.eyebrow")}
 title={t("news.title")}
 subtitle={t("news.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("news.title") },
 ]}
 >
 {items.length === 0 ? <p className="text-sm text-muted">{t("news.empty")}</p> : null}

 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {items.map((item) => {
 const dateLabel = item.published_at
 ? new Date(item.published_at).toLocaleDateString(i18n.language, {
 year: "numeric",
 month: "short",
 day: "numeric",
 })
 : null;
 const catKey = CATEGORY_KEYS[item.category] ?? "news.catNews";
 return (
 <article key={item.slug} className="news-card group flex flex-col">
 <Link to={`/actualites/${item.slug}`} className="block overflow-hidden">
 <img
 src={newsImage(item.slug)}
 alt=""
 className="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
 loading="lazy"
 />
 </Link>
 <div className="flex flex-1 flex-col p-5">
 <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
 <span className="text-navy">{t(catKey)}</span>
 {dateLabel ? (
 <>
 <span aria-hidden>·</span>
 <time dateTime={item.published_at ?? undefined}>{dateLabel}</time>
 </>
 ) : null}
 {item.is_provisional ? <ProvisionalBadge /> : null}
 </div>
 <h2 className="mt-2 text-lg font-bold leading-snug text-navy">
 <Link to={`/actualites/${item.slug}`} className="hover:underline">
 {item.title}
 </Link>
 </h2>
 <p className="mt-2 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
 {item.summary}
 </p>
 <Link
 to={`/actualites/${item.slug}`}
 className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-navy"
 >
 {t("home.readMore")} <ArrowRight size={14} aria-hidden />
 </Link>
 </div>
 </article>
 );
 })}
 </div>

 </PageShell>
 );
}
