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
  const secret = (fromEnv ? env?.get("JWT_SECRET") : userSecret) as string;

  if (!secret) {
    return Err(
      "You must provide either env config and env file with JWT_SECRET field or secret for correct jwt service configuration"
    );
  }

  return Ok({
    sign: <Token>(data: Token, opts?: SignOptions) =>
      jwt.sign(data as any, secret, opts),
    verify: <Token>(token: string, opts?: VerifyOptions & { complete: true }) =>
      jwt.verify(token, secret, opts) as unknown as Token,
  });
};
