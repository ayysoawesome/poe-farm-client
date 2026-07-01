import type { z } from 'zod';
import type { leagueSchema } from './league.schemas';

export type TLeague = z.infer<typeof leagueSchema>;
