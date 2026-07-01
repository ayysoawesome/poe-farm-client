import { ofetch } from 'ofetch';
import { envConfig, normalizeUrl } from '../lib';

interface ICreateApiClientInstanceProps {
  baseURL: string;
}

const createApiClientInstance = ({
  baseURL,
}: ICreateApiClientInstanceProps) => {
  return ofetch.create({
    baseURL: normalizeUrl(baseURL),
    timeout: 15_000,
    retryStatusCodes: [408, 429, 500, 502, 503, 504],
  });
};

export const apiClient = createApiClientInstance({
  baseURL: envConfig.baseApiUrl,
});
