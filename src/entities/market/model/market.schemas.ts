import { createApiDataResponseSchema } from '@/shared/model';
import { z } from 'zod';

export const divineChaosRateSchema = z.object({
  leagueId: z.string(),
  chaosValue: z.number(),
  capturedAt: z.number().int(),
  syncRunId: z.string(),
});

export const freshnessStatusSchema = z.object({
  leagueId: z.string(),
  lastSuccessfulSyncFinishedAt: z.number().int().nullable(),
  lastRecalculatedAt: z.number().int().nullable(),
});

export const divineChaosRateResponseSchema =
  createApiDataResponseSchema(divineChaosRateSchema);

export const freshnessStatusResponseSchema =
  createApiDataResponseSchema(freshnessStatusSchema);
