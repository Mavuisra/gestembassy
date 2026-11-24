import { useEffect, useState } from "react";
import { boGet, boPatch } from "../../shared/api/backofficeClient";
import { useStaffAuth } from "../../shared/auth/StaffAuthContext";
import { PageHeader, Panel, StatusBadge } from "./ui";

type NewsItem = { id: number; slug: string; title_fr: string; is_published: boolean; is_provisional: boolean };
type FaqItem = { id: number; category: string; question_fr: string; is_published: boolean; is_provisional: boolean };

export function BackofficeNewsPage() {
 const { token } = useStaffAuth();
 const [items, setItems] = useState<NewsItem[]>([]);
 const [error, setError] = useState("");

 function reload() {
 if (!token) return;
 boGet<NewsItem[]>("/news/", token)
 .then(setItems)
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
 }

 useEffect(() => {
 reload();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [token]);

 async function toggle(id: number, is_published: boolean) {
 if (!token) return;
 await boPatch(`/news/${id}/`, token, { is_published: !is_published });
 reload();
 }

 return (
 <div>
 <PageHeader
 title="Actualités"
 subtitle="Publication rapide. Édition complète des textes dans Django admin."
 actions={
 <a
 href="http://127.0.0.1:8000/admin/"
 className="border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy"
 target="_blank"
 rel="noreferrer"
 >
 Django admin
 </a>
 }
 />
 {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}
 <Panel title={`${items.length} article${items.length > 1 ? "s" : ""}`}>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[640px] text-left text-sm">
 <thead>
 <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
 <th className="pb-2 font-bold">Titre</th>
 <th className="pb-2 font-bold">Slug</th>
 <th className="pb-2 font-bold">État</th>
 <th className="pb-2 font-bold" />
 </tr>
 </thead>
 <tbody>
 {items.map((n) => (
 <tr key={n.id} className="border-b border-line/70 last:border-0">
 <td className="py-3 font-semibold text-navy">{n.title_fr}</td>
 <td className="py-3 text-muted">{n.slug}</td>
 <td className="py-3">
 <StatusBadge status={n.is_published ? "accepted" : "draft"} />
 {n.is_provisional ? <span className="ml-2 text-xs text-amber-700">provisoire</span> : null}
 </td>
 <td className="py-3 text-right">
 <button
 type="button"
 className="text-xs font-bold uppercase text-navy underline"
 onClick={() => void toggle(n.id, n.is_published)}
 >
 {n.is_published ? "Dépublier" : "Publier"}
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </Panel>
 </div>
 );
}

export function BackofficeFaqPage() {
 const { token } = useStaffAuth();
 const [items, setItems] = useState<FaqItem[]>([]);
 const [error, setError] = useState("");

 function reload() {
 if (!token) return;
 boGet<FaqItem[]>("/faq/", token)
 .then(setItems)
 .catch((err) => setError(err instanceof Error ? err.message : "Erreur"));
 }

 useEffect(() => {
 reload();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [token]);

 async function toggle(id: number, is_published: boolean) {
 if (!token) return;
 await boPatch(`/faq/${id}/`, token, { is_published: !is_published });
 reload();
 }

 return (
 <div>
 <PageHeader title="FAQ" subtitle="Publication rapide édition des textes dans Django admin." />
 {error ? <p className="mb-3 text-sm text-rdc-red">{error}</p> : null}
 <Panel title={`${items.length} entrée${items.length > 1 ? "s" : ""}`}>
 <div className="overflow-x-auto">
 <table className="w-full min-w-[640px] text-left text-sm">
 <thead>
 <tr className="border-b border-line text-[11px] uppercase tracking-wide text-muted">
 <th className="pb-2 font-bold">Question</th>
 <th className="pb-2 font-bold">Catégorie</th>
 <th className="pb-2 font-bold">État</th>
 <th className="pb-2 font-bold" />
 </tr>
 </thead>
 <tbody>
 {items.map((f) => (
 <tr key={f.id} className="border-b border-line/70 last:border-0">
 <td className="py-3 font-semibold text-navy">{f.question_fr}</td>
 <td className="py-3 text-muted">{f.category}</td>
 <td className="py-3">
 <StatusBadge status={f.is_published ? "accepted" : "draft"} />
 </td>
 <td className="py-3 text-right">
 <button
 type="button"
 className="text-xs font-bold uppercase text-navy underline"
 onClick={() => void toggle(f.id, f.is_published)}
 >
 {f.is_published ? "Masquer" : "Publier"}
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </Panel>
 </div>
 );
}
