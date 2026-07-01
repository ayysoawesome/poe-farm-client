import { describe, expect, it } from 'vitest';
import { createAppI18n, DEFAULT_LANGUAGE } from './i18n';

describe('createAppI18n', () => {
  it('initializes english translations by default', () => {
    const i18n = createAppI18n();

    expect(i18n.language).toBe(DEFAULT_LANGUAGE);
    expect(i18n.t('app.subtitle')).toBe('Boss profitability');
  });

  it('switches language at runtime', async () => {
    const i18n = createAppI18n();

    await i18n.changeLanguage('ru');

    expect(i18n.t('app.subtitle')).toBe('Доходность боссов');
  });
});
