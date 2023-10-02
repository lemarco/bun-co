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
export type MatchedRoute<T, Ctx> = {
  after: Handler<T, Ctx>[];
  before: Handler<T, Ctx>[];
  handler: Handler<T, Ctx>[];
  bodySchema: Option<z.ZodObject<any>>;
  querySchema: Option<z.ZodObject<any>>;
  params: Option<Record<string, string>>;
};
export const requestHandler = async <T, Ctx>(req: Request, res: Response) => {
  const { method, url: reqUrl, headers: reqHeaders, body: reqBody } = req;
  const { state, router } = this as unknown as {
    state: State;
    router: RootGroup<Ctx>;
  };

  const { searchParams, pathname } = getUrlInfoFromRawUrl(reqUrl);
  const matched = searchRoute({
    pathname,
    method: method as Method,
    routes: router.routes,
    prefix: router.prefix,
  });

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
      res,
      body: body.unwrap(),
      query,
      params: params.isSome() ? params.unwrap() : undefined,
      headers: HeadersManagerCons(reqHeaders, res.headers),
      cookies:
        (router.config?.cookies &&
          CookieManagerCons(reqHeaders, res.headers)) ||
        undefined,
      ctx: router.ctx,
      ...state,
    } satisfies HandlerParams<T, Ctx>;
    const funcs = [
      ...(router.before || []),
      ...before,
      ...handler,
      ...after,
      ...(router.after || []),
    ];
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
