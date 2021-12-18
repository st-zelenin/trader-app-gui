import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EXCHANGE_URL_PARAMS } from '../constants';
import { TradingComponent } from './trading.component';
import { UserResolver } from './user.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: EXCHANGE_URL_PARAMS.GATE_IO,
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
