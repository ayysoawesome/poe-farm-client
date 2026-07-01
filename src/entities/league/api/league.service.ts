import { BaseService } from '@/shared/api';
import { z } from 'zod';
import { leagueSchema } from '../model/league.schemas';
import type { TLeague } from '../model/league.types';

const ENDPOINT = '/leagues';

class LeagueService extends BaseService {
  constructor() {
    super(ENDPOINT);
  }

  async getLeagues(): Promise<TLeague[]> {
    const response = await this.get();

    const parsed = z.object({ data: z.array(leagueSchema) }).parse(response);

    return parsed.data;
  }
}

export const leagueService = new LeagueService();
