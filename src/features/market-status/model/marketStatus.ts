import type { TFreshnessStatus } from '@/entities/market';

export type TRelativeTimeUnit = 'second' | 'minute' | 'hour';
export type TRelativeTimeFormatter = (
  unit: TRelativeTimeUnit,
  count: number,
) => string;

export const formatDivineChaosRate = (value: number): string => {
  return value.toLocaleString('en', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });
};

export const getLatestFreshnessTimestamp = (
  status: TFreshnessStatus,
): number | null => {
  const timestamps = [
    status.lastSuccessfulSyncFinishedAt,
    status.lastRecalculatedAt,
  ].filter((timestamp): timestamp is number => timestamp !== null);

  return timestamps.length > 0 ? Math.max(...timestamps) : null;
};

export const formatFreshnessDate = (
  timestamp: number | null,
  fallback = 'No data',
  formatRelativeTime: TRelativeTimeFormatter = (unit, count) => {
    const suffix = count === 1 ? unit : `${unit}s`;

    return `${count} ${suffix} ago`;
  },
  now = Date.now(),
): string => {
  if (timestamp === null) {
    return fallback;
  }

  const elapsedSeconds = Math.max(0, Math.floor((now - timestamp) / 1000));

  if (elapsedSeconds < 60) {
    return formatRelativeTime('second', elapsedSeconds);
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  if (elapsedMinutes < 60) {
    return formatRelativeTime('minute', elapsedMinutes);
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  return formatRelativeTime('hour', elapsedHours);
};
