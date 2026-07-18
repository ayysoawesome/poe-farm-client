import { BaseService } from '@/shared/api';
import {
  groupedScarabsResponseSchema,
  scarabBlockingCalculateResponseSchema,
  scarabBlockingCombinationsResponseSchema,
  scarabGroupsResponseSchema,
} from '../model/scarab.schemas';
import type {
  TBlockingCombinationsQuery,
  TGroupedScarabsResponse,
  TScarabBlockingCombinationsResponse,
  TScarabBlockingResult,
  TScarabGroupsResponse,
} from '../../../pages/bosses/ui/scarab.types';

const ENDPOINT = '/scarabs';

class ScarabService extends BaseService {
  constructor() {
    super(ENDPOINT);
  }

  async getGroupedScarabs(leagueId: string): Promise<TGroupedScarabsResponse> {
    const response = await this.get(undefined, { leagueId });
    const result = groupedScarabsResponseSchema.parse(response);

    return result.data;
  }

  async getGroups(leagueId: string): Promise<TScarabGroupsResponse> {
    const response = await this.get('groups', { leagueId });
    const result = scarabGroupsResponseSchema.parse(response);

    return result.data;
  }

  async getBlockingCombinations({
    leagueId,
    maxBlockedGroups,
    limit,
  }: TBlockingCombinationsQuery): Promise<TScarabBlockingCombinationsResponse> {
    const response = await this.get('blocking-combinations', {
      leagueId,
      maxBlockedGroups,
      limit,
    });
    const result = scarabBlockingCombinationsResponseSchema.parse(response);

    return result.data;
  }

  async calculateBlocking(
    leagueId: string,
    blockedGroupIds: string[],
  ): Promise<TScarabBlockingResult> {
    const response = await this.post(
      'blocking-calculate',
      { blockedGroupIds },
      { leagueId },
    );
    const result = scarabBlockingCalculateResponseSchema.parse(response);

    return result.data.result;
  }
}

export const scarabService = new ScarabService();
