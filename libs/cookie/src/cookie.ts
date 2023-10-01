export type CookieOptions = {
  maxAge?: number;
  domain?: string;
  path?: string;
  sameSite?: "true" | "lax" | "strict" | "none";
  httpOnly?: boolean;
  secure?: boolean;
  priority?: "low" | "medium" | "high";
  expires?: Date;
};
// RegExp to match field-content in RFC 7230 sec 3.2
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
export function parse(str: string) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = Object.create(null);
  let index = 0;
  while (index < str.length) {
    let eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);

    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      // backtrack on prior semicolon
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    let key = str.slice(index, eqIdx).trim();
    // only assign once
    if (undefined === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();

      // quoted values
      if (val.charCodeAt(0) === 0x22) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, decode);
    }
    index = endIdx + 1;
  }
  return obj;
}

export function serialize(name: string, val: string, options?: CookieOptions) {
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }

  let value = encode(val);

  if (value && !fieldContentRegExp.test(value)) {
    throw new TypeError("argument val is invalid");
  }

  let str = name + "=" + value;

  if (null != options?.maxAge) {
    let maxAge = options.maxAge - 0;

    if (isNaN(maxAge) || !isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }

    str += "; Max-Age=" + Math.floor(maxAge);
  }

  if (options?.domain) {
    if (!fieldContentRegExp.test(options.domain)) {
      throw new TypeError("option domain is invalid");
    }

    str += "; Domain=" + options.domain;
  }

  if (options?.path) {
    if (!fieldContentRegExp.test(options.path)) {
      throw new TypeError("option path is invalid");
    }

    str += "; Path=" + options.path;
  }

  if (options?.expires) {
    let expires = options.expires;

    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }

    str += "; Expires=" + expires.toUTCString();
  }

  if (options?.httpOnly) {
    str += "; HttpOnly";
  }

  if (options?.secure) {
    str += "; Secure";
  }

  if (options?.priority) {
    let priority =
      typeof options.priority === "string"
        ? options.priority.toLowerCase()
        : options.priority;

    switch (priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }

  if (options?.sameSite) {
    let sameSite =
      typeof options.sameSite === "string"
        ? options.sameSite.toLowerCase()
        : options.sameSite;

    switch (sameSite) {
      case "true":
        str += "; SameSite=Strict";
        break;
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }

  return str;
}

const decode = (str: string) =>
  str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
const encode = (val: string) => encodeURIComponent(val);
const isDate = (val: Date | any) =>
  Object.prototype.toString.call(val) === "[object Date]" ||
  val instanceof Date;

function tryDecode(str: string, decode: (str: string) => void) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}
