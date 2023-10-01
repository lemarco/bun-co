import dotenv from "dotenv";
export function envReader(
  varsToValidate: string[],
  path?: string
): Record<string, string> {
  const { parsed } = dotenv.configDotenv({ path: path || "./env" });

  if (!parsed) {
    throw "THERE IS NO ENV FILE";
  }
  console.log("vars 2", parsed);
  const vars: Record<string, string> = varsToValidate.reduce((acc, curr) => {
    const envVar = parsed?.[curr];
    if (envVar) {
      vars[curr] = envVar;
    } else {
      throw new Error(`${envVar} must be in Env`);
    }
  }, {});
  // for (const curr of varsToValidate) {
  //   const envVar = parsed?.[curr];

  //   if (envVar) {
  //     vars[curr] = envVar;
  //   } else {
  //     new Error(`${envVar} must be in Env`);
  //   }
  // }
  // console.log("vars", vars);
  return vars;
}
