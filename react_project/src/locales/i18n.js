import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './en/translation.json';
import translationVI from './vi/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEN },
      vi: { translation: translationVI },
    },
    lng: 'vi', // Ngôn ngữ mặc định
    fallbackLng: 'en', // Ngôn ngữ fallback nếu không tìm thấy bản dịch
    interpolation: {
      escapeValue: false, // Không cần escape cho React
    },
  });

export default i18n;
