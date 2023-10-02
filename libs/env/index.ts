import dotenv from "dotenv";
import { Err, Ok, Result } from "../utils/result";

type EnvValue = string;
type EnvError = string;
type EnvResult = Result<EnvValue, EnvError>;
type EnvResults = Array<EnvResult>;
type EnvReaderResults = Result<{ get: (name: string) => string }, EnvError>;

const checkVar = (name: string, record: dotenv.DotenvParseOutput): EnvResult =>
  record[name] ? Ok(record[name]) : Err(`No variable ${name} in env file.`);

const checkAllVars = (
  varNames: string[],
  record: dotenv.DotenvParseOutput
): EnvResults => varNames.map((name) => checkVar(name, record));

const filterErrors = (results: EnvResults): EnvResults =>
  results.filter((res) => res.isErr());

export function envReader({ path, fields }: EnvConfig): EnvReaderResults {
  const { parsed } = dotenv.configDotenv({ path: path || "./env" });
  if (!parsed) {
    return Err(`No env file on path ${path || "./env"}`);
  }
  const errors = filterErrors(checkAllVars(fields, parsed));
  return errors.length
    ? Err(
        errors.reduce(
          (acc, curr, idx, arr) =>
            (acc += curr.unwrap() + (arr.length - 1 == idx ? "" : "\n")),
          ""
        )
      )
    : Ok({ get: (name: string) => parsed[name] });
}
