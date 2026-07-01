import { z } from 'zod';
import { logger } from './logger';
import { normalizeUrl } from './normalizeUrl';

const envSchema = z.object({
  VITE_BASE_API_URL: z.url().refine(
    (value) => {
      if (!URL.canParse(value)) {
        return false;
      }

      const protocol = new URL(value).protocol;
      return protocol === 'http:' || protocol === 'https:';
    },
    { error: 'Expected an HTTP or HTTPS URL' },
  ),
});

export interface IEnvConfig {
  readonly baseApiUrl: string;
}

export const createEnvConfig = (
  env: Readonly<Record<string, unknown>>,
): IEnvConfig => {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    logger.error(result.error, {
      category: 'validation',
      context: { source: 'environment' },
    });

    throw new Error('Invalid environment configuration', {
      cause: result.error,
    });
  }

  return Object.freeze({
    baseApiUrl: normalizeUrl(result.data.VITE_BASE_API_URL),
  });
};

export const envConfig = createEnvConfig(import.meta.env);
