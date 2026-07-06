import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AppRole, getUserRoles } from './app-role';

/**
 * Cosmetic route gate only. The real security boundary is the backend's
 * @PreAuthorize check on each endpoint — this guard just avoids showing a
 * screen the user has no access to.
 */
export const roleGuard: CanActivateFn = (route) => {
  const msal = inject(MsalService);
  const router = inject(Router);

  const requiredRole = route.data['requiredRole'] as AppRole | undefined;
  if (!requiredRole) {
    return true;
  }

  const account = msal.instance.getActiveAccount();
  const roles = getUserRoles(account?.idTokenClaims);

  return roles.includes(requiredRole) || router.createUrlTree(['/']);
};
