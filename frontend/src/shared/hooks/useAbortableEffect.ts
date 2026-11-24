import { useEffect } from "react";

/**
 * useEffect avec AbortController : annule le fetch au démontage
 * ou quand les dépendances changent (évite les courses i18n).
 */
export function useAbortableEffect(
 effect: (signal: AbortSignal) => void | Promise<void>,
 deps: unknown[],
) {
 useEffect(() => {
 const controller = new AbortController();
 void effect(controller.signal);
 return () => controller.abort();
 // eslint-disable-next-line react-hooks/exhaustive-deps -- deps fournies par l'appelant
 }, deps);
}
