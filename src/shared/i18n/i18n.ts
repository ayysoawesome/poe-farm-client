import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { ru } from './locales/ru';

export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_STORAGE_KEY = 'poe-farm.language';

export const supportedLanguages = [
  { code: 'en', flagCode: 'us', label: 'EN' },
  { code: 'ru', flagCode: 'ru', label: 'RU' },
] as const;

export type TLanguage = (typeof supportedLanguages)[number]['code'];

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
} satisfies Record<TLanguage, { translation: object }>;

export const isSupportedLanguage = (language: string): language is TLanguage =>
  supportedLanguages.some((supportedLanguage) => {
    return supportedLanguage.code === language;
  });

export const getStoredLanguage = (): TLanguage | null => {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return storedLanguage && isSupportedLanguage(storedLanguage)
    ? storedLanguage
    : null;
};

export const setStoredLanguage = (language: TLanguage) => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

export const createAppI18n = () => {
  const instance = i18next.createInstance();

  void instance.use(initReactI18next).init({
    resources,
    lng: getStoredLanguage() ?? DEFAULT_LANGUAGE,
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
