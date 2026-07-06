import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppRole } from './app-role';
import { RolesService } from './roles.service';

/**
 * Cosmetic route gate only. The real security boundary is the backend's
 * @PreAuthorize check on each endpoint — this guard just avoids showing a
 * screen the user has no access to.
 */
export const roleGuard: CanActivateFn = async (route) => {
  const requiredRole = route.data['requiredRole'] as AppRole | undefined;
  if (!requiredRole) {
    return true;
  }

  const rolesService = inject(RolesService);
  const router = inject(Router);
  const roles = await rolesService.resolveRoles();

  return roles.includes(requiredRole) || router.createUrlTree(['/']);
};
