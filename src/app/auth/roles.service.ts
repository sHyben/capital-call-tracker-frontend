import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { InteractionStatus } from '@azure/msal-browser';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { API_SCOPE } from './msal-config';
import { AppRole, getUserRoles } from './app-role';
import { decodeJwtPayload } from './jwt';

/**
 * App roles (FundManager/Investor) are assigned on the CapitalCall-API enterprise application
 * (per Part 0), so Entra ID only puts the `roles` claim on tokens audienced to that API — the
 * access token acquired for `api://{api-client-id}/access_as_user`, not the SPA's ID token.
 * This service silently acquires that same access token (already cached from API calls made
 * via MsalInterceptor) purely to read roles for cosmetic UI decisions.
 */
@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly msalService = inject(MsalService);
  private readonly broadcastService = inject(MsalBroadcastService);

  readonly roles = signal<AppRole[]>([]);

  constructor() {
    this.broadcastService.inProgress$
      .pipe(filter((status) => status === InteractionStatus.None))
      .subscribe(() => this.resolveRoles());
  }

  async resolveRoles(): Promise<AppRole[]> {
    const account = this.msalService.instance.getActiveAccount();
    if (!account) {
      this.roles.set([]);
      return [];
    }
    try {
      const result = await firstValueFrom(
        this.msalService.acquireTokenSilent({ scopes: [API_SCOPE], account }),
      );
      const roles = getUserRoles(decodeJwtPayload(result.accessToken));
      this.roles.set(roles);
      return roles;
    } catch {
      this.roles.set([]);
      return [];
    }
  }
}
