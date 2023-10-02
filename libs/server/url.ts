import { applySpec, compose, prop } from "ramda";

type KV<T> = Record<string, T>;

const getSearchParamsFromParsedUrl = (url: URL) =>
  Array.from(url.searchParams.entries()).reduce<KV<string>>(
    (acc, [key, value]) => ({ ...acc, [key]: value }),
    {}
  );

type GetStr = (val: any) => string;
const getProtocol: GetStr = prop("protocol");
const getHost: GetStr = prop("host");
const getPathname: GetStr = prop("pathname");
export const parseUrl = (input: string) => new URL(input);

const getURL = (url: string): URL => new URL(url);
type UrlInfo = {
  protocol: string;
  host: string;
  pathname: string;
  searchParams: Record<string, string>;
};

type GetUrlInfo = (url: URL) => UrlInfo;
type GetUrlInfoFromString = (url: string) => UrlInfo;

export const getUrlInfo: GetUrlInfo = applySpec({
  protocol: getProtocol,
  host: getHost,
  pathname: getPathname,
  searchParams: getSearchParamsFromParsedUrl,
});
export const getUrlInfoFromRawUrl: GetUrlInfoFromString = compose(
  getUrlInfo,
  getURL
);
