import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import he from '../../public/translations/he.json';


i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        // lng: 'he',
        debug: true,
        supportedLngs: ['en', 'he'],
        nonExplicitSupportedLngs: false,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: './translations/{{lng}}.json'
        },
    });

export default i18n
