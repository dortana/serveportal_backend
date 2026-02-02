import jwt, { JwtPayload } from "jsonwebtoken";

export const tokenMaxAge = 3 * 24 * 60 * 60; // 3 days in seconds

export const createToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: tokenMaxAge,
  });
};

export const decodeToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};
