import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TradingRoutingModule } from './trading-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, TradingRoutingModule],
})
export class TradingModule {}
