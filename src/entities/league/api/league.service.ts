import { BaseService } from '@/shared/api';
import { createApiResponseSchema } from '@/shared/model';
import { leagueSchema } from '../model/league.schemas';
import type { TLeague } from '../model/league.types';

const ENDPOINT = '/leagues';
const leagueListResponseSchema = createApiResponseSchema(leagueSchema);

class LeagueService extends BaseService {
  constructor() {
    super(ENDPOINT);
  }

  async getLeagues(): Promise<TLeague[]> {
    const response = await this.get();

    const parsed = leagueListResponseSchema.parse(response);

    return parsed.data;
  }
}

export const leagueService = new LeagueService();
