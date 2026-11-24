import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { apiGet, isAbortError, type NewsDetail } from "../../shared/api/client";
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

export function NewsDetailPage() {
 const { slug } = useParams();
 const { t, i18n } = useTranslation();
 const [item, setItem] = useState<NewsDetail | null>(null);
 const [error, setError] = useState("");

 usePageTitle(item?.title ?? t("news.title"), { raw: Boolean(item?.title) });

 useAbortableEffect(
 async (signal) => {
 if (!slug) return;
 setItem(null);
 setError("");
 try {
 const data = await apiGet<NewsDetail>(`/news/${slug}/`, i18n.language, signal);
 if (!signal.aborted) setItem(data);
 } catch (err) {
 if (!isAbortError(err)) setError(t("common.error"));
 }
 },
 [slug, i18n.language, t],
 );

 if (error) {
 return (
 <PageShell
 title={t("news.title")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("news.title"), to: "/actualites" },
 ]}
 >
 <p className="text-rdc-red">{error}</p>
 <Link to="/actualites" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy">
 <ArrowLeft size={16} /> {t("common.back")}
 </Link>
 </PageShell>
 );
 }

 if (!item) {
 return (
 <PageShell
 title={t("news.title")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("news.title"), to: "/actualites" },
 ]}
 >
 <p className="text-sm text-muted">{t("common.loading")}</p>
 </PageShell>
 );
 }

 const dateLabel = item.published_at
 ? new Date(item.published_at).toLocaleDateString(i18n.language, {
 year: "numeric",
 month: "long",
 day: "numeric",
 })
 : null;
 const catKey = CATEGORY_KEYS[item.category] ?? "news.catNews";

 return (
 <PageShell
 eyebrow={t(catKey)}
 title={item.title}
 subtitle={item.summary}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("news.title"), to: "/actualites" },
 { label: item.title },
 ]}
 narrow
 >
 <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted">
 {dateLabel ? <time dateTime={item.published_at ?? undefined}>{dateLabel}</time> : null}
 {item.is_provisional ? <ProvisionalBadge /> : null}
 </div>

 <figure className="overflow-hidden border border-line">
 <img
 src={newsImage(item.slug)}
 alt=""
 className="max-h-[420px] w-full object-cover"
 />
 </figure>

 <div className="prose-news mt-8 whitespace-pre-line text-[15px] leading-[1.75] text-ink">
 {item.body}
 </div>

 <Link
 to="/actualites"
 className="btn-navy mt-10"
 >
 <ArrowLeft size={16} /> {t("news.backToList")}
 </Link>
 </PageShell>
 );
}
