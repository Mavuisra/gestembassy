import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../../shared/hooks/usePageTitle";
import { PageShell } from "../../shared/ui/PageShell";

export function NotFoundPage() {
 const { t } = useTranslation();
 usePageTitle("notFound.title");

 return (
 <PageShell
 title={t("notFound.title")}
 subtitle={t("notFound.body")}
 crumbs={[
 { label: t("nav.home"), to: "/" },
 { label: "404" },
 ]}
 narrow
 >
 <p className="text-sm font-bold uppercase tracking-widest text-rdc-red">404</p>
 <Link to="/" className="btn-blue mt-8">
 {t("notFound.home")}
 </Link>
 </PageShell>
 );
}
