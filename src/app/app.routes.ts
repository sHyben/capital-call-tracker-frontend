import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { roleGuard } from './auth/role.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [MsalGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/funds/fund-list').then((m) => m.FundList),
      },
      {
        path: 'funds',
        loadComponent: () => import('./features/funds/fund-list').then((m) => m.FundList),
      },
      {
        path: 'my-calls',
        canActivate: [roleGuard],
        data: { requiredRole: 'Investor' },
        loadComponent: () =>
          import('./features/capital-calls/my-calls/my-calls').then((m) => m.MyCalls),
      },
      {
        path: 'manage-calls',
        canActivate: [roleGuard],
        data: { requiredRole: 'FundManager' },
        loadComponent: () =>
          import('./features/capital-calls/manage-calls/manage-calls').then((m) => m.ManageCalls),
      },
    ],
  },
];
