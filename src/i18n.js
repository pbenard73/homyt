import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import * as translation_fr from './translations/fr.json'
import * as translation_en from './translations/en.json'
import * as translation_it from './translations/it.json'
import * as translation_es from './translations/es.json'
import * as translation_pt from './translations/pt.json'
import * as translation_ar from './translations/ar.json'
import * as translation_tr from './translations/tr.json'

i18n
.use(LanguageDetector) // passes i18n down to react-
.use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
        fr: {translation: translation_fr},
        it: {translation: translation_it},
        en: {translation: translation_en},
        es: {translation: translation_es},
        pt: {translation: translation_pt},
        ar: {translation: translation_ar},
        tr: {translation: translation_tr},
    },
    //lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "fr",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });