import { z } from 'zod';

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  iconUrl: z.string().nullable(),
});
