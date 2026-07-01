import type { FC, PropsWithChildren } from 'react';
import { I18nextProvider } from 'react-i18next';
import { appI18n } from '@/shared/i18n';

export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
  return <I18nextProvider i18n={appI18n}>{children}</I18nextProvider>;
};
