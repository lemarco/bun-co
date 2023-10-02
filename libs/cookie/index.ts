import { CookieOptions, serialize } from "./src/cookie";
import { cookieParser } from "./src/parser";

export type CookieManager = {
  set: (name: string, value: string, opts?: CookieOptions) => void;
  get: (name: string) => string | undefined;
  remove: (name: string) => void;
};
export const CookieManagerCons = (
  reqHeaders: Headers,
  resHeaders: Headers
): CookieManager => {
  const cookies = cookieParser(reqHeaders)[0];

  return {
    set: (name: string, value: string, opts?: CookieOptions) =>
      resHeaders.set("Set-Cookie", serialize(name, value, opts)),
    get: (name: string): string | undefined => cookies?.[name],
    remove: (name: string) =>
      resHeaders.set(
        "Set-Cookie",
        `${name}=; Expires=${new Date(0).toUTCString()}; Path=/`
      ),
  };
};
