import Redis from "ioredis";
import { db as DB, PostgresJsDatabase } from "../db";
import { envReader } from "../env";
import { RedisManager } from "../redis";
import { JwtManager } from "../jwt";
import { loggerManager } from "../logger";
import { Logger } from "pino";
import PinoPretty from "pino-pretty";

const defaultErrorMapper = (e: string) => {
  console.error(e);
  process.exit();
};
export type State = {
  env?: {
    get: (name: string) => string;
  };
  jwt?: JwtService;
  redis?: Redis;
  db?: PostgresJsDatabase<Record<string, never>>;
  logger?: Logger<PinoPretty.PrettyStream>;
};
export const configurator = ({
  env,
  jwt,
  redis,
  postgre,
  logger,
}: RouteGroupConfig): State => {
  const envStore = env && envReader(env).mapErr(defaultErrorMapper).unwrap();
  return {
    env: envStore,
    jwt: jwt && JwtManager(jwt, envStore).mapErr(defaultErrorMapper).unwrap(),
    redis:
      redis &&
      RedisManager(redis, envStore).mapErr(defaultErrorMapper).unwrap(),
    db: postgre && DB(postgre, envStore).mapErr(defaultErrorMapper).unwrap(),
    logger: (logger && loggerManager()) || undefined,
  };
};
