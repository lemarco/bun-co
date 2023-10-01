import postgres from "postgres";

import {
  drizzle,
  PostgresJsDatabase as DBType,
  PostgresJsQueryResultHKT,
} from "drizzle-orm/postgres-js";
import { PgDatabase } from "drizzle-orm/pg-core";

export type PostgresJsDatabase<
  TSchema extends Record<string, unknown> = Record<string, never>,
> = PgDatabase<PostgresJsQueryResultHKT, TSchema>;
export type Credentials = {
  host: string;
  user: string;
  password: string;
  db: string;
};
let client = null;
export const db = (
  credentials?: Credentials,
  envMap?: Record<string, string>
) => {
  if (!credentials && envMap) {
    client = postgres({
      host: envMap["HOST"],
      port: 5432,
      user: envMap["POSTGRES_USER"],
      password: envMap["POSTGRES_PWD"],
      ssl: false,
      database: envMap["POSTGRES_DB"],
    });
  } else if (credentials) {
    const { host, user, password, db } = credentials;
    client = postgres({
      host,
      port: 5432,
      user,
      password,
      ssl: false,
      database: db,
    });
  }

  return drizzle(client!);
};
