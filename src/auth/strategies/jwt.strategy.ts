// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // CRITICAL: This must match the secret in AuthModule
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: any) {
    // Optional: Check if user still exists in DB (Extra Security)
    // If you don't want to hit DB on every request, keep your original code.
    // Here is your original lightweight validation:
    return {
      id: payload.sub,
      phone: payload.phone,
      email: payload.email,
      role: payload.role,
    };
  }
}