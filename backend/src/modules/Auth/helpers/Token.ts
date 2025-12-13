import { jwtVerify, SignJWT } from 'jose';
import crypto from 'crypto';
import 'dotenv/config';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

class Token {
  public static async signAccessToken(id: string) {
    return new SignJWT()
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(id)
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);
  }

  public static async verifyAccessToken(token: string) {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  }

  public static generateToken() {
    return crypto.randomBytes(48).toString('hex');
  }

  public static hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}

export default Token;
