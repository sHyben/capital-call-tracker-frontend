import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppLanguage, LanguageState } from './language-state';

export type { AppLanguage };

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly state = inject(LanguageState);

  readonly current = this.state.current;

  constructor() {
    // provideTranslateService({ lang: 'en' }) already activates 'en' during TranslateService's
    // own construction. Only switch languages here if the persisted choice differs, and defer
    // it a tick so this service finishes constructing first.
    const persisted = this.current();
    if (persisted !== 'en') {
      queueMicrotask(() => this.translate.use(persisted));
    }
  }

  setLanguage(language: AppLanguage): void {
    this.state.current.set(language);
    this.state.persist(language);
    this.translate.use(language);
  }
}
