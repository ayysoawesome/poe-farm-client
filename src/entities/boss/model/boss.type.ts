import type { z } from 'zod';
import type {
  bossSchema,
  bossDetailSchema,
  bossWithProfitSchema,
  profitResponseSchema,
  profitSnapshotSchema,
} from './boss.schema';

export type TBoss = z.infer<typeof bossSchema>;
export type TBossDetail = z.infer<typeof bossDetailSchema>;
export type TBossWithProfit = z.infer<typeof bossWithProfitSchema>;
export type TProfitSnapshot = z.infer<typeof profitSnapshotSchema>;
export type TProfitResponse = z.infer<typeof profitResponseSchema>;
