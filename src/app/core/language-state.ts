import { Injectable, signal } from '@angular/core';

export type AppLanguage = 'en' | 'sk';

const STORAGE_KEY = 'capital-call-tracker.language';

function readPersisted(): AppLanguage {
  return localStorage.getItem(STORAGE_KEY) === 'sk' ? 'sk' : 'en';
}

/**
 * Holds just the current-language signal, with no dependency on TranslateService.
 * Kept separate from `LanguageService` so `languageInterceptor` can read the language
 * without pulling in TranslateService — TranslateService's own root config triggers an
 * HTTP request (the initial translation file load) which goes through this interceptor,
 * so injecting the TranslateService-dependent service there would be a circular dependency.
 */
@Injectable({ providedIn: 'root' })
export class LanguageState {
  readonly current = signal<AppLanguage>(readPersisted());

  persist(language: AppLanguage): void {
    localStorage.setItem(STORAGE_KEY, language);
  }
}
