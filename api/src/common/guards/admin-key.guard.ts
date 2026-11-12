import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import { ENV, type Env } from '../../config/env.js';

/**
 * Phase 0 admin gate: requires `x-admin-key` to match ADMIN_API_KEY (timing-safe).
 * Replaced by real admin auth (JWT + roles) when the admin dashboard lands in Phase 4.
 */
@Injectable()
export class AdminKeyGuard implements CanActivate {
  private readonly expected: Buffer;

  constructor(@Inject(ENV) env: Env) {
    this.expected = createHash('sha256').update(env.adminApiKey).digest();
  }

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const provided = req.headers['x-admin-key'];
    if (typeof provided !== 'string' || !provided) throw new UnauthorizedException();
    const got = createHash('sha256').update(provided).digest();
    if (!timingSafeEqual(got, this.expected)) throw new UnauthorizedException();
    return true;
  }
}
