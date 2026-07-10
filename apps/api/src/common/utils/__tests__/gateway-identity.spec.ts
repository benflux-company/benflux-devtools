import { signGatewayIdentity, verifyGatewaySignature, isTimestampFresh } from '../gateway-identity';

describe('signGatewayIdentity / verifyGatewaySignature', () => {
  const secret = 'test-secret';
  const identity = {
    userId: 'u1',
    orgId: 'o1',
    roles: 'admin,developer',
    permissions: 'read,write',
    fullName: 'Jean%20Dupont',
    phone: '%2B243890000001',
    timestamp: '1700000000000',
  };

  it('verifies a signature produced by signGatewayIdentity with the same secret', () => {
    const signature = signGatewayIdentity(secret, identity);
    expect(verifyGatewaySignature(secret, identity, signature)).toBe(true);
  });

  it('rejects a signature produced with a different secret', () => {
    const signature = signGatewayIdentity('other-secret', identity);
    expect(verifyGatewaySignature(secret, identity, signature)).toBe(false);
  });

  it('rejects a signature if any identity field is tampered with', () => {
    const signature = signGatewayIdentity(secret, identity);
    expect(verifyGatewaySignature(secret, { ...identity, userId: 'attacker' }, signature)).toBe(false);
    expect(verifyGatewaySignature(secret, { ...identity, roles: 'admin' }, signature)).toBe(false);
    expect(verifyGatewaySignature(secret, { ...identity, permissions: 'admin' }, signature)).toBe(false);
  });

  it('rejects a garbage/empty signature without throwing', () => {
    expect(verifyGatewaySignature(secret, identity, '')).toBe(false);
    expect(verifyGatewaySignature(secret, identity, 'not-hex')).toBe(false);
  });
});

describe('isTimestampFresh', () => {
  it('accepts a timestamp from right now', () => {
    expect(isTimestampFresh(String(Date.now()))).toBe(true);
  });

  it('rejects a timestamp older than the max age', () => {
    expect(isTimestampFresh(String(Date.now() - 120_000), 60_000)).toBe(false);
  });

  it('rejects a timestamp in the future (clock skew / replay of a pre-signed header)', () => {
    expect(isTimestampFresh(String(Date.now() + 120_000), 60_000)).toBe(false);
  });

  it('rejects a non-numeric timestamp', () => {
    expect(isTimestampFresh('not-a-number')).toBe(false);
  });
});
