import { configurator } from "../configurator";
import { Serve, Server } from "bun";
import { requestHandler } from "./request-handler";

import { None, Option, Some } from "../utils/option";
import { z } from "zod";

function flattenRoutesAndCollectHandlers<T, Ctx>(
  rootGroup: RootGroup<Ctx>,
  parentBeforeHandlers: Handler<any, Ctx>[] = [],
  parentAfterHandlers: Handler<any, Ctx>[] = [],
  currentPath = ""
): Route<any, Ctx>[] {
  const flattenedRoutes: Route<any, Ctx>[] = [];

  for (const routeOrGroup of rootGroup.routes) {
    if ("method" in routeOrGroup) {
      const route = routeOrGroup as Route<any, Ctx>;
      const fullPath = `${currentPath}${route.path}`;
      route.path = fullPath;
      route.before = [...parentBeforeHandlers, ...(route.before || [])];
      route.after = [...(route.after || []), ...parentAfterHandlers];
      flattenedRoutes.push(route);
    } else {
      const group = routeOrGroup as RouteGroup<Ctx>;
      const groupPath = `${currentPath}${group.path || ""}`;
      const groupBeforeHandlers = [
        ...parentBeforeHandlers,
        ...(group.before || []),
      ];
      const groupAfterHandlers = [
        ...parentAfterHandlers,
        ...(group.after || []),
      ];
      flattenedRoutes.push(
        ...flattenRoutesAndCollectHandlers(
          group,
          groupBeforeHandlers,
          groupAfterHandlers,
          groupPath
        )
      );
    }
  }

  return flattenedRoutes;
}

export class RouteNode<T, Ctx> {
  children: Map<string, RouteNode<T, Ctx>> = new Map();
  dynamic?: [string, RouteNode<T, Ctx>] = undefined;
  after: Handler<T, Ctx>[] = [];
  before: Handler<T, Ctx>[] = [];
  handler?: Handler<T, Ctx>;
  bodySchema?: Option<z.ZodObject<any>>;
  querySchema?: Option<z.ZodObject<any>>;
  params: Record<string, string> = {};
  // isLeaf: boolean = false;
  // param: string | null = null;

  // route: Route<T, Ctx> | null = null;
}

type Methods =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "option"
  | "delete"
  | "connect"
  | "trace"
  | "head";

const isDynamic = (str: string) => str.startsWith(":");
export class Router<Ctx> {
  root: Record<Methods, RouteNode<any, Ctx>> = {
    get: new RouteNode<any, Ctx>(),
    post: new RouteNode<any, Ctx>(),
    put: new RouteNode<any, Ctx>(),
    patch: new RouteNode<any, Ctx>(),
    option: new RouteNode<any, Ctx>(),
    delete: new RouteNode<any, Ctx>(),
    connect: new RouteNode<any, Ctx>(),
    trace: new RouteNode<any, Ctx>(),
    head: new RouteNode<any, Ctx>(),
  };
  constructor(routes: Route<any, Ctx>[]) {
    for (const r of routes) {
      const { method, after, before, handler, path } = r;
      const segments = path.split("/").filter(Boolean);
      const filteredDynamic = segments.filter(isDynamic);
      if (filteredDynamic.length > 2) {
        const mapOfDynamicArgs: Record<string, number> = {};
        for (const d of filteredDynamic) {
          if (mapOfDynamicArgs[d]) {
            throw "WRONG ROUTE";
          } else {
            mapOfDynamicArgs[d] = 1;
          }
        }
      }
      let currentNode = this.root[method.toLowerCase() as Methods];
      for (const segment of segments) {
        if (isDynamic(segment)) {
          if (!currentNode.dynamic) {
            const node = new RouteNode();
            node.after = after || [];
            node.before = before || [];
            node.handler = handler;
            console.log("DYNAMIC SEGMENT", segment.replace(":", ""));
            currentNode.dynamic = [segment.replace(":", ""), node];
            currentNode = node;
          } else {
            currentNode = currentNode.dynamic[1];
          }
          continue;
        }
        if (currentNode.children.has(segment)) {
          currentNode = currentNode.children.get(segment)!;
        } else {
          const node = new RouteNode();
          node.after = after || [];
          node.before = before || [];
          node.handler = handler;
          currentNode.children.set(segment, node);
          currentNode = node;
        }
      }
    }
  }

  match(path: string, method: Method) {
    const segments = path.split("/").filter(Boolean);
    // console.log("segments = ", segments);
    const params: Record<string, string> = {};
    let currentNode = this.root[method.toLowerCase() as Methods];
    for (const segment of segments) {
      if (currentNode.children.has(segment)) {
        currentNode = currentNode.children.get(segment)!;
      } else {
        if (currentNode.dynamic) {
          const key = currentNode.dynamic?.[0]!;
          currentNode = currentNode.dynamic[1];
          params[key] = segment;
        } else {
          return None;
        }
      }
    }
    return Some({ ...currentNode, params });
  }
}

export const server = <Ctx>(root: RootGroup<Ctx>) => {
  const state = root.config ? configurator(root.config) : {};
  const port = root.port || 3000;
  const hostname = root.host || "localhost";

  const routes = flattenRoutesAndCollectHandlers(root, [], [], root.path || "");

  const router = new Router(routes);
  //routerLogger(router);

  const serverInstanceConfig: Serve = {
    port,

    fetch: (req) => {
      console.log("FETCH TRIGGERED");
      return requestHandler(req, {
        state,
        router,
        ctx: root.ctx,
        config: root.config,
      });
    },
  };
  // console.log("serverInstanceConfig = ", serverInstanceConfig);
  let server: Server;

  return {
    start: () => {
      server = Bun.serve(serverInstanceConfig);
      console.log("123");
      console.log(`Listening on http://${hostname}:${port} ...`);
    },
    stop: () => server.stop(),
    reload: () => {
      server.stop();
      server = Bun.serve(serverInstanceConfig);
      console.log(`Listening on http://${hostname}:${port} ...`);
    },
  };
};
