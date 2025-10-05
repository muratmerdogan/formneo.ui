import ns1tr from "./locales/tr/ns1.json";
import ns1en from "./locales/en/ns1.json";
import landingTr from "./locales/tr/landing.json";
import landingEn from "./locales/en/landing.json";
import landingDe from "./locales/de/landing.json";
import landingFr from "./locales/fr/landing.json";
import landingEs from "./locales/es/landing.json";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
export const defaultNS = "ns1";
export const resources = {
  tr: {
    ns1: ns1tr,
    landing: landingTr,
  },
  en: {
    ns1: ns1en,
    landing: landingEn,
  },
  de: {
    landing: landingDe,
  },
  fr: {
    landing: landingFr,
  },
  es: {
    landing: landingEs,
  },
} as const;

i18n.use(LanguageDetector).use(initReactI18next).init({
  lng: "tr",
  supportedLngs: ["tr", "en", "de", "fr", "es"],
  fallbackLng: "tr",
  ns: ["ns1", "landing"],
  resources,
  defaultNS,
  compatibilityJSON: "v4",
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    lookupLocalStorage: 'i18nextLng',
    caches: ['localStorage']
  },
  interpolation: {
    escapeValue: false,
    defaultVariables: {},
  },
});

export default i18n;
