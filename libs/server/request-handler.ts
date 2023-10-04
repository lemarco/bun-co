import { z } from "zod";
import { State } from "../configurator";
import { CookieManagerCons } from "../cookie";
import { HeadersManagerCons } from "../headers";
import { Option } from "../utils/option";
import { getUrlInfoFromRawUrl } from "./url";
import { createErrorResponse } from "../response";
import { getInternalError, getNotFoundError } from "../error";
import { validateEntity } from "../validation";
import { searchRoute } from "./routing";
import { Router } from ".";
export type MatchedRoute<T, Ctx> = {
  after: Handler<T, Ctx>[];
  before: Handler<T, Ctx>[];
  handler: Handler<T, Ctx>[];
  bodySchema: Option<z.ZodObject<any>>;
  querySchema: Option<z.ZodObject<any>>;
  params: Record<string, string>;
};

// const matchRoute =
// type Matcher = <T, Ctx>(opts: {
//   pathname: string;
//   method: Method;
// }) => Option<MatchedRoute<T, Ctx>>;
type RHState<Ctx> = {
  state: State;
  router: Router<Ctx>;
  ctx?: Ctx;
  config?: RouteGroupConfig;
};

export const requestHandler = async <T, Ctx>(
  req: Request,
  st: RHState<Ctx>
) => {
  //console.log("requestHandler requestHandler");
  const { method, url: reqUrl, headers: reqHeaders, body: reqBody } = req;
  const { state, router, ctx, config } = st;
  // console.log(state, match, ctx, config);
  const { searchParams, pathname } = getUrlInfoFromRawUrl(reqUrl);
  const matched = router.match(pathname, method as Method);
  //console.log(matched);
  if (matched.isSome()) {
    const { before, after, handler, bodySchema, querySchema, params } =
      matched.unwrap();
    const response = new Response();
    const body = validateEntity(
      reqBody as any,
      bodySchema as any,
      state.logger as any
    );
    if (body.isErr()) {
      return createErrorResponse(body.unwrapErr());
    }

    const query = validateEntity(
      searchParams as any,
      querySchema as any,
      state.logger as any
    );
    if (query.isErr()) {
      return createErrorResponse(query.unwrapErr());
    }

    const args = {
      req,
      res: response,
      body: body.unwrap(),
      query,
      params: params ? params : undefined,
      headers: HeadersManagerCons(reqHeaders, response.headers),
      cookies:
        (config?.cookies && CookieManagerCons(reqHeaders, response.headers)) ||
        undefined,
      ctx,
      ...state,
    } satisfies HandlerParams<T, Ctx>;
    const funcs = [...(before || []), handler!, ...(after || [])];
    try {
      for (const f of funcs) {
        await f(args);
        return response;
      }
    } catch (e) {
      state.logger?.info(e);
      createErrorResponse(getInternalError());
    }
  }
  return createErrorResponse(getNotFoundError());
};
