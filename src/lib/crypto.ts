import { JWTPayload, SignJWT, jwtVerify } from "jose";

export async function signJwt<T extends JWTPayload>(
    payload: T,
    exp: number,
  ): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
  
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(iat + exp)
      .setIssuedAt(iat)
      .setNotBefore(iat)
      .sign(new TextEncoder().encode(process.env.CRYPTO_SECRET_KEY));
  }
  
  export async function verifyJwt<T extends JWTPayload>(
    token: string,
  ): Promise<T | null> {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.CRYPTO_SECRET_KEY),
      );
      return payload as T;
    } catch (err) {
      return null;
    }
  }