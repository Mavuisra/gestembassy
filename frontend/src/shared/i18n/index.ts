import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import ko from "./locales/ko.json";

const initialLocale = localStorage.getItem("ambadrcor-locale") ?? "fr";

void i18n.use(initReactI18next).init({
 resources: {
 fr: { translation: fr },
 en: { translation: en },
 ko: { translation: ko },
 },
 lng: initialLocale,
 fallbackLng: "fr",
 interpolation: { escapeValue: false },
});

document.documentElement.lang = i18n.resolvedLanguage ?? initialLocale;

i18n.on("languageChanged", (lng) => {
 document.documentElement.lang = lng;
});

export default i18n;

export function setLocale(locale: "fr" | "en" | "ko") {
 localStorage.setItem("ambadrcor-locale", locale);
 void i18n.changeLanguage(locale);
}
