import { BaseService } from '@/shared/api';
import { createApiResponseSchema } from '@/shared/model';
import {
  bossDetailResponseSchema,
  bossWithProfitSchema,
  profitResponseSchema,
} from '../model/boss.schema';
import type {
  TBossDetail,
  TBossWithProfit,
  TProfitResponse,
} from '../model/boss.type';

const ENDPOINT = '/bosses';
const bossListApiResponseSchema = createApiResponseSchema(bossWithProfitSchema);
const profitHistoryApiResponseSchema =
  createApiResponseSchema(profitResponseSchema);

class BossService extends BaseService {
  constructor() {
    super(ENDPOINT);
  }

  async getBosses(leagueId: string): Promise<TBossWithProfit[]> {
    const response = await this.get(undefined, { leagueId });
    const result = bossListApiResponseSchema.parse(response);

    return result.data;
  }

  async getBossById(id: string, leagueId: string): Promise<TBossDetail> {
    const response = await this.get(id, { leagueId });
    const result = bossDetailResponseSchema.parse(response);
    return result.data;
  }

  async getProfitHistory(
    id: string,
    leagueId: string,
  ): Promise<TProfitResponse[]> {
    const response = await this.apiClient<unknown>(`/profit/${id}/history`, {
      query: { leagueId },
    });
    const result = profitHistoryApiResponseSchema.parse(response);
    return result.data;
  }
}

export const bossService = new BossService();
