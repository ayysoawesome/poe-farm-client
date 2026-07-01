export { bossService } from './api/boss.service';
export {
  bossListResponseSchema,
  bossSchema,
  bossDetailResponseSchema,
  bossDetailSchema,
  bossWithProfitSchema,
  profitHistoryResponseSchema,
  profitResponseSchema,
  profitSnapshotSchema,
} from './model/boss.schema';
export type {
  TBoss,
  TBossDetail,
  TBossWithProfit,
  TProfitResponse,
  TProfitSnapshot,
} from './model/boss.type';
