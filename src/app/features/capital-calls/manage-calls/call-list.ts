import { Component, inject, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { CapitalCall } from '../../../models/capital-call.model';
import { StatusChip } from '../../../shared/status-chip';

@Component({
  selector: 'app-call-list',
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCardModule,
    TranslatePipe,
    DecimalPipe,
    StatusChip,
  ],
  templateUrl: './call-list.html',
})
export class CallList {
  private readonly http = inject(HttpClient);

  readonly investorId = input.required<number>();

  protected readonly callsResource = httpResource<CapitalCall[]>(
    () => `${environment.apiBaseUrl}/capital-calls/by-investor/${this.investorId()}`,
    { defaultValue: [] },
  );

  protected readonly generatingIds = signal<ReadonlySet<number>>(new Set());
  protected readonly displayedColumns = ['amount', 'dueDate', 'status', 'notice', 'actions'];

  reload(): void {
    this.callsResource.reload();
  }

  protected isGenerating(call: CapitalCall): boolean {
    return call.status === 'NOTICE_GENERATING' || this.generatingIds().has(call.id);
  }

  protected async generateNotice(call: CapitalCall): Promise<void> {
    this.generatingIds.update((ids) => new Set(ids).add(call.id));
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiBaseUrl}/capital-calls/${call.id}/generate-notice`, {}),
      );
    } finally {
      this.generatingIds.update((ids) => {
        const next = new Set(ids);
        next.delete(call.id);
        return next;
      });
      this.callsResource.reload();
    }
  }
}
