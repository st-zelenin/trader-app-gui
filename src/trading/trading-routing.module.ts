import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TradingComponent } from './trading.component';
import { UserResolver } from './user.resolver';
import { ExchangeUrlParams } from '../constants';

const routes: Routes = [
  {
    path: '',
    redirectTo: ExchangeUrlParams.GATE_IO,
    pathMatch: 'full',
  },

  {
    path: ':tab',
    component: TradingComponent,
    resolve: {
      user: UserResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradingRoutingModule {}
