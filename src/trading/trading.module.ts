import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TradingRoutingModule } from './trading-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, TradingRoutingModule],
  providers: [DecimalPipe],
})
export class TradingModule {}
