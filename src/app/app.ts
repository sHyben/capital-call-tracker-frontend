import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InteractionStatus } from '@azure/msal-browser';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RolesService } from './auth/roles.service';
import { LanguageService, AppLanguage } from './core/language.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    TranslatePipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly msalService = inject(MsalService);
  private readonly broadcastService = inject(MsalBroadcastService);
  private readonly rolesService = inject(RolesService);
  protected readonly languageService = inject(LanguageService);

  private readonly inProgress = toSignal(this.broadcastService.inProgress$, {
    initialValue: InteractionStatus.Startup,
  });

  protected readonly account = computed(() =>
    this.inProgress() === InteractionStatus.None ? this.msalService.instance.getActiveAccount() : null,
  );
  protected readonly isFundManager = computed(() => this.rolesService.roles().includes('FundManager'));
  protected readonly isInvestor = computed(() => this.rolesService.roles().includes('Investor'));

  protected signIn(): void {
    this.msalService.loginRedirect();
  }

  protected signOut(): void {
    this.msalService.logoutRedirect();
  }

  protected switchLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }
}
