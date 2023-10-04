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

export const db = (
  config: PostgreConfig,
  env?: EnvStore
): Result<PostgresJsDatabase, string> => {
  const creds = {
    host: (env && env?.get("POSTGRES_HOST")) || config.credentials?.host,
    port: (env && env?.get("POSTGRES_PORT")) || 5432,
    user: (env && env?.get("POSTGRES_USER")) || config.credentials?.user,
    database: (env && env?.get("POSTGRES_DB")) || config.credentials?.database,
    password: (env && env?.get("POSTGRES_PWD")) || config.credentials?.password,
  };

  return Object.values(creds).every((val) => !Boolean(val))
    ? Err(errorMessage)
    : Ok(drizzle(postgres(creds as any)));
};
