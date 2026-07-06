import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, UrlTree } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { roleGuard } from './role.guard';

function routeWithRole(requiredRole?: string): ActivatedRouteSnapshot {
  return { data: { requiredRole } } as unknown as ActivatedRouteSnapshot;
}

describe('roleGuard', () => {
  function setup(roles: string[] | undefined) {
    const msalService = {
      instance: {
        getActiveAccount: () => (roles ? { idTokenClaims: { roles } } : null),
      },
    };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: MsalService, useValue: msalService }],
    });
    return TestBed;
  }

  it('allows navigation when the route has no requiredRole', () => {
    setup(undefined);
    const result = TestBed.runInInjectionContext(() =>
      roleGuard(routeWithRole(undefined), {} as never),
    );
    expect(result).toBe(true);
  });

  it('allows navigation when the user has the required role', () => {
    setup(['FundManager']);
    const result = TestBed.runInInjectionContext(() =>
      roleGuard(routeWithRole('FundManager'), {} as never),
    );
    expect(result).toBe(true);
  });

  it('redirects when the user lacks the required role', () => {
    setup(['Investor']);
    const result = TestBed.runInInjectionContext(() =>
      roleGuard(routeWithRole('FundManager'), {} as never),
    );
    expect(result).toBeInstanceOf(UrlTree);
  });
});
