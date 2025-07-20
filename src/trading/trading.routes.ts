import { Routes } from '@angular/router';

import { TradingComponent } from './trading.component';
import { UserResolver } from './user.resolver';
import { ExchangeUrlParams } from '../constants';

export const TRADING_ROUTES: Routes = [
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
