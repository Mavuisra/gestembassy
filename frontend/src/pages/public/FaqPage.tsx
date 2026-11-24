import { useState } from "react";
import { useTranslation } from "react-i18next";
import { apiGet, isAbortError, type FaqItem } from "../../shared/api/client";
import { useAbortableEffect } from "../../shared/hooks/useAbortableEffect";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";
import { ProvisionalBadge } from "../../shared/ui/ProvisionalBadge";

export function FaqPage() {
 const { t, i18n } = useTranslation();
 usePageTitle("faq.title");
 const [items, setItems] = useState<FaqItem[]>([]);

 useAbortableEffect(
 async (signal) => {
 try {
 const data = await apiGet<FaqItem[]>("/faq/", i18n.language, signal);
 if (!signal.aborted) setItems(data);
 } catch (err) {
 if (!isAbortError(err)) setItems([]);
 }
 },
 [i18n.language],
 );

 return (
 <PageShell
 eyebrow={t("faq.eyebrow")}
 title={t("faq.title")}
 subtitle={t("faq.intro")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("faq.title") },
 ]}
 narrow
 >
 <div className="space-y-3">
 {items.map((item) => (
 <details key={item.id} className="border border-line bg-white open:bg-paper">
 <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-navy marker:content-none">
 <span className="inline-flex items-center gap-2">
 {item.question}
 {item.is_provisional ? <ProvisionalBadge /> : null}
 </span>
 </summary>
 <div className="border-t border-line px-4 py-3 text-sm leading-relaxed text-muted whitespace-pre-line">
 {item.answer}
 </div>
 </details>
 ))}
 </div>
 </PageShell>
 );
}
