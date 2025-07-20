import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  {
    path: 'trades',
    loadChildren: () => import('../trading/trading.routes').then((m) => m.TRADING_ROUTES),
    canActivate: [MsalGuard],
  },
  { path: '**', redirectTo: 'trades' },
];
