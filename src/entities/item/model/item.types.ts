import { z } from 'zod';
import type { itemSchema } from './item.schemas';

export type TItem = z.infer<typeof itemSchema>;
