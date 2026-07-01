export const normalizeEndpoint = (endpoint: string): string => {
  const str = endpoint.trim();

  return str.startsWith('/') ? str : '/' + str;
};
