export type AppRole = 'FundManager' | 'Investor';

/**
 * Reads the app roles assigned to the signed-in user from the `roles` claim on the ID token.
 * This is UI convenience only (nav visibility, route gating) — it is never the security boundary.
 * The backend enforces access via @PreAuthorize regardless of what the frontend shows or hides.
 */
export function getUserRoles(idTokenClaims: Record<string, unknown> | undefined): AppRole[] {
  const roles = idTokenClaims?.['roles'];
  return Array.isArray(roles) ? (roles as AppRole[]) : [];
}
