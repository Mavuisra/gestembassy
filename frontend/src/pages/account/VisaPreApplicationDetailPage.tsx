import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiAuthGet, type VisaPreApplication } from "../../shared/api/client";
import { useAuth } from "../../shared/auth/AuthContext";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

type LocationState = { justSubmitted?: boolean; message?: string } | null;

export function VisaPreApplicationDetailPage() {
 const { t } = useTranslation();
 usePageTitle("visaPre.detailTitle");
 const { reference = "" } = useParams();
 const location = useLocation();
 const state = location.state as LocationState;
 const { token, isAuthenticated } = useAuth();
 const [item, setItem] = useState<VisaPreApplication | null>(null);
 const [error, setError] = useState("");

 useEffect(() => {
 if (!token || !reference) return;
 let cancelled = false;
 apiAuthGet<VisaPreApplication>(`/account/visa-preapplications/${reference}/`, token)
 .then((data) => {
 if (!cancelled) setItem(data);
 })
 .catch((err) => {
 if (!cancelled) setError(err instanceof Error ? err.message : t("common.error"));
 });
 return () => {
 cancelled = true;
 };
 }, [token, reference, t]);

 if (!isAuthenticated || !token) {
 return <Navigate to="/compte/connexion" replace />;
 }

 return (
 <PageShell
 eyebrow={t("account.eyebrow")}
 title={t("visaPre.detailTitle")}
 subtitle={reference}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: t("account.dashboardTitle"), to: "/compte" },
 { label: t("visaPre.listTitle"), to: "/compte/visas" },
 { label: reference },
 ]}
 >
 {state?.justSubmitted ? (
 <p className="mb-4 border border-line bg-[rgba(74,143,212,0.08)] px-4 py-3 text-sm font-semibold text-navy">
 {state.message || t("visaPre.submitSuccess")}
 </p>
 ) : null}

 {error ? <p className="text-sm text-rdc-red">{error}</p> : null}
 {!item && !error ? <p className="text-sm text-muted">{t("common.loading")}</p> : null}

 {item ? (
 <section className="border border-line bg-white p-5">
 <dl className="grid gap-3 text-sm sm:grid-cols-2">
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.reference")}</dt>
 <dd className="text-muted">{item.reference}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.statusLabel")}</dt>
 <dd className="text-muted">
 {t(`visaPre.status.${item.status}`, { defaultValue: item.status })}
 </dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.visaType")}</dt>
 <dd className="text-muted">
 {t(`visaPre.types.${item.visa_type}`, { defaultValue: item.visa_type })}
 </dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("account.fullName")}</dt>
 <dd className="text-muted">
 {item.nom} {item.post_nom} {item.prenom}
 </dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.passeportNumero")}</dt>
 <dd className="text-muted">{item.passeport_numero}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.destination")}</dt>
 <dd className="text-muted">{item.lieu_destination}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.dateEntree")}</dt>
 <dd className="text-muted">{item.date_entree_prevue}</dd>
 </div>
 <div>
 <dt className="font-semibold text-navy">{t("visaPre.dateSortie")}</dt>
 <dd className="text-muted">{item.date_sortie_prevue}</dd>
 </div>
 <div className="sm:col-span-2">
 <dt className="font-semibold text-navy">{t("visaPre.motif")}</dt>
 <dd className="text-muted">{item.motif_voyage}</dd>
 </div>
 <div className="sm:col-span-2">
 <dt className="font-semibold text-navy">{t("visaPre.docsReviewTitle")}</dt>
 <dd className="text-muted">
 {item.documents && item.documents.length > 0 ? (
 <ul className="mt-1 list-disc pl-5">
 {item.documents.map((doc) => (
 <li key={doc.id}>
 {t(`visaPre.docTypes.${doc.doc_type}`, { defaultValue: doc.doc_type })} {" "}
 {doc.original_name}
 </li>
 ))}
 </ul>
 ) : (
 t("visaPre.docMissing")
 )}
 </dd>
 </div>
 </dl>
 <p className="mt-5 text-sm text-muted">{t("visaPre.disclaimer")}</p>
 </section>
 ) : null}

 <p className="mt-6 flex flex-wrap gap-4 text-sm">
 <Link to="/compte/visas" className="font-semibold text-navy underline">
 {t("visaPre.backToList")}
 </Link>
 <Link to="/compte" className="font-semibold text-navy underline">
 {t("account.backToDashboard")}
 </Link>
 </p>
 </PageShell>
 );
}
