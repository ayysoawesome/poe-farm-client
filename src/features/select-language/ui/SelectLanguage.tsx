import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, type TLanguage } from '@/shared/i18n';
import { cn } from '@/shared/lib';

export const SelectLanguage: FC = () => {
  const { i18n, t } = useTranslation();
  const activeLanguage = i18n.resolvedLanguage ?? i18n.language;

  const handleLanguageChange = (language: TLanguage) => {
    void i18n.changeLanguage(language);
  };

  return (
    <div
      className='flex shrink-0 items-center rounded border border-border bg-surface p-1'
      aria-label={t('language.label')}
    >
      {supportedLanguages.map((language) => {
        const isActive = activeLanguage === language.code;

        return (
          <button
            className={cn(
              'min-h-10 min-w-11 rounded px-3 text-sm font-bold text-muted transition hover:bg-surface-soft hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-bright',
              isActive && 'bg-surface-soft text-gold-bright',
            )}
            key={language.code}
            type='button'
            aria-pressed={isActive}
            onClick={() => handleLanguageChange(language.code)}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
};
