import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index';
import { User, JwtPayload } from '../types/common';

export class AuthUtils {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }  static generateAccessToken(user: User, rememberMe?: boolean): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    const secret = config.jwt.secret;
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }
    
    // Si rememberMe es true, el token dura más tiempo
    const expiresIn = rememberMe ? '30d' : '7d';
    
    return jwt.sign(payload, secret, {
      expiresIn: expiresIn,
    });
  }static generateRefreshToken(user: User): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    
    const secret = config.jwt.secret;
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }
      return jwt.sign(payload, secret, {
      expiresIn: '30d', // Valor hardcoded válido como fallback
    });
  }
  static verifyToken(token: string): JwtPayload {
    const secret = config.jwt.secret;
    if (!secret) {
      throw new Error('JWT secret is not configured');
    }
    return jwt.verify(token, secret) as JwtPayload;
  }

  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    
    return parts[1];
  }
}

export default AuthUtils;
