import { createHmac, timingSafeEqual } from "crypto";
export function sign(val: string, secret: string) {
  if ("string" != typeof val)
    throw new TypeError("Cookie value must be provided as a string.");
  if (null == secret) throw new TypeError("Secret key must be provided.");
  return (
    val +
    "." +
    createHmac("sha256", secret)
      .update(val)
      .digest("base64")
      .replace(/\=+$/, "")
  );
}

export function unsign(input: string, secret: string) {
  if ("string" != typeof input)
    throw new TypeError("Signed cookie string must be provided.");
  if (null == secret) throw new TypeError("Secret key must be provided.");
  var tentativeValue = input.slice(0, input.lastIndexOf(".")),
    expectedInput = sign(tentativeValue, secret),
    expectedBuffer = Buffer.from(expectedInput),
    inputBuffer = Buffer.from(input);
  return expectedBuffer.length === inputBuffer.length &&
    timingSafeEqual(expectedBuffer, inputBuffer)
    ? tentativeValue
    : false;
}
