import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { Err, Ok, Result } from "../utils/result";

type JwtService = {
  sign: <Token>(data: Token, opts?: SignOptions) => string;
  verify: <Token>(
    token: string,
    opts?: VerifyOptions & { complete: true }
  ) => Token;
};

export const JwtManager = (
  { secret: userSecret, fromEnv }: JwtConfig,
  env?: EnvStore
): Result<JwtService, string> => {
  if (
    (fromEnv && !env) ||
    (fromEnv && !env?.get("JWT_SECRET")) ||
    !userSecret
  ) {
    return Err(
      "You must provide either env config and env file with JWT_SECRET field or secret for correct jwt service configuration"
    );
  }
  const secret = (fromEnv ? env?.get("JWT_SECRET") : userSecret) as string;

  return Ok({
    sign: <Token>(data: Token, opts?: SignOptions) =>
      jwt.sign(data as any, secret, opts),
    verify: <Token>(token: string, opts?: VerifyOptions & { complete: true }) =>
      jwt.verify(token, secret, opts) as unknown as Token,
  });
};
