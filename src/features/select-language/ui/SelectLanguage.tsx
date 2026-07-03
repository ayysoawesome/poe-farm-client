import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  setStoredLanguage,
  supportedLanguages,
  type TLanguage,
} from '@/shared/i18n';
import { UISelect, type IUISelectOption } from '@/shared/ui';
import { LanguageFlag } from './LanguageFlag';

export const SelectLanguage: FC = () => {
  const { i18n, t } = useTranslation();
  const activeLanguage = i18n.resolvedLanguage ?? i18n.language;
  const options: IUISelectOption[] = supportedLanguages.map((language) => ({
    value: language.code,
    label: (
      <span className='flex items-center gap-2'>
        <LanguageFlag code={language.flagCode} />
        <span>{language.label}</span>
      </span>
    ),
  }));

  const handleLanguageChange = (language: TLanguage) => {
    void i18n.changeLanguage(language);
    setStoredLanguage(language);
  };

  return (
    <UISelect
      label={t('language.label')}
      options={options}
      value={activeLanguage}
      onValueChange={(language) => handleLanguageChange(language as TLanguage)}
      className='min-w-28 text-sm'
      buttonClassName='h-12 min-h-12 px-3'
    />
  );
};
