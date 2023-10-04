import Redis from "ioredis";
import { Err, Ok, Result } from "../utils/result";
const errorStr =
  "You must provide either env config and env file with REDIS_URL field or secret for correct redis service configuration";
export const RedisManager = (
  { url, fromEnv }: RedisConfig,
  env?: EnvStore
): Result<Redis, string> => {
  const secret = (fromEnv && env?.get("REDIS_URL")) || url;

  return !secret ? Err(errorStr) : Ok(new Redis(url || env!.get("REDIS_URL")));
};
