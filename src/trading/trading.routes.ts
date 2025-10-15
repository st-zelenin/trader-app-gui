import { Routes } from '@angular/router';

import { TradingComponent } from './trading.component';
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
  },
];
