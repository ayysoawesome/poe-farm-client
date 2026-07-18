import type { FC } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TScarabFreshness } from '@/entities/scarab';

interface IScarabFreshnessNoticeProps {
  freshness?: TScarabFreshness;
}

export const ScarabFreshnessNotice: FC<IScarabFreshnessNoticeProps> = ({
  freshness,
}) => {
  const { t } = useTranslation();

  if (!freshness || (freshness.isComplete && !freshness.isStale)) return null;

  return (
    <div className='flex items-start gap-3 rounded-md border border-border-strong bg-surface px-4 py-3 text-base text-muted shadow-panel'>
      <AlertTriangle className='mt-0.5 size-5 shrink-0 text-gold-bright' />
      <div>
        <p className='m-0 font-semibold text-white'>
          {t('scarabs.freshness.title')}
        </p>
        <p className='m-0 mt-1'>
          {t('scarabs.freshness.description', {
            missing: freshness.missingPriceScarabCount,
            stale: freshness.stalePriceScarabCount,
          })}
        </p>
      </div>
    </div>
  );
};
