import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import es from './locales/es.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

// Sincroniza la etiqueta <html lang="..."> con el idioma activo
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;