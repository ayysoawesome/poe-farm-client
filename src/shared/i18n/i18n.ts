import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const DEFAULT_LANGUAGE = 'en';

export const supportedLanguages = [
  { code: 'en', flagCode: 'us', label: 'EN' },
  { code: 'ru', flagCode: 'ru', label: 'RU' },
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
      market: {
        noData: 'No data',
        relative: {
          hour_one: '{{count}} hour ago',
          hour_other: '{{count}} hours ago',
          minute_one: '{{count}} minute ago',
          minute_other: '{{count}} minutes ago',
          second_one: '{{count}} second ago',
          second_other: '{{count}} seconds ago',
        },
        updated: 'Updated',
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
      market: {
        noData: 'Нет данных',
        relative: {
          hour_few: '{{count}} ч. назад',
          hour_many: '{{count}} ч. назад',
          hour_one: '{{count}} ч. назад',
          hour_other: '{{count}} ч. назад',
          minute_few: '{{count}} мин. назад',
          minute_many: '{{count}} мин. назад',
          minute_one: '{{count}} мин. назад',
          minute_other: '{{count}} мин. назад',
          second_few: '{{count}} сек. назад',
          second_many: '{{count}} сек. назад',
          second_one: '{{count}} сек. назад',
          second_other: '{{count}} сек. назад',
        },
        updated: 'Обновлено',
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
