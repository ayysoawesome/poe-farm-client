import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { scarabService } from '@/entities/scarab';
import { getLeagueIdFromPathname } from '@/features/select-league/model/selectLeague';
import { queryKeys } from '@/shared/api';
import { UISkeleton } from '@/shared/ui';
import { BlockingCombinationsTable } from './BlockingCombinationsTable';
import { ScarabFreshnessNotice } from './ScarabFreshnessNotice';

const MAX_BLOCKED_GROUPS = 12;
const COMBINATIONS_LIMIT = 500;

export const ScarabBlockingPage: FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const leagueId = getLeagueIdFromPathname(location.pathname);

  const combinationsQuery = useQuery({
    queryKey: queryKeys.scarabs.blockingCombinations(
      leagueId ?? '',
      MAX_BLOCKED_GROUPS,
      COMBINATIONS_LIMIT,
    ),
    queryFn: () =>
      scarabService.getBlockingCombinations({
        leagueId: leagueId!,
        maxBlockedGroups: MAX_BLOCKED_GROUPS,
        limit: COMBINATIONS_LIMIT,
      }),
    enabled: Boolean(leagueId),
  });

  if (!leagueId || combinationsQuery.isLoading) {
    return (
      <UISkeleton className='block h-80 w-full rounded-md border border-border bg-surface shadow-panel' />
    );
  }

  return (
    <section className='grid gap-6'>
      {combinationsQuery.isError ? (
        <div className='rounded-md border border-border bg-surface px-5 py-4 text-lg text-loss'>
          {t('scarabs.errors.combinations')}
        </div>
      ) : (
        <>
          <ScarabFreshnessNotice
            freshness={combinationsQuery.data?.freshness}
          />
          <div className='flex flex-col gap-4'>
            <div>
              <h1 className='m-0 text-3xl font-bold text-white'>
                {t('scarabs.combinations.title')}
              </h1>
              <p className='m-0 mt-2 text-lg text-muted'>
                {t('scarabs.combinations.description')}
              </p>
            </div>
            <BlockingCombinationsTable
              combinations={combinationsQuery.data?.combinations ?? []}
            />
          </div>
        </>
      )}
    </section>
  );
};
