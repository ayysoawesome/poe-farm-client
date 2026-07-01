import { apiClient } from '@/shared/api';
import {
  divineChaosRateResponseSchema,
  freshnessStatusResponseSchema,
} from '../model/market.schemas';
import type { TDivineChaosRate, TFreshnessStatus } from '../model/market.types';

class MarketService {
  async getDivineChaosRate(leagueId: string): Promise<TDivineChaosRate> {
    const response = await apiClient<unknown>('/prices/divine-chaos', {
      query: { leagueId },
    });
    const parsed = divineChaosRateResponseSchema.parse(response);

    return parsed.data;
  }

  async getFreshnessStatus(leagueId: string): Promise<TFreshnessStatus> {
    const response = await apiClient<unknown>('/status', {
      query: { leagueId },
    });
    const parsed = freshnessStatusResponseSchema.parse(response);

    return parsed.data;
  }
}

export const marketService = new MarketService();
