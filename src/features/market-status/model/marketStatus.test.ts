import { describe, expect, it } from 'vitest';
import {
  formatDivineChaosRate,
  formatFreshnessDate,
  getLatestFreshnessTimestamp,
  type TRelativeTimeUnit,
} from './marketStatus';

const formatEnglishRelativeTime = (unit: TRelativeTimeUnit, count: number) => {
  const suffix = count === 1 ? unit : `${unit}s`;

  return `${count} ${suffix} ago`;
};

const formatRussianRelativeTime = (unit: TRelativeTimeUnit, count: number) => {
  const units = {
    second: 'сек. назад',
    minute: 'мин. назад',
    hour: 'ч. назад',
  } satisfies Record<TRelativeTimeUnit, string>;

  return `${count} ${units[unit]}`;
};

describe('marketStatus', () => {
  it('formats divine chaos rates compactly', () => {
    expect(formatDivineChaosRate(172.45)).toBe('172.5');
  });

  it('uses the latest available freshness timestamp', () => {
    expect(
      getLatestFreshnessTimestamp({
        leagueId: 'mercenaries',
        lastSuccessfulSyncFinishedAt: 1000,
        lastRecalculatedAt: 2000,
      }),
    ).toBe(2000);
  });

  it('formats missing freshness dates as a placeholder', () => {
    expect(formatFreshnessDate(null)).toBe('No data');
  });

  it('formats freshness dates as seconds ago', () => {
    expect(
      formatFreshnessDate(10_000, 'No data', formatEnglishRelativeTime, 40_000),
    ).toBe('30 seconds ago');
  });

  it('formats freshness dates as minutes ago', () => {
    expect(
      formatFreshnessDate(
        10_000,
        'No data',
        formatEnglishRelativeTime,
        190_000,
      ),
    ).toBe('3 minutes ago');
  });

  it('formats freshness dates as hours ago', () => {
    expect(
      formatFreshnessDate(
        10_000,
        'No data',
        formatEnglishRelativeTime,
        7_210_000,
      ),
    ).toBe('2 hours ago');
  });

  it('uses provided translations for relative time', () => {
    expect(
      formatFreshnessDate(
        10_000,
        'Нет данных',
        formatRussianRelativeTime,
        190_000,
      ),
    ).toBe('3 мин. назад');
  });
});
