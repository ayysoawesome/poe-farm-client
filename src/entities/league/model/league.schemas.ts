import { z } from 'zod';

export const leagueSchema = z.object({
  id: z.string(),
  name: z.string(),
  isActive: z.boolean(),
});
