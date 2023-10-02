import { configurator } from "../configurator";
import { Serve, Server } from "bun";
import { requestHandler } from "./request-handler";
export const server = <Ctx>(root: RootGroup<Ctx>) => {
  const state = root.config ? configurator(root.config) : {};
  const port = root.port || 3000;
  const hostname = root.host || "localhost";
  const serverInstanceConfig: Serve = {
    port,
    hostname,
    fetch: requestHandler.bind({
      state,
      router: root,
    }) as any,
  };
  let server: Server;

  return {
    start: () => {
      server = Bun.serve(serverInstanceConfig);
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
