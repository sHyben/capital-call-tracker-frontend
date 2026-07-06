import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { CapitalCallStatus } from '../models/capital-call.model';

const STATUS_CLASS: Record<CapitalCallStatus, string> = {
  DRAFT: 'status-draft',
  NOTICE_GENERATING: 'status-generating',
  ISSUED: 'status-issued',
  FUNDED: 'status-funded',
};

@Component({
  selector: 'app-status-chip',
  imports: [MatChipsModule, TranslatePipe],
  template: `
    <mat-chip [class]="statusClass()">{{ 'status.' + status() | translate }}</mat-chip>
  `,
  styles: `
    .status-draft {
      background-color: var(--mat-sys-surface-container-high);
    }
    .status-generating {
      background-color: var(--mat-sys-tertiary-container);
    }
    .status-issued {
      background-color: var(--mat-sys-primary-container);
    }
    .status-funded {
      background-color: var(--mat-sys-secondary-container);
    }
  `,
})
export class StatusChip {
  readonly status = input.required<CapitalCallStatus>();
  protected readonly statusClass = computed(() => STATUS_CLASS[this.status()]);
}
