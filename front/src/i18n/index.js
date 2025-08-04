import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en.json";
import translationAR from "./locales/ar.json";
import translationFR from "./locales/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      ar: { translation: translationAR },
      fr: { translation: translationFR },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
