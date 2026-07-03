import type { TProfitResponse } from '@/entities/boss';

export interface IProfitHistoryChartPoint {
  id: string;
  timestamp: number;
  label: string;
  entryCost: number;
  expectedReturn: number;
  expectedProfit: number;
  roiPercent: number;
}

const singlePointDomainPaddingMs = 30 * 60 * 1000;

export const formatProfitHistoryChartDate = (
  timestamp: number,
  language: string,
) =>
  new Intl.DateTimeFormat(language, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

export const buildProfitHistoryChartData = (
  history: TProfitResponse[],
  language = 'en',
): IProfitHistoryChartPoint[] =>
  [...history]
    .sort((left, right) => left.calculatedAt - right.calculatedAt)
    .map((snapshot) => ({
      id: snapshot.id,
      timestamp: snapshot.calculatedAt,
      label: formatProfitHistoryChartDate(snapshot.calculatedAt, language),
      entryCost: snapshot.entryCost.divine,
      expectedReturn: snapshot.expectedReturn.divine,
      expectedProfit: snapshot.expectedProfit.divine,
      roiPercent: snapshot.roiPercent,
    }));

export const getProfitHistoryChartDomain = (
  chartData: IProfitHistoryChartPoint[],
): [number, number] => {
  const timestamps = chartData.map((point) => point.timestamp);
  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);

  if (minTimestamp === maxTimestamp) {
    return [
      minTimestamp - singlePointDomainPaddingMs,
      maxTimestamp + singlePointDomainPaddingMs,
    ];
  }

  return [minTimestamp, maxTimestamp];
};
