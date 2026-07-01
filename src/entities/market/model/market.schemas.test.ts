import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  divineChaosRateResponseSchema,
  freshnessStatusResponseSchema,
} from './market.schemas';
import type { TDivineChaosRate, TFreshnessStatus } from './market.types';

describe('market schemas', () => {
  it('parses divine chaos rate responses', () => {
    const parsed = divineChaosRateResponseSchema.parse({
      data: {
        leagueId: 'mercenaries',
        chaosValue: 172.5,
        capturedAt: 1767225600000,
        syncRunId: 'sync-1',
      },
    });

    expect(parsed.data.chaosValue).toBe(172.5);
    expectTypeOf(parsed.data).toEqualTypeOf<TDivineChaosRate>();
  });

  it('parses freshness status responses with nullable timestamps', () => {
    const parsed = freshnessStatusResponseSchema.parse({
      data: {
        leagueId: 'mercenaries',
        lastSuccessfulSyncFinishedAt: 1767225600000,
        lastRecalculatedAt: null,
      },
    });

    expect(parsed.data.lastRecalculatedAt).toBeNull();
    expectTypeOf(parsed.data).toEqualTypeOf<TFreshnessStatus>();
  });
});
