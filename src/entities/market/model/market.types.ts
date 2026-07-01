import type { z } from 'zod';
import type { divineChaosRateSchema, freshnessStatusSchema } from './market.schemas';

export type TDivineChaosRate = z.infer<typeof divineChaosRateSchema>;
export type TFreshnessStatus = z.infer<typeof freshnessStatusSchema>;
