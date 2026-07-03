import { describe, expect, it } from 'vitest';
import type { TProfitResponse } from '@/entities/boss';
import {
  buildProfitHistoryChartData,
  getProfitHistoryChartDomain,
} from '../model/ProfitHistoryChart.model';

const createSnapshot = (
  id: string,
  calculatedAt: number,
  entryCost: number,
  expectedReturn: number,
  expectedProfit: number,
): TProfitResponse => ({
  id,
  bossId: 'boss-1',
  leagueId: 'league-1',
  entryCost: { chaos: entryCost * 100, divine: entryCost },
  expectedReturn: { chaos: expectedReturn * 100, divine: expectedReturn },
  expectedProfit: { chaos: expectedProfit * 100, divine: expectedProfit },
  roiPercent: 25,
  isComplete: true,
  unknownDropCount: 0,
  calculatedAt,
});

describe('buildProfitHistoryChartData', () => {
  it('sorts snapshots chronologically and maps divine price values', () => {
    const data = buildProfitHistoryChartData([
      createSnapshot('later', 3000, 4, 7, 3),
      createSnapshot('earlier', 1000, 2, 5, 3),
    ]);

    expect(data).toEqual([
      expect.objectContaining({
        id: 'earlier',
        timestamp: 1000,
        label: expect.any(String),
        entryCost: 2,
        expectedReturn: 5,
        expectedProfit: 3,
        roiPercent: 25,
      }),
      expect.objectContaining({
        id: 'later',
        timestamp: 3000,
        label: expect.any(String),
        entryCost: 4,
        expectedReturn: 7,
        expectedProfit: 3,
        roiPercent: 25,
      }),
    ]);
  });

  it('formats labels with the requested language', () => {
    const timestamp = Date.UTC(2026, 0, 5, 13, 30);
    const [point] = buildProfitHistoryChartData(
      [createSnapshot('snapshot', timestamp, 2, 5, 3)],
      'ru',
    );

    expect(point.label).toContain('янв.');
  });
});

describe('getProfitHistoryChartDomain', () => {
  it('uses only the actual snapshot timestamp range for the x-axis domain', () => {
    const data = buildProfitHistoryChartData([
      createSnapshot('first', 1_760_000_000_000, 2, 5, 3),
      createSnapshot('second', 1_760_003_600_000, 4, 7, 3),
    ]);

    expect(getProfitHistoryChartDomain(data)).toEqual([
      1_760_000_000_000, 1_760_003_600_000,
    ]);
  });

  it('adds a short range around a single snapshot so the point is readable', () => {
    const data = buildProfitHistoryChartData([
      createSnapshot('only', 1_760_000_000_000, 2, 5, 3),
    ]);

    expect(getProfitHistoryChartDomain(data)).toEqual([
      1_759_998_200_000, 1_760_001_800_000,
    ]);
  });
});
