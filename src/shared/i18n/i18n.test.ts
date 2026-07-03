import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createAppI18n,
  DEFAULT_LANGUAGE,
  getStoredLanguage,
  LANGUAGE_STORAGE_KEY,
  setStoredLanguage,
  supportedLanguages,
} from './i18n';

const createLocalStorage = () => {
  const values = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
  } as Pick<Storage, 'getItem' | 'setItem'>;
};

describe('createAppI18n', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('initializes english translations by default', () => {
    const i18n = createAppI18n();

    expect(i18n.language).toBe(DEFAULT_LANGUAGE);
    expect(i18n.t('app.subtitle')).toBe('Boss profitability');
  });

  it('uses a valid stored language as the initial language', () => {
    const localStorage = createLocalStorage();
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'ru');
    vi.stubGlobal('localStorage', localStorage);

    const i18n = createAppI18n();

    expect(getStoredLanguage()).toBe('ru');
    expect(i18n.language).toBe('ru');
    expect(i18n.t('app.subtitle')).toBe('Доходность боссов');
  });

  it('falls back to english when the stored language is unsupported', () => {
    const localStorage = createLocalStorage();
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'de');
    vi.stubGlobal('localStorage', localStorage);

    const i18n = createAppI18n();

    expect(getStoredLanguage()).toBeNull();
    expect(i18n.language).toBe(DEFAULT_LANGUAGE);
  });

  it('stores supported language selections', () => {
    const localStorage = createLocalStorage();
    vi.stubGlobal('localStorage', localStorage);

    setStoredLanguage('ru');

    expect(localStorage.setItem).toHaveBeenCalledWith(
      LANGUAGE_STORAGE_KEY,
      'ru',
    );
    expect(getStoredLanguage()).toBe('ru');
  });

  it('switches language at runtime', async () => {
    const i18n = createAppI18n();

    await i18n.changeLanguage('ru');

    expect(i18n.t('app.subtitle')).toBe('Доходность боссов');
  });

  it('translates market relative time labels', async () => {
    const i18n = createAppI18n();

    expect(i18n.t('market.relative.minute', { count: 3 })).toBe(
      '3 minutes ago',
    );

    await i18n.changeLanguage('ru');

    expect(i18n.t('market.relative.minute', { count: 3 })).toBe(
      '3 мин. назад',
    );
  });

  it('defines flag metadata for supported languages', () => {
    expect(supportedLanguages).toEqual([
      { code: 'en', flagCode: 'us', label: 'EN' },
      { code: 'ru', flagCode: 'ru', label: 'RU' },
    ]);
  });
});
