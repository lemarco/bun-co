import { parse } from "./cookie";
import { unsign } from "./signature";
export function cookieParser(
  headers: Headers,
  secret?: string
): [Record<string, string>, Record<string, string> | undefined] {
  const cookies = headers.get("cookie");
  if (!cookies) {
    return [Object.create(null), Object.create(null)];
  }
  const cookiesParsed = parse(cookies);
  return [
    JSONCookies(cookiesParsed),
    secret ? JSONCookies(signedCookies(cookiesParsed, secret)) : undefined,
  ];
}

function JSONCookie(str: string) {
  if (typeof str !== "string" || str.slice(0, 2) !== "j:") {
    return undefined;
  }

  try {
    return JSON.parse(str.slice(2));
  } catch (err) {
    return undefined;
  }
}

function JSONCookies(obj: Record<string, string>) {
  const cookies = Object.keys(obj);
  let key;
  let val;

  for (var i = 0; i < cookies.length; i++) {
    key = cookies[i];
    val = JSONCookie(obj[key]);

    if (val) {
      obj[key] = val;
    }
  }

  return obj;
}

function signedCookie(str: string, secret: string): string | undefined {
  if (typeof str !== "string") {
    return undefined;
  }

  if (str.slice(0, 2) !== "s:") {
    return str;
  }

  let secrets = !secret || Array.isArray(secret) ? secret || [] : [secret];

  for (let i = 0; i < secrets.length; i++) {
    let val = unsign(str.slice(2), secrets[i]);

    if (val !== false) {
      return val;
    }
  }

  return;
}

function signedCookies(
  obj: Record<string, string>,
  secret: string
): Record<string, string> {
  let cookies = Object.keys(obj);
  let dec;
  let key;
  let ret = Object.create(null);
  let val;

  for (let i = 0; i < cookies.length; i++) {
    key = cookies[i];
    val = obj[key];
    dec = signedCookie(val, secret);

    if (val !== dec) {
      ret[key] = dec;
      delete obj[key];
    }
  }

  return ret;
}
