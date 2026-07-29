import crypto from "node:crypto";

// A signed-in device should feel permanently signed in during normal use.
// Sessions last for one year and are renewed when the app is opened with fewer
// than 90 days remaining. The long inactivity limit is a safeguard for lost
// devices and abandoned browser profiles, not a recurring login requirement.
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 365;
export const SESSION_REFRESH_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 90;

export function createSessionToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function buildSession(token = createSessionToken(), now = Date.now()) {
  return {
    token,
    issued_at: new Date(now).toISOString(),
    expires_at: new Date(now + SESSION_TTL_MS).toISOString(),
  };
}

// Database user rows still contain the legacy account-level token. Always
// replace it with the token for the session that made the request so one device
// can never receive, rotate, or revoke another device's credentials.
export function attachSessionToUser(user, session) {
  if (!user || !session?.token) return null;
  return {
    ...user,
    token: session.token,
    token_issued_at: session.issued_at,
    token_expires_at: session.expires_at,
  };
}

// Never expose stored authentication or verification credentials inside a user
// payload. New/rotated session tokens are returned explicitly at the top level.
export function createSafeUser(user) {
  if (!user) return null;
  const {
    password_hash: _passwordHash,
    password_salt: _passwordSalt,
    token: _token,
    token_issued_at: _tokenIssuedAt,
    token_expires_at: _tokenExpiresAt,
    email_verification_token: _emailVerificationToken,
    ...safeUser
  } = user;
  return safeUser;
}

export function isSessionExpired(user, now = Date.now()) {
  if (!user?.token) return true;
  if (!user.token_expires_at) return true; // legacy sessions w/o expiry are treated as expired
  const expiresAtMs = new Date(user.token_expires_at).getTime();
  if (!Number.isFinite(expiresAtMs)) return true;
  return expiresAtMs <= now;
}

export function shouldRotateSession(user, now = Date.now()) {
  if (!user?.token_expires_at) return true;
  const expiresAtMs = new Date(user.token_expires_at).getTime();
  if (!Number.isFinite(expiresAtMs)) return true;
  return expiresAtMs - now <= SESSION_REFRESH_THRESHOLD_MS;
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password, salt, hash) {
  const nextHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(nextHash, "hex"), Buffer.from(hash, "hex"));
}
