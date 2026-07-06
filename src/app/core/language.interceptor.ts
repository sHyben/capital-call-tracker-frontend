import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LanguageState } from './language-state';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const language = inject(LanguageState).current();
  return next(req.clone({ setHeaders: { 'Accept-Language': language } }));
};
