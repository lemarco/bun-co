export const HeadersManager = (reqHeaders: Headers, resHeaders: Headers) => ({
  set: (name: string, value: string) => resHeaders.set(name, value),
  get: (name: string): string | null => reqHeaders.get(name),
});
