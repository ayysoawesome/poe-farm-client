import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const DEFAULT_LANGUAGE = 'en';

export const supportedLanguages = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
] as const;

export type TLanguage = (typeof supportedLanguages)[number]['code'];

const resources = {
  en: {
    translation: {
      app: {
        subtitle: 'Boss profitability',
      },
      language: {
        label: 'Language',
      },
    },
  },
  ru: {
    translation: {
      app: {
        subtitle: 'Доходность боссов',
      },
      language: {
        label: 'Язык',
      },
    },
  },
} satisfies Record<TLanguage, { translation: object }>;

export const createAppI18n = () => {
  const instance = i18next.createInstance();

  void instance.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: supportedLanguages.map((language) => language.code),
    interpolation: {
      escapeValue: false,
    },
    initAsync: false,
  });

  return instance;
};

export const appI18n = createAppI18n();
