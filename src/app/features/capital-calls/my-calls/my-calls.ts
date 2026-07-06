import { Component, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { CapitalCall } from '../../../models/capital-call.model';
import { StatusChip } from '../../../shared/status-chip';

@Component({
  selector: 'app-my-calls',
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    TranslatePipe,
    DecimalPipe,
    StatusChip,
  ],
  templateUrl: './my-calls.html',
})
export class MyCalls {
  protected readonly callsResource = httpResource<CapitalCall[]>(
    () => `${environment.apiBaseUrl}/capital-calls/mine`,
    { defaultValue: [] },
  );

  protected readonly callCount = computed(() => this.callsResource.value().length);
  protected readonly totalAmount = computed(() =>
    this.callsResource.value().reduce((sum, call) => sum + call.amount, 0),
  );

  protected readonly displayedColumns = ['amount', 'dueDate', 'status', 'noticeDocumentUrl'];
}
