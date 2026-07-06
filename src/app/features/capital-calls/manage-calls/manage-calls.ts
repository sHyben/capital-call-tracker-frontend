import { Component, computed, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { Fund } from '../../../models/fund.model';
import { Investor } from '../../../models/investor.model';
import { CallForm } from './call-form';
import { CallList } from './call-list';

@Component({
  selector: 'app-manage-calls',
  imports: [MatFormFieldModule, MatInputModule, MatCardModule, TranslatePipe, CallForm, CallList],
  templateUrl: './manage-calls.html',
  styles: `
    .picker-card {
      margin-bottom: 16px;
    }
    .picker-card mat-card-content {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .call-list-spacer {
      margin-top: 16px;
    }
  `,
})
export class ManageCalls {
  protected readonly fundsResource = httpResource<Fund[]>(() => `${environment.apiBaseUrl}/funds`, {
    defaultValue: [],
  });

  protected readonly selectedFundId = signal<number | null>(null);

  protected readonly investorsResource = httpResource<Investor[]>(
    () => {
      const fundId = this.selectedFundId();
      return fundId ? `${environment.apiBaseUrl}/funds/${fundId}/investors` : undefined;
    },
    { defaultValue: [] },
  );

  protected readonly selectedInvestorId = signal<number | null>(null);

  protected readonly selectedInvestor = computed(() =>
    this.investorsResource.value().find((investor) => investor.id === this.selectedInvestorId()),
  );

  protected onFundChange(value: string): void {
    this.selectedFundId.set(value ? Number(value) : null);
    this.selectedInvestorId.set(null);
  }

  protected onInvestorChange(value: string): void {
    this.selectedInvestorId.set(value ? Number(value) : null);
  }
}
