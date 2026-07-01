export const normalizeUrl = (url: string): string => {
  return url.trim().replace(/\/+$/, '');
};
