import { describe, expect, it } from 'vitest';
import {
  groupedScarabsResponseSchema,
  scarabBlockingCalculateResponseSchema,
  scarabBlockingCombinationsResponseSchema,
} from './scarab.schemas';

describe('scarab schemas', () => {
  it('parses grouped scarabs with nullable group and price fields', () => {
    const parsed = groupedScarabsResponseSchema.parse({
      data: {
        groups: [
          {
            groupId: null,
            groupName: 'Generic / Ungrouped',
            isBlockable: false,
            scarabCount: 1,
            groupIconUrl: null,
            enabledScarabCount: 1,
            pricedScarabCount: 0,
            missingPriceScarabCount: 1,
            totalWeight: 50,
            pricedWeight: 0,
            expectedValue: null,
            expectedValueMoney: null,
            scarabs: [
              {
                item: {
                  id: 'scarab-generic',
                  name: 'Generic Scarab',
                  category: 'scarab',
                  iconUrl: null,
                  tradeUrl: null,
                  createdAt: 1,
                  updatedAt: 2,
                },
                group: null,
                dropWeight: 50,
                isEnabled: true,
                isIncludedInCalculation: true,
                price: null,
                data: {
                  source: 'seed',
                  sourceUpdatedAt: null,
                  updatedAt: 3,
                },
              },
            ],
          },
        ],
        freshness: {
          isComplete: false,
          isStale: true,
          missingPriceScarabCount: 1,
          stalePriceScarabCount: 1,
          latestPriceCapturedAt: 10,
          oldestPriceCapturedAt: 5,
          staleAfterMs: 86_400_000,
        },
      },
    });

    expect(parsed.data.groups[0]?.scarabs[0]?.price).toBeNull();
    expect(parsed.data.groups[0]?.groupId).toBeNull();
  });

  it('parses money values for scarab prices and aggregate expected values', () => {
    const parsed = groupedScarabsResponseSchema.parse({
      data: {
        groups: [
          {
            groupId: 'ambush',
            groupName: 'Ambush',
            isBlockable: true,
            scarabCount: 1,
            groupIconUrl: null,
            enabledScarabCount: 1,
            pricedScarabCount: 1,
            missingPriceScarabCount: 0,
            totalWeight: 100,
            pricedWeight: 100,
            expectedValue: 50,
            expectedValueMoney: { chaos: 50, divine: 0.25 },
            scarabs: [
              {
                item: {
                  id: 'scarab-ambush',
                  name: 'Ambush Scarab',
                  category: 'scarab',
                  iconUrl: null,
                  tradeUrl: null,
                  createdAt: 1,
                  updatedAt: 2,
                },
                group: {
                  id: 'ambush',
                  name: 'Ambush',
                  isBlockable: true,
                },
                dropWeight: 100,
                isEnabled: true,
                isIncludedInCalculation: true,
                price: {
                  chaos: 50,
                  value: { chaos: 50, divine: 0.25 },
                  source: 'poe.ninja',
                  capturedAt: 10,
                },
                data: {
                  source: 'seed',
                  sourceUpdatedAt: null,
                  updatedAt: 3,
                },
              },
            ],
          },
        ],
        freshness: {
          isComplete: true,
          isStale: false,
          missingPriceScarabCount: 0,
          stalePriceScarabCount: 0,
          latestPriceCapturedAt: 10,
          oldestPriceCapturedAt: 10,
          staleAfterMs: 86_400_000,
        },
      },
    });

    expect(parsed.data.groups[0]?.expectedValueMoney?.divine).toBe(0.25);
    expect(parsed.data.groups[0]?.scarabs[0]?.price?.value?.divine).toBe(0.25);
  });

  it('parses blocking results with blocked group metadata for combinations and calculation', () => {
    const blockingResult = {
      expectedValue: 125,
      expectedValueMoney: { chaos: 125, divine: 0.625 },
      totalWeight: 100,
      includedScarabCount: 3,
      missingPriceScarabCount: 0,
      missingPriceScarabIds: [],
      stalePriceScarabIds: [],
      isComplete: true,
      isStale: false,
      blockedGroupIds: ['ambush'],
      blockedGroups: [
        {
          groupId: 'ambush',
          groupName: 'Ambush',
          groupIconUrl: 'https://example.test/ambush.png',
          isBlockable: true,
        },
      ],
      baseline: {
        expectedValue: 100,
        expectedValueMoney: { chaos: 100, divine: 0.5 },
        totalWeight: 200,
        includedScarabCount: 4,
        missingPriceScarabCount: 0,
        missingPriceScarabIds: [],
        stalePriceScarabIds: [],
        isComplete: true,
        isStale: false,
      },
      absoluteImprovement: 25,
      absoluteImprovementMoney: { chaos: 25, divine: 0.125 },
      percentageImprovement: 25,
      removedWeight: 100,
      remainingWeight: 100,
      removedScarabCount: 1,
      remainingScarabCount: 3,
      removedScarabIds: ['scarab-ambush'],
      remainingScarabIds: ['scarab-breach'],
    };
    const freshness = {
      isComplete: true,
      isStale: false,
      missingPriceScarabCount: 0,
      stalePriceScarabCount: 0,
      latestPriceCapturedAt: 10,
      oldestPriceCapturedAt: 10,
      staleAfterMs: 86_400_000,
    };

    const combinations = scarabBlockingCombinationsResponseSchema.parse({
      data: { combinations: [blockingResult], freshness },
    });
    const calculation = scarabBlockingCalculateResponseSchema.parse({
      data: { result: blockingResult, freshness },
    });

    expect(combinations.data.combinations[0]?.blockedGroups[0]).toEqual(
      expect.objectContaining({
        groupName: 'Ambush',
        groupIconUrl: 'https://example.test/ambush.png',
      }),
    );
    expect(calculation.data.result.blockedGroups[0]?.isBlockable).toBe(true);
  });
});
