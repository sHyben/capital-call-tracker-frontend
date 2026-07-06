import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalModule,
  MsalService,
} from '@azure/msal-angular';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import {
  MSALGuardConfigFactory,
  MSALInstanceFactory,
  MSALInterceptorConfigFactory,
} from './auth/msal-config';
import { languageInterceptor } from './core/language.interceptor';
import { errorInterceptor } from './core/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([languageInterceptor, errorInterceptor]),
      withInterceptorsFromDi(),
    ),
    provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
    provideTranslateHttpLoader({ prefix: '/i18n/', suffix: '.json' }),
    importProvidersFrom(
      MsalModule.forRoot(MSALInstanceFactory(), MSALGuardConfigFactory(), MSALInterceptorConfigFactory()),
    ),
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    // Handles the return leg of the redirect login flow on app startup. MSAL's redirect flow
    // never calls setActiveAccount() for us (only the popup flow does) — without this, every
    // instance.getActiveAccount() call downstream (role lookups, sign-in/out UI) sees null even
    // though the user is fully logged in and MsalInterceptor is attaching valid tokens.
    provideAppInitializer(() => {
      const msalService = inject(MsalService);
      return firstValueFrom(
        msalService.initialize().pipe(
          switchMap(() => msalService.handleRedirectObservable()),
          tap(() => {
            if (!msalService.instance.getActiveAccount()) {
              const [firstAccount] = msalService.instance.getAllAccounts();
              if (firstAccount) {
                msalService.instance.setActiveAccount(firstAccount);
              }
            }
          }),
        ),
      );
    }),
  ],
};
