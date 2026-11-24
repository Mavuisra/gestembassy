import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/** Met à jour le titre d'onglet (clé i18n ou libellé brut). */
export function usePageTitle(title: string, options?: { raw?: boolean; suffixKey?: string }) {
 const { t, i18n } = useTranslation();
 const suffixKey = options?.suffixKey ?? "brand.short";
 const raw = options?.raw ?? false;

 useEffect(() => {
 const label = raw ? title : t(title);
 document.title = `${label} ${t(suffixKey)}`;
 }, [t, title, suffixKey, raw, i18n.language]);
}
