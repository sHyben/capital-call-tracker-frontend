export type AppRole = 'FundManager' | 'Investor';

/**
 * Reads the app roles out of a decoded token's claims (works for either an ID token or an
 * access token — see roles.service.ts for why we need the latter here).
 * This is UI convenience only (nav visibility, route gating) — it is never the security boundary.
 * The backend enforces access via @PreAuthorize regardless of what the frontend shows or hides.
 */
export function getUserRoles(claims: Record<string, unknown> | undefined): AppRole[] {
  const roles = claims?.['roles'];
  return Array.isArray(roles) ? (roles as AppRole[]) : [];
}
