import { partialRight, compose, partial, prop, propOr } from "ramda";

export type Error = { code: number };

export type ErrorData = { message: string; code: number };
const ErrorCodes: Record<string, ErrorData> = {
  "100": { message: "BAD REQUEST", code: 400 },
  "101": { message: "NOT FOUND", code: 404 },
  "102": { message: "NOT AUTHORIZED", code: 401 },
  "103": { message: "INTERNAL ERROR", code: 500 },
};

export const getErrorCodes = () => ErrorCodes;
export const getBadRequestError = compose(prop("100"), getErrorCodes);
export const getInternalError = compose(prop("103"), getErrorCodes);
export const getNotFoundError = compose(prop("101"), getErrorCodes);
export const getAuthorizedError = compose(prop("102"), getErrorCodes);

export const propOrDefault = partialRight(
  partial(propOr, [getBadRequestError()]),
  [getErrorCodes()]
);

export const getErrorWithDefaultError = ({ code }: Error) =>
  propOrDefault(String(code)) as ErrorData;
