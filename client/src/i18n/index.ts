import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import de from './languages/de';
import en from './languages/en';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'de',
    resources: {
      de: { translation: de },
      en: { translation: en },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
