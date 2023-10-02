export type HeadersManager = {
  set: (name: string, value: string) => void;
  get: (name: string) => string | null;
};
export const HeadersManagerCons = (
  reqHeaders: Headers,
  resHeaders: Headers
): HeadersManager => ({
  set: (name: string, value: string) => resHeaders.set(name, value),
  get: (name: string): string | null => reqHeaders.get(name),
});
