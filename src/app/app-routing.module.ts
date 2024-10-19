import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: 'trades',
    loadChildren: () => import('../trading/trading.module').then((m) => m.TradingModule),
    canActivate: [MsalGuard],
  },
  { path: '**', redirectTo: 'trades' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
