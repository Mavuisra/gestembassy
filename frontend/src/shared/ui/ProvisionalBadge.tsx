import { useTranslation } from "react-i18next";

export function ProvisionalBadge() {
 const { t } = useTranslation();
 return <span className="provisional-badge">{t("common.provisional")}</span>;
}
