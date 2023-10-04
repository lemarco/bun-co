import { z } from "zod";
declare global {
  type HandlerParams<T, Ctx> = {
    req: Request;
    body: T;
    query?: Record<string, any>;
    params?: Record<string, string>;
    headers: HeadersManager;
    cookies: CookieManager;
    ctx: Ctx;
  } & State;

  // export type HandlerParams<T, Ctx> = {
  //   ctx?: Ctx;
  //   body?: T;
  //   req?: Request;
  //   cookies?: CookieManager;
  //   headers?: HeadersManager;
  //   params?: Record<string, string>;
  //   query?: Record<string, string>;

  //   env?: Record<string, string>;
  //   redis?: Redis;
  //   postgre?: PostgresJsDatabase<Record<string, never>>;
  //   jwt?: JwtManager;
  //   logger?: LoggerService;
  // };
  export type Route<T, Ctx = undefined> = {
    method: Method;
    path: string;
    before?: Handler<T, Ctx>[];
    handler: Handler<T, Ctx>;
    after?: Handler<T, Ctx>[];
    bodySchema?: z.ZodObject;
    querySchema?: z.ZodObject;
  };
  export type RouteGroup<Ctx> = {
    config?: RouteGroupConfig;
    ctx?: Ctx;
    path?: string;
    routes: Array<Route<any, Ctx> | RouteGroup<Ctx>>;
    before?: Handler<any, Ctx>[];
    after?: Handler<any, Ctx>[];
  };
  export type RootGroup<Ctx> = {
    host?: string;
    port?: number;
    config?: RouteGroupConfig;
    ctx?: Ctx;
    path?: string;
    routes: Array<Route<any, Ctx> | RouteGroup<Ctx>>;
    before?: Handler<any, Ctx>[];
    after?: Handler<any, Ctx>[];
  };
  export type Handler<T, Ctx> = (
    params: HandlerParams<T, Ctx>
  ) =>
    | Response
    | Promise<Response>
    | undefined
    | string
    | Record<string, unknown>
    | Promise<any>;
  type Method = "GET" | "POST" | "OPTION" | "PUT" | "DELETE";
  type EnvStore = { get: (name: string) => string };
  type EnvConfig = {
    readonly path?: string;

    readonly fields?: string[];
  };
  type RedisConfig = {
    readonly fromEnv?: boolean;
    readonly url?: string;
  };
  type Credentials = {
    host: string;
    port?: number;
    user: string;
    password: string;
    database: string;
  };
  type PostgreConfig = {
    readonly credentials?: Credentials;
    readonly fromEnv?: boolean;
  };
  type JwtConfig = {
    readonly secret?: string;
    readonly fromEnv?: boolean;
  };
  type RouteGroupConfig = {
    readonly cookies?: boolean;
    readonly env?: EnvConfig;
    readonly redis?: RedisConfig;
    readonly postgre?: PostgreConfig;
    readonly jwt?: JwtConfig;
    readonly logger?: boolean;
  };

  type HandlerSearchResult<T, Ctx> = {
    isMatched: boolean;
    params: Record<string, string>;
    after?: Handler<T, Ctx>[];
    before?: Handler<T, Ctx>[];
    handler?: Handler<T, Ctx>;
    bodySchema?: z.ZodObject;
    querySchema?: z.ZodObject;
  };
  interface ParsedURI {
    protocol: string;
    host: string;
    pathname: string;
    searchParams: Record<string, string>;
  }
  type JwtService = {
    sign: <Token>(data: Token, opts: any) => string;
    verify: <Token>(token: string) => Token;
  };
}
