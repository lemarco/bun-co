import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

export const JwtManager = (secret: string) => {
  return {
    sign: <Token>(data: Token, opts?: SignOptions) =>
      jwt.sign(data as any, secret, opts),
    verify: <Token>(token: string, opts?: VerifyOptions & { complete: true }) =>
      jwt.verify(token, secret, opts) as unknown as Token,
  };
};
