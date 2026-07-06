import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { vi } from 'vitest';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  it('shows the localized message as a snackbar and rethrows the error', async () => {
    const open = vi.fn();
    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: { open } }],
    });

    const apiError = {
      status: 400,
      message: 'Suma musí byť kladná.',
      fieldErrors: { amount: 'Suma musí byť kladná.' },
      timestamp: new Date().toISOString(),
    };
    const errorResponse = new HttpErrorResponse({ status: 400, error: apiError });
    const req = new HttpRequest('GET', '/api/capital-calls');
    const next = () => throwError(() => errorResponse);

    const result$ = TestBed.runInInjectionContext(() => errorInterceptor(req, next));

    await expect(new Promise((_, reject) => result$.subscribe({ error: reject }))).rejects.toBe(
      errorResponse,
    );
    expect(open).toHaveBeenCalledWith(apiError.message, undefined, { duration: 5000 });
  });
});
