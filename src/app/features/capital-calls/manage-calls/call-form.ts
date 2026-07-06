import { Component, effect, inject, input, output, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { form, FormField, FormRoot, required, min, submit } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { CapitalCall, CreateCapitalCallRequest } from '../../../models/capital-call.model';
import { ApiError } from '../../../models/api-error.model';
import { Investor } from '../../../models/investor.model';

@Component({
  selector: 'app-call-form',
  imports: [
    FormField,
    FormRoot,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    TranslatePipe,
  ],
  templateUrl: './call-form.html',
  styles: `
    form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .form-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .form-row mat-form-field {
      flex: 1;
      min-width: 180px;
    }
    button[type='submit'] {
      align-self: flex-start;
    }
  `,
})
export class CallForm {
  private readonly http = inject(HttpClient);

  readonly investor = input.required<Investor>();
  readonly created = output<void>();

  protected readonly model = signal<CreateCapitalCallRequest>({
    investorId: 0,
    amount: 0,
    dueDate: '',
  });

  protected readonly callForm = form(this.model, (f) => {
    required(f.investorId);
    required(f.amount);
    min(f.amount, 0.01);
    required(f.dueDate);
  });

  constructor() {
    effect(() => {
      const investorId = this.investor().id;
      this.model.update((current) => ({ ...current, investorId }));
    });
  }

  protected async onSubmit(): Promise<void> {
    await submit(this.callForm, {
      action: async () => {
        try {
          await firstValueFrom(
            this.http.post<CapitalCall>(`${environment.apiBaseUrl}/capital-calls`, this.model()),
          );
          this.created.emit();
          this.model.set({ investorId: this.investor().id, amount: 0, dueDate: '' });
          return undefined;
        } catch (err) {
          if (err instanceof HttpErrorResponse && err.error) {
            const apiError = err.error as ApiError;
            if (apiError.fieldErrors) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const fieldTrees = this.callForm as unknown as Record<string, any>;
              return Object.entries(apiError.fieldErrors)
                .filter(([field]) => field in fieldTrees)
                .map(([field, message]) => ({
                  fieldTree: fieldTrees[field],
                  kind: 'server',
                  message,
                }));
            }
          }
          throw err;
        }
      },
    });
  }
}
