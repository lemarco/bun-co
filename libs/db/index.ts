import postgres from "postgres";

import {
  drizzle,
  PostgresJsDatabase as DBType,
  PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";
import { PgDatabase } from "drizzle-orm/pg-core";
import { Err, Ok, Result } from "../utils/result";

export type PostgresJsDatabase<
  TSchema extends Record<string, unknown> = Record<string, never>,
> = PgDatabase<PostgresJsQueryResultHKT, TSchema>;
export type Credentials = {
  host: string;
  user: string;
  password: string;
  db: string;
};

const errorMessage =
  "You must provide either env config and env file with POSTGRES_DB,POSTGRES_PWD,POSTGRES_USER,POSTGRES_PORT fields or credentials for correct database service configuration";
const handleErrorCases = (
  { fromEnv, credentials }: PostgreConfig,
  env?: EnvStore
): Result<boolean, string> => {
  const falseCondition =
    !credentials ||
    (fromEnv &&
      (!env ||
        (env &&
          (!env?.get("POSTGRES_DB") ||
            !env?.get("POSTGRES_PWD") ||
            !env?.get("POSTGRES_USER") ||
            !env?.get("POSTGRES_HOST")))));

  return falseCondition ? Err(errorMessage) : Ok(true);
};
export const db = (
  config: PostgreConfig,
  env?: EnvStore
): Result<PostgresJsDatabase, string> => {
  const check = handleErrorCases(config, env);

  return check.isErr()
    ? Err(check.err().unwrap())
    : Ok(
        drizzle(
          postgres(
            (config.fromEnv
              ? {
                  host: env?.get("POSTGRES_HOST"),
                  port: env?.get("POSTGRES_PORT") || 5432,
                  user: env?.get("POSTGRES_USER"),
                  password: env?.get("POSTGRES_PWD"),
                  ssl: false,
                  database: env?.get("POSTGRES_DB"),
                }
              : config.credentials) as any
          )
        )
      );
};
