import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { InteractionStatus } from '@azure/msal-browser';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { provideTranslateService } from '@ngx-translate/core';
import { App } from './app';

class FakeMsalService {
  instance = { getActiveAccount: () => null };
  loginRedirect() {}
  logoutRedirect() {}
}

class FakeMsalBroadcastService {
  inProgress$ = of(InteractionStatus.None);
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideTranslateService({ lang: 'en', fallbackLang: 'en' }),
        { provide: MsalService, useClass: FakeMsalService },
        { provide: MsalBroadcastService, useClass: FakeMsalBroadcastService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
