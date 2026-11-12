import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { AdminKeyGuard } from './admin-key.guard.js';
import type { Env } from '../../config/env.js';

const ctxWith = (headers: Record<string, string | undefined>) =>
  ({ switchToHttp: () => ({ getRequest: () => ({ headers }) }) }) as unknown as ExecutionContext;

describe('AdminKeyGuard', () => {
  const guard = new AdminKeyGuard({ adminApiKey: 'correct-horse-battery-staple' } as Env);

  it('rejects a missing key', () => {
    expect(() => guard.canActivate(ctxWith({}))).toThrow(UnauthorizedException);
  });

  it('rejects a wrong key', () => {
    expect(() => guard.canActivate(ctxWith({ 'x-admin-key': 'nope' }))).toThrow(UnauthorizedException);
  });

  it('accepts the right key', () => {
    expect(guard.canActivate(ctxWith({ 'x-admin-key': 'correct-horse-battery-staple' }))).toBe(true);
  });
});
