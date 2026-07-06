import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, UrlTree } from '@angular/router';
import { RolesService } from './roles.service';
import { roleGuard } from './role.guard';

function routeWithRole(requiredRole?: string): ActivatedRouteSnapshot {
  return { data: { requiredRole } } as unknown as ActivatedRouteSnapshot;
}

describe('roleGuard', () => {
  function setup(roles: string[]) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: RolesService, useValue: { resolveRoles: async () => roles } },
      ],
    });
  }

  it('allows navigation when the route has no requiredRole', async () => {
    setup([]);
    const result = await TestBed.runInInjectionContext(() =>
      roleGuard(routeWithRole(undefined), {} as never),
    );
    expect(result).toBe(true);
  });

  it('allows navigation when the user has the required role', async () => {
    setup(['FundManager']);
    const result = await TestBed.runInInjectionContext(() =>
      roleGuard(routeWithRole('FundManager'), {} as never),
    );
    expect(result).toBe(true);
  });

  it('redirects when the user lacks the required role', async () => {
    setup(['Investor']);
    const result = await TestBed.runInInjectionContext(() =>
      roleGuard(routeWithRole('FundManager'), {} as never),
    );
    expect(result).toBeInstanceOf(UrlTree);
  });
});
