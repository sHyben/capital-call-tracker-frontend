import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models/api-error.model';

/**
 * Central place for surfacing API errors: shows the server's already-localized
 * `message` as a snackbar, then rethrows the original error so callers (e.g. a
 * Signal Forms `submit()` action) can still read `error.error.fieldErrors`
 * themselves to attach field-level errors.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const apiError = error.error as ApiError | undefined;
        const message = apiError?.message ?? error.message;
        snackBar.open(message, undefined, { duration: 5000 });
      }
      return throwError(() => error);
    }),
  );
};
