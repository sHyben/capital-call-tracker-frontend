import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { CapitalCall } from '../../../models/capital-call.model';
import { StatusChip } from '../../../shared/status-chip';

@Component({
  selector: 'app-my-calls',
  imports: [MatTableModule, MatProgressSpinnerModule, TranslatePipe, DecimalPipe, StatusChip],
  templateUrl: './my-calls.html',
})
export class MyCalls {
  protected readonly callsResource = httpResource<CapitalCall[]>(
    () => `${environment.apiBaseUrl}/capital-calls/mine`,
    { defaultValue: [] },
  );

  protected readonly displayedColumns = ['amount', 'dueDate', 'status', 'noticeDocumentUrl'];
}
