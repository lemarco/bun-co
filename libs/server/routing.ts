// import { all, allPass, always, applySpec, compose, cond, equals, is, map, not, startsWith } from "ramda"
// import {
//   partial,
//   prop,
//   all,
//   allPass,
//   always,
//   applySpec,
//   compose,
//   cond,
//   equals,
//   is,
//   map,
//   not,
//   startsWith,
//   or,
// } from "rambda";
// import { catchErrorFunc } from ".";
// import { anyPass, ifElse } from "ramda";
import { None, Option } from "../utils/option";
import { MatchedRoute } from "./request-handler";

type SearchRouteParams<Ctx> = {
  pathname: string;
  method: Method;
  routes: Array<Route<any, Ctx> | RouteGroup<Ctx>>;
  prefix?: string;
};
export const searchRoute = <T, Ctx>(
  params: SearchRouteParams<Ctx>
): Option<MatchedRoute<T, Ctx>> => {
  return None;
};

// function handleLeaf<T, Ctx>({
//   route,
//   method,
//   url,
// }: {
//   route: Route<T, Ctx>
//   method: Method
//   url: string
// }): HandlerSearchResult<T, Ctx> {
//   const { method: routeMethod, path, handler } = route
//   if (method !== routeMethod) {
//     return { isMatched: false, params: {} }
//   }
//   if (path === url) {
//     let after = undefined
//     if (route.after) {
//       if (Array.isArray(route.after)) {
//         after = [...route.after]
//       } else {
//         after = [route.after]
//       }
//     }
//     let before = undefined
//     if (route.before) {
//       if (Array.isArray(route.before)) {
//         before = [...route.before]
//       } else {
//         before = [route.before]
//       }
//     }
//     return {
//       handler,
//       params: {},
//       after,
//       before,
//       isMatched: true,
//       querySchema: route.querySchema,
//       bodySchema: route.bodySchema,
//     }
//   }
//   if (path.startsWith("/:")) {
//   }
//   return { isMatched: false, params: {} }
// }
// export type Route<T, Ctx = undefined> = {
//   method: Method
//   path: string
//   before?: Handler<T, Ctx>[]
//   handler: Handler<T, Ctx>
//   after?: Handler<T, Ctx>[]
//   bodySchema?: z.ZodObject
//   querySchema?: z.ZodObject
// }

// // const getMethod = ()=>prop('method')
// const getPath = () => prop("path");

// type HandleLeafParams<T, Ctx> = {
//   route: Route<T, Ctx>;
//   method: Method;
//   url: string;
// };
// const getRoute = prop("route");

// const getMethod = prop("method");
// const getRouteMethod = compose(getMethod, getRoute);
// const getUrl = prop("url");
// const getRoutePath = compose(getUrl, getRoute) as unknown as (
//   params: any
// ) => string;
// const params: HandleLeafParams<undefined, undefined> = {
//   route: { method: "GET", path: "324", handler: ({}) => undefined },
//   url: "4234",
//   method: "GET",
// };

// const isPathEqualUrl = <T, Ctx>(params: HandleLeafParams<T, Ctx>) =>
//   equals(getRoutePath(params), getUrl(params));
// console.log(getRouteMethod(params));
// const isEqualMethodAndRouteMethod = <T, Ctx>(
//   params: HandleLeafParams<T, Ctx>
// ) => equals(getRouteMethod(params), getMethod(params));
// const isNotEqualMethodAndRouteMethod = <T, Ctx>(
//   params: HandleLeafParams<T, Ctx>
// ) => not(isEqualMethodAndRouteMethod(params));
// console.log(isEqualMethodAndRouteMethod(params));
// const isRoutePathEqualUrl = <T, Ctx>(params: HandleLeafParams<T, Ctx>) =>
//   equals(getRoutePath(params), getUrl(params));
// const isDynamicPath = <T, Ctx>(params: HandleLeafParams<T, Ctx>) =>
//   getRoutePath(params)?.startsWith("/:");
// const notMatched = <T, Ctx>(): HandlerSearchResult<T, Ctx> =>
//   ({ isMatched: false, params: {} }) as HandlerSearchResult<T, Ctx>;

// const getAfter = prop("after");
// const getRouteAfter = compose(getAfter, getRoute);
// const collectAfterHandlers = map(getRouteAfter);
// const getBefore = prop("before");
// const getRouteBefore = compose(getBefore, getRoute);
// const collectBeforeHandlers = map(getRouteBefore);

// const getHandler = prop("handler");
// const getRouteHandler = compose(getHandler, getRoute);
// const getQuerySchema = prop("querySchema");
// const getRouteQuerySchema = compose(getQuerySchema, getRoute);
// const getBodySchema = prop("bodySchema");
// const getRouteBodySchema = compose(getBodySchema, getRoute);
// export const getSearchResult: <T, Ctx>(
//   params: HandleLeafParams<T, Ctx>
// ) => HandlerSearchResult<T, Ctx> = applySpec({
//   handler: getHandler,
//   params: {},
//   after: getRouteAfter,
//   before: getRouteBefore,
//   isMatched: true,
//   querySchema: getRouteQuerySchema,
//   bodySchema: getRouteBodySchema,
// });

// const handleLeaf = <T, Ctx>(
//   params: HandleLeafParams<T, Ctx>
// ): HandlerSearchResult<T, Ctx> =>
//   cond([
//     [isNotEqualMethodAndRouteMethod<T, Ctx>, notMatched],
//     [isRoutePathEqualUrl<T, Ctx>, getSearchResult],
//     [isDynamicPath<T, Ctx>, notMatched],
//     [always(true), notMatched],
//   ])(params);

// const getPrefix = prop("prefix") as (params: any) => string;
// const getRoutePrefix = compose(getPrefix, getRoute);
// const isNotEmpty = (val?: string) => Boolean(val && val.length > 0);
// const isEmpty = (val?: string) => Boolean(isEmpty);
// const isNotEmptyPrefix = compose(isNotEmpty, getRoutePrefix);
// const isEmptyPrefix = compose(isEmpty, getRoutePrefix);

// // const startsWithValue = (val:string, startSegment:string)=>val.startsWith(startSegment)
// const isWildCard = (val: string) => startsWith(val, "/:");
// const isPrefixSlash = compose((val: string) => val === "/", getRoutePrefix);
// // const IsStartsWithPrefix =(val:string)  =>startsWithValue, getPrefix)
// // const isWildcardPrefix =
// // const startsWithPrefix = partial(startsWith,[])
// const isUrlStartsWithPrefix = <T, Ctx>(params: HandleLeafParams<T, Ctx>) =>
//   startsWith(getRoutePrefix(params), getUrl(params));
// const isUrlStartsWithWildCard = <T, Ctx>(params: HandleLeafParams<T, Ctx>) =>
//   isWildCard(getUrl(params));
// const isPrefixStartsWithWildCard = <T, Ctx>(params: HandleLeafParams<T, Ctx>) =>
//   isWildCard(getPrefix(params));
// const conditionToMatchRoute = anyPass([
//   isUrlStartsWithPrefix,
//   isUrlStartsWithWildCard,
//   isEmptyPrefix,
//   isPrefixSlash,
// ]);

// const getUrlWithoutWildcardValue = <T, Ctx>(params: HandleLeafParams<T, Ctx>) =>
//   getUrl(params).slice(0, getUrl(params).indexOf("/"));
// const getUrlWithoutPrefix = <T, Ctx>(params: HandleLeafParams<T, Ctx>) =>
//   getUrl(params).slice(getRoutePrefix(params).length, getUrl(params).length);
// const getWildcardValue = <T, Ctx>(params: HandleLeafParams<T, Ctx>) =>
//   getUrl(params).slice(0, getUrl(params).indexOf("/"));
// // wildcardValue = url.slice(0, url.indexOf("/"))
// //  sliced = url.slice(wildcardValue.length, url.length)
// const getRoutes = prop("routes");
// const isArray = partial(is, [Array]);
// const isRoutesArray: (params: any) => boolean = compose(is, getRoutes)(params);
// const isKeyIn = (key: string, obj: Record<string, unknown>) => key in obj;
// // const isRoutesInObj = ()=> partial(isKeyIn,['routes'])

// type FilteredMatchRouteParams<Ctx> = {
//   url: string;
//   routes: Array<Route<any, Ctx>>;
//   method: Method;
//   ctx: Ctx;
// };

// const a = <T, Ctx>({ routes }: FilteredMatchRouteParams<Ctx>) => {
//   for (const route of routes) {
//     // const a = isArray(routes)
//     if (is(routes, Array)) {
//       const response = handleGroup({ route, ...params });

//       if (response.isMatched) {
//         return response;
//       }
//     } else {
//       const response = handleLeaf({ route, ...params });
//       if (response.isMatched) {
//         return response;
//       }
//     }
//   }
// };
// const matchRouteHandler = <T, Ctx>(params: MatchRouteParams<Ctx>) => {
//   return cond([
//     [isArray(prop("routes")), ({ routes }) => {}],
//     [always(true), notMatched],
//   ]);
//   // const routes = getRoutes(params)
//   // const isRoutesArray = isArray(prop('routes'))(params)
//   // if (isRoutesArray)
//   //   for (const route of routes) {
//   //     // const a = isArray(routes)
//   //     if (is(routes, Array)) {
//   //       const response = handleGroup({ route, ...params })

//   //       if (response.isMatched) {
//   //         return response
//   //       }
//   //     } else {
//   //       const response = handleLeaf({ route, ...params })
//   //       if (response.isMatched) {
//   //         return response
//   //       }
//   //     }

//   //   }
// };

// export const matchRoute = <T, Ctx>(
//   params: MatchRouteParams<Ctx>
// ): HandlerSearchResult<T, Ctx> =>
//   cond([
//     [isRoutesArray, matchRouteHandler<T, Ctx>],
//     [always(true), notMatched],
//   ])(params);

// // ifElse(isRoutesArray(params),(params)=>{
// //   return ifElse(isKeyIn("routes",params.routes), ()=>{

// //     for (const route of routes){

// //     }
// //     const response = handleGroup(params)
// //     if (response.isMatched){
// //       return response
// //     }
// //   },()=>{
// //    const response = handleLeaf({ route, ...params })
// //          if (response.isMatched) {
// //            return response
// //          }}

// // } , notMatched)(params)
// //   if (Array.isArray(params.routes)) {
// //     for (const route of params.routes) {
// //       if ("routes" in route) {
// //         //  console.log("IN GROUP BRANCH WITH ROUTE ", route.prefix);
// //         const response = handleGroup({ route, ...params })
// //         if (response.isMatched) {
// //           return response
// //         }
// //       } else {
// //         //   console.log("IN LEAF BRANCH WITH ROUTE ", route.path);
// //         const response = handleLeaf({ route, ...params })
// //         if (response.isMatched) {
// //           return response
// //         }
// //       }
// //     }
// //   }
// //   return {
// //     isMatched: false,
// //     params: {},
// //   }
// // }
// const conditionHandler = <T, Ctx>(params: HandleLeafParams<T, Ctx>) => {
//   // const {route:groupRoutes,method,url} = params
//   let sliced = ifElse(
//     isPrefixStartsWithWildCard,
//     getUrlWithoutWildcardValue,
//     getUrlWithoutPrefix
//   )(params);
//   // let wildcardValue
//   // let sliced
//   // if (wildcardPrefix) {
//   //   wildcardValue = url.slice(0, url.indexOf("/"))
//   //   sliced = url.slice(wildcardValue.length, url.length)
//   // } else {
//   //   sliced = url.slice(prefix?.length, url.length)
//   // }
//   // const {
//   //   isMatched,
//   //   params: routeParams,
//   //   after: routeAfter,
//   //   before: routeBefore,
//   //   handler: routeHandler,
//   // } = matchRoute({
//   //   routes: groupRoutes,

//   //   method,
//   //   url: sliced || "/",
//   // })

//   // if (!isMatched) {
//   //   if (prefix?.startsWith(":")) {
//   //     // console.log("NOT MATCHED AFTER WILDCARD");
//   //     throw { error: 101, message: "NOT FOUND" }
//   //   }
//   //   // console.log("STRANGE NOT MATCHED AFTER ");
//   //   throw { error: 101, message: "NOT FOUND" }
//   // }

//   // const currentAfter = route.after
//   // const currentBefore = route.before
//   // let after: Handler<T, Ctx>[]
//   // if (routeAfter) {
//   //   if (currentAfter) {
//   //     after = [...routeAfter, ...currentAfter]
//   //   } else {
//   //     after = [...routeAfter]
//   //   }
//   // } else {
//   //   if (currentAfter) {
//   //     after = [...currentAfter]
//   //   } else {
//   //     after = []
//   //   }
//   // }
//   // let before: Handler<T, Ctx>[]
//   // if (routeBefore) {
//   //   if (currentBefore) {
//   //     before = [...currentBefore, ...routeBefore]
//   //   } else {
//   //     before = [...routeBefore]
//   //   }
//   // } else {
//   //   if (currentBefore) {
//   //     before = [...currentBefore]
//   //   } else {
//   //     before = []
//   //   }
//   // }

//   // let params = {
//   //   ...routeParams,
//   // }
//   // if (prefix && wildcardPrefix && wildcardValue) {
//   //   if (prefix.startsWith("/")) {
//   //     params[prefix.replace("/", "")] = wildcardValue
//   //   } else {
//   //     params[prefix] = wildcardValue
//   //   }
//   // }
//   // return {
//   //   isMatched: true,
//   //   params: routeParams
//   //     ? {
//   //         ...routeParams,
//   //       }
//   //     : {},
//   //   after,
//   //   before,
//   //   handler: routeHandler,
//   // } as any
// };
// const handleGroup = <T, Ctx>(
//   params: HandleLeafParams<T, Ctx>
// ): HandlerSearchResult<T, Ctx> =>
//   cond([
//     [conditionToMatchRoute, conditionHandler],
//     [always(true), notMatched],
//   ])(params);

// // export function handleGroup<T, Ctx>({
// //   route,
// //   url,
// //   ctx,
// //   method,
// // }: {
// //   isRoot?: boolean
// //   route: RouteGroup<Ctx>
// //   url: string
// //   ctx: Ctx
// //   method: Method
// // }): HandlerSearchResult<T, Ctx> {
// //   const { prefix, routes: groupRoutes } = route
// //   let matchedPath
// //   const wildcardPrefix = prefix?.startsWith("/:")

// //   if ((prefix && url.startsWith(prefix)) || wildcardPrefix || !prefix || prefix === "/") {
// //     let wildcardValue
// //     let sliced
// //     if (wildcardPrefix) {
// //       wildcardValue = url.slice(0, url.indexOf("/"))
// //       sliced = url.slice(wildcardValue.length, url.length)
// //     } else {
// //       sliced = url.slice(prefix?.length, url.length)
// //     }
// //     const {
// //       isMatched,
// //       params: routeParams,
// //       after: routeAfter,
// //       before: routeBefore,
// //       handler: routeHandler,
// //     } = matchRoute({
// //       routes: groupRoutes,
// //       ctx,
// //       method,
// //       url: sliced || "/",
// //     })

// //     if (!isMatched) {
// //       if (prefix?.startsWith(":")) {
// //         // console.log("NOT MATCHED AFTER WILDCARD");
// //         throw { error: 101, message: "NOT FOUND" }
// //       }
// //       // console.log("STRANGE NOT MATCHED AFTER ");
// //       throw { error: 101, message: "NOT FOUND" }
// //     }

// //     const currentAfter = route.after
// //     const currentBefore = route.before
// //     let after: Handler<T, Ctx>[]
// //     if (routeAfter) {
// //       if (currentAfter) {
// //         after = [...routeAfter, ...currentAfter]
// //       } else {
// //         after = [...routeAfter]
// //       }
// //     } else {
// //       if (currentAfter) {
// //         after = [...currentAfter]
// //       } else {
// //         after = []
// //       }
// //     }
// //     let before: Handler<T, Ctx>[]
// //     if (routeBefore) {
// //       if (currentBefore) {
// //         before = [...currentBefore, ...routeBefore]
// //       } else {
// //         before = [...routeBefore]
// //       }
// //     } else {
// //       if (currentBefore) {
// //         before = [...currentBefore]
// //       } else {
// //         before = []
// //       }
// //     }

// //     let params = {
// //       ...routeParams,
// //     }
// //     if (prefix && wildcardPrefix && wildcardValue) {
// //       if (prefix.startsWith("/")) {
// //         params[prefix.replace("/", "")] = wildcardValue
// //       } else {
// //         params[prefix] = wildcardValue
// //       }
// //     }
// //     return {
// //       isMatched: true,
// //       params: routeParams
// //         ? {
// //             ...routeParams,
// //           }
// //         : {},
// //       after,
// //       before,
// //       handler: routeHandler,
// //     }
// //   }
// //   return {
// //     isMatched: false,
// //     params: {},
// //     after: undefined,
// //     before: undefined,
// //     handler: undefined,
// //   }
// // }

// type MatchRouteParams<Ctx> = {
//   url: string;
//   routes: Array<Route<any, Ctx> | RouteGroup<Ctx>> | RouteGroup<Ctx>;
//   method: Method;
//   ctx: Ctx;
// };
// type MatchRoute<T, Ctx> = <T, Ctx>(
//   params: MatchRouteParams<Ctx>
// ) => HandlerSearchResult<T, Ctx>;
// //   url: string
// //   routes: Array<Route<any, Ctx> | RouteGroup<Ctx>> | RouteGroup<Ctx>
// //   method: Method
// //   ctx: Ctx
// // })
// // const getRoutes = prop("routes")

// // const handleGroupBranch = ()

// // type KV<T> = Record<string, T>;

// // const getSearchParamsFromParsedUrl = (url: URL) =>
// //   Array.from(url.searchParams.entries()).reduce<KV<string>>(
// //     (acc, [key, value]) => ({ ...acc, [key]: value }),
// //     {}
// //   );

// // type GetStr = (val: any) => string;
// // const getProtocol: GetStr = prop("protocol");
// // const getHost: GetStr = prop("host");
// // const getPathname: GetStr = prop("pathname");
// // export const parseUrl = (input: string) => new URL(input);

// // const getURL = (url: string): URL => new URL(url);
// // type UrlInfo = {
// //   protocol: string;
// //   host: string;
// //   pathname: string;
// //   searchParams: Record<string, string>;
// // };

// // type GetUrlInfo = (url: URL) => UrlInfo;
// // type GetUrlInfoFromString = (url: string) => UrlInfo;

// // export const getUrlInfo: GetUrlInfo = applySpec({
// //   protocol: getProtocol,
// //   host: getHost,
// //   pathname: getPathname,
// //   searchParams: getSearchParamsFromParsedUrl,
// // });
// // export const getUrlInfoFromRawUrl: GetUrlInfoFromString = compose(
// //   getUrlInfo,
// //   getURL
// // );

// // export const urlParse = (input: string): ParsedURI => {
// //   tryCatch(compose(getUrlInfo, parseUrl), catchErrorFunc)
// //   try {
// //     // const url = parseUrl(input)
// //     // // const searchParams = getSearchParamsFromParsedUrl(url)
// //     // const info = getUrlInfo(url)
// //     const parsed = compose(getUrlInfo, parseUrl)(input)
// //     console.log("parsed", parsed)
// //     return parsed as ParsedURI
// //   } catch (error) {
// //     throw { code: 100, message: "Invalid URI" }
// //   }
// // }
