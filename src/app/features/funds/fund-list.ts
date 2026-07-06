import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { Fund } from '../../models/fund.model';

@Component({
  selector: 'app-fund-list',
  imports: [MatTableModule, MatProgressSpinnerModule, MatCardModule, TranslatePipe, DecimalPipe],
  templateUrl: './fund-list.html',
})
export class FundList {
  protected readonly fundsResource = httpResource<Fund[]>(() => `${environment.apiBaseUrl}/funds`, {
    defaultValue: [],
  });

  protected readonly displayedColumns = ['name', 'targetSize'];
}
