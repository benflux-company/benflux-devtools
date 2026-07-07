import { createHmac, timingSafeEqual } from 'crypto';

export interface GatewayIdentity {
  userId: string;
  orgId: string;
  roles: string;
  timestamp: string;
}

// Mirrors benflux-auth's shared/utils/gateway-signature.ts exactly: the
// gateway (nginx auth_request -> benflux-auth /verify) signs these four
// headers with the same secret, and every downstream service recomputes
// this signature to trust the identity without re-checking the session.
export function signGatewayIdentity(secret: string, identity: GatewayIdentity): string {
  const payload = `${identity.userId}.${identity.orgId}.${identity.roles}.${identity.timestamp}`;
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyGatewaySignature(
  secret: string,
  identity: GatewayIdentity,
  signature: string,
): boolean {
  const expected = signGatewayIdentity(secret, identity);
  const expectedBuf = Buffer.from(expected);
  const actualBuf = Buffer.from(signature);
  return expectedBuf.length === actualBuf.length && timingSafeEqual(expectedBuf, actualBuf);
}

// Defense in depth against replayed headers if a request ever reached this
// service without going through the gateway's auth_request check (the
// NetworkPolicy already restricts ingress to the ingress-nginx namespace,
// this is a second layer in case that policy is ever loosened).
export function isTimestampFresh(timestamp: string, maxAgeMs = 60_000): boolean {
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  const age = Date.now() - ts;
  return age >= 0 && age <= maxAgeMs;
}
