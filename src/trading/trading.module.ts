import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { TradingRoutingModule } from './trading-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, TradingRoutingModule],
  providers: [DecimalPipe],
})
export class TradingModule {}
